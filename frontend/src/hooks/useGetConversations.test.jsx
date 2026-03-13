import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useGetConversations from "./useGetConversations.js";

const { toastErrorMock } = vi.hoisted(() => ({
  toastErrorMock: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: toastErrorMock,
  },
}));

describe("useGetConversations", () => {
  const { ConversationProvider } = require("../zustand/useConversation");
  const originalFetch = global.fetch;
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("loads conversations successfully", async () => {
    const conversations = [{ _id: "1", fullName: "Jane" }];
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(conversations),
    });
    const wrapper = ({ children }) => <ConversationProvider>{children}</ConversationProvider>;
    const { result } = renderHook(() => useGetConversations(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.conversations).toEqual(conversations);
    expect(global.fetch).toHaveBeenCalledWith("/api/users");
  });

  it("shows an error toast when the API fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ error: "Boom" }),
    });
    const wrapper = ({ children }) => <ConversationProvider>{children}</ConversationProvider>;
    const { result } = renderHook(() => useGetConversations(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(toastErrorMock).toHaveBeenCalledWith("Boom");
    expect(result.current.conversations).toEqual([]);
  });
});
