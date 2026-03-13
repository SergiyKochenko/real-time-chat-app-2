import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useGetMessages from "../useGetMessages.js";

const hoisted = vi.hoisted(() => ({
  toastError: vi.fn(),
}));

vi.mock(hoisted.useConversationPath, () => ({
  // Removed mock for useConversation, will use real provider

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { error: hoisted.toastError },
}));

describe("useGetMessages", () => {
  const setMessages = vi.fn();
  const { ConversationProvider } = require("../../zustand/useConversation");

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    hoisted.useConversationMock.mockReturnValue({
      selectedConversation: { _id: "abc" },
      messages: [],
      setMessages,
    });
  });

  afterEach(() => {
    delete global.fetch;
  });

  it("fetches and stores messages", async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve([{ _id: "1" }]),
    });

    const wrapper = ({ children }) => <ConversationProvider>{children}</ConversationProvider>;
    const { result } = renderHook(() => useGetMessages(), { wrapper });

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/api/messages/abc"),
    );
    await waitFor(() =>
      expect(setMessages).toHaveBeenCalledWith([{ _id: "1" }]),
    );
    expect(result.current.loading).toBe(false);
  });

  it("handles errors", async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ error: "Boom" }),
    });

    renderHook(() => useGetMessages());

    await waitFor(() =>
      expect(hoisted.toastError).toHaveBeenCalledWith("Boom"),
    );
  });
});
