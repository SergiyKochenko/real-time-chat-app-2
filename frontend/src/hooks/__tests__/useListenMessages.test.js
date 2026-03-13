import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useListenMessages from "../useListenMessages.js";

const hoisted = vi.hoisted(() => ({
  socketContextPath: new URL("../../context/SocketContext.jsx", import.meta.url)
    .pathname,
  conversationPath: new URL("../../zustand/useConversation.js", import.meta.url)
    .pathname,
  soundPath: new URL("../../assets/sounds/notification.mp3", import.meta.url)
    .pathname,
  useConversationMock: vi.fn(),
  socketOn: vi.fn(),
  socketOff: vi.fn(),
}));

vi.mock(hoisted.socketContextPath, () => ({
  __esModule: true,
  useSocketContext: () => ({
    socket: { on: hoisted.socketOn, off: hoisted.socketOff },
  }),
}));

vi.mock(hoisted.conversationPath, () => ({
// Removed mock for useConversation, will use real provider

vi.mock(hoisted.soundPath, () => ({
  default: "sound.mp3",
}));

describe("useListenMessages", () => {
  const { ConversationProvider } = require("../../zustand/useConversation");
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "Audio").mockImplementation(() => ({ play: vi.fn() }));
  });

  it("subscribes to socket events", () => {
    let handler;
    hoisted.socketOn.mockImplementation((event, cb) => {
      if (event === "newMessage") handler = cb;
    });

    const wrapper = ({ children }) => <ConversationProvider>{children}</ConversationProvider>;
    const { result, unmount } = renderHook(() => useListenMessages(), { wrapper });

    const payload = { _id: "1", message: "hello" };
    handler(payload);

    // Access setMessages from context
    const { setMessages } = require("../../zustand/useConversation").useConversation();
    expect(setMessages).toHaveBeenCalledWith([payload]);
    expect(payload.shouldShake).toBe(true);
    unmount();
    expect(hoisted.socketOff).toHaveBeenCalledWith("newMessage");
  });
});
