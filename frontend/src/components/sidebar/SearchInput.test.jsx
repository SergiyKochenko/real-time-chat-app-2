import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchInput from "./SearchInput.jsx";

const useConversationMock = vi.fn();
const useGetConversationsMock = vi.fn();
const toastError = vi.fn();

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { error: (msg) => toastError(msg) },
}));

vi.mock("../../zustand/useConversation", () => ({
  __esModule: true,
  default: () => useConversationMock(),
}));

vi.mock("../../hooks/useGetConversations", () => ({
  __esModule: true,
  default: () => useGetConversationsMock(),
}));

describe("SearchInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useConversationMock.mockReturnValue({ setSelectedConversation: vi.fn() });
    useGetConversationsMock.mockReturnValue({ conversations: [] });
  });

  it("validates term length", () => {
    render(<SearchInput />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "ab" },
    });
    fireEvent.submit(screen.getByRole("button"));

    expect(toastError).toHaveBeenCalledWith(
      "Search term must be at least 3 characters long",
    );
  });

  it("selects matching conversation", () => {
    const setSelectedConversation = vi.fn();
    useConversationMock.mockReturnValue({ setSelectedConversation });
    useGetConversationsMock.mockReturnValue({
      conversations: [{ _id: "1", fullName: "Jane Doe" }],
    });

    render(<SearchInput />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "jane" },
    });
    fireEvent.submit(screen.getByRole("button"));

    expect(setSelectedConversation).toHaveBeenCalledWith({
      _id: "1",
      fullName: "Jane Doe",
    });
    expect(screen.getByPlaceholderText(/search/i)).toHaveValue("");
  });

  it("shows toast when user missing", () => {
    render(<SearchInput />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "john" },
    });
    fireEvent.submit(screen.getByRole("button"));

    expect(toastError).toHaveBeenCalledWith("No such user found!");
  });
});
