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
  __esModule: true,
  default: () => hoisted.useConversationMock(),
}));

vi.mock(hoisted.soundPath, () => ({
  default: "sound.mp3",
}));

describe("useListenMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.useConversationMock.mockReturnValue({
      messages: [],
      setMessages: vi.fn(),
    });
    vi.spyOn(window, "Audio").mockImplementation(() => ({ play: vi.fn() }));
  });

  it("subscribes to socket events", () => {
    let handler;
    hoisted.socketOn.mockImplementation((event, cb) => {
      if (event === "newMessage") handler = cb;
    });

    const state = { messages: [], setMessages: vi.fn() };
    hoisted.useConversationMock.mockReturnValue(state);

    const { unmount } = renderHook(() => useListenMessages());

    const payload = { _id: "1", message: "hello" };
    handler(payload);

    expect(state.setMessages).toHaveBeenCalledWith([payload]);
    expect(payload.shouldShake).toBe(true);
    unmount();
    expect(hoisted.socketOff).toHaveBeenCalledWith("newMessage");
  });
});
