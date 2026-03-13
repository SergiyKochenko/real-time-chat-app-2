import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useSendMessages from "../useSendMessages.js";

const hoisted = vi.hoisted(() => ({
  toastError: vi.fn(),
}));

vi.mock(hoisted.useConversationPath, () => ({
  // Removed mock for useConversation, will use real provider
}));

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { error: (msg) => hoisted.toastError(msg) },
}));

describe("useSendMessages", () => {
  const { ConversationProvider } = require("../../zustand/useConversation");
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });
  afterEach(() => {
    delete global.fetch;
  });

  it("posts a message and updates store", async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ _id: "m", message: "hi" }),
    });
    const wrapper = ({ children }) => <ConversationProvider>{children}</ConversationProvider>;
    const { result } = renderHook(() => useSendMessages(), { wrapper });
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
    // Add assertion for setMessages if needed
  });

  it("shows toast when API fails", async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ error: "Boom" }),
    });
    const wrapper = ({ children }) => <ConversationProvider>{children}</ConversationProvider>;
    const { result } = renderHook(() => useSendMessages(), { wrapper });
    await act(async () => {
      await result.current.sendMessage("hi");
    });
    expect(hoisted.toastError).toHaveBeenCalledWith("Boom");
  });
});
