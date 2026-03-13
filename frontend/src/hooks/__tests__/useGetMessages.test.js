import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useGetMessages from "../useGetMessages.js";

const hoisted = vi.hoisted(() => ({
  useConversationPath: new URL("../../zustand/useConversation.js", import.meta.url).pathname,
  useConversationMock: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock(hoisted.useConversationPath, () => ({
  __esModule: true,
  default: () => hoisted.useConversationMock(),
}));

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { error: hoisted.toastError },
}));

describe("useGetMessages", () => {
  const setMessages = vi.fn();

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
    global.fetch.mockResolvedValue({ json: () => Promise.resolve([{ _id: "1" }]) });

    const { result } = renderHook(() => useGetMessages());

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/api/messages/abc"));
    await waitFor(() => expect(setMessages).toHaveBeenCalledWith([{ _id: "1" }]));
    expect(result.current.loading).toBe(false);
  });

  it("handles errors", async () => {
    global.fetch.mockResolvedValue({ json: () => Promise.resolve({ error: "Boom" }) });

    renderHook(() => useGetMessages());

    await waitFor(() => expect(hoisted.toastError).toHaveBeenCalledWith("Boom"));
  });
});
