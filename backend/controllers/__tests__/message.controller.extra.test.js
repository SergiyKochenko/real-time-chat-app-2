import { describe, it, expect, beforeEach, vi } from "vitest";

const hoistedMocks = vi.hoisted(() => {
  const emitMock = vi.fn();
  const toMock = vi.fn(() => ({ emit: emitMock }));
  return { emitMock, toMock };
});

vi.mock("../../models/conversation.model.js", () => {
  const findOne = vi.fn();
  const create = vi.fn();
  return {
    __esModule: true,
    default: { findOne, create },
  };
});

vi.mock("../../models/message.model.js", () => {
  const MessageMock = vi.fn();
  return {
    __esModule: true,
    default: MessageMock,
  };
});

vi.mock("../../socket/socket.js", () => ({
  __esModule: true,
  getReceiverSocketId: vi.fn(),
  io: { to: hoistedMocks.toMock },
  app: {},
  server: {},
}));

import Conversation from "../../models/conversation.model.js";
import Message from "../../models/message.model.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";
import { sendMessage, getMessages } from "../message.controller.js";

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("message controller", () => {
  const saveConversation = vi.fn();
  const saveMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    saveConversation.mockResolvedValue();
    saveMessage.mockResolvedValue();
    Message.mockImplementation((doc) => ({
      ...doc,
      _id: "message-id",
      save: saveMessage,
    }));
  });

  it("creates message and emits socket event", async () => {
    const conversationDoc = { messages: [], save: saveConversation };
    Conversation.findOne.mockResolvedValueOnce(conversationDoc);
    const req = {
      body: { message: "hello" },
      params: { id: "receiver" },
      user: { _id: "sender" },
    };
    const res = mockResponse();
    getReceiverSocketId.mockReturnValue("socket-1");

    await sendMessage(req, res);

    expect(conversationDoc.messages).toContain("message-id");
    expect(saveConversation).toHaveBeenCalled();
    expect(saveMessage).toHaveBeenCalled();
    expect(io.to).toHaveBeenCalledWith("socket-1");
    expect(hoistedMocks.emitMock).toHaveBeenCalledWith(
      "newMessage",
      expect.objectContaining({ message: "hello" })
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("creates conversation when none exists", async () => {
    const newConversation = { messages: [], save: saveConversation };
    Conversation.findOne.mockResolvedValueOnce(null);
    Conversation.create.mockResolvedValueOnce(newConversation);

    const req = {
      body: { message: "hi" },
      params: { id: "receiver" },
      user: { _id: "sender" },
    };
    const res = mockResponse();

    await sendMessage(req, res);

    expect(Conversation.create).toHaveBeenCalledWith({ participants: ["sender", "receiver"] });
    expect(newConversation.messages).toContain("message-id");
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("returns conversation messages when found", async () => {
    const populated = { messages: [{ _id: "1", message: "hi" }] };
    const populate = vi.fn().mockResolvedValueOnce(populated);
    Conversation.findOne.mockReturnValueOnce({ populate });

    const req = { params: { id: "receiver" }, user: { _id: "sender" } };
    const res = mockResponse();

    await getMessages(req, res);

    expect(populate).toHaveBeenCalledWith("messages");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(populated.messages);
  });

  it("returns empty array when conversation missing", async () => {
    const populate = vi.fn().mockResolvedValueOnce(null);
    Conversation.findOne.mockReturnValueOnce({ populate });
    const req = { params: { id: "receiver" }, user: { _id: "sender" } };
    const res = mockResponse();

    await getMessages(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });
});
