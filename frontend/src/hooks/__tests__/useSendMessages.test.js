import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useSendMessages from "../useSendMessages.js";

const hoisted = vi.hoisted(() => ({
  useConversationPath: new URL(
    "../../zustand/useConversation.js",
    import.meta.url,
  ).pathname,
  useConversationMock: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock(hoisted.useConversationPath, () => ({
  __esModule: true,
  default: () => hoisted.useConversationMock(),
}));

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { error: (msg) => hoisted.toastError(msg) },
}));

describe("useSendMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it("posts a message and updates store", async () => {
    const setMessages = vi.fn();
    hoisted.useConversationMock.mockReturnValue({
      selectedConversation: { _id: "123" },
      messages: [],
      setMessages,
    });
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ _id: "m", message: "hi" }),
    });

    const { result } = renderHook(() => useSendMessages());

    await act(async () => {
      await result.current.sendMessage("hi");
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/messages/send/123",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ message: "hi" }),
      }),
    );
    expect(setMessages).toHaveBeenCalledWith([{ _id: "m", message: "hi" }]);
  });

  it("shows toast when API fails", async () => {
    hoisted.useConversationMock.mockReturnValue({
      selectedConversation: { _id: "123" },
      messages: [],
      setMessages: vi.fn(),
    });
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ error: "Boom" }),
    });

    const { result } = renderHook(() => useSendMessages());

    await act(async () => {
      await result.current.sendMessage("hi");
    });

    expect(hoisted.toastError).toHaveBeenCalledWith("Boom");
  });
});
