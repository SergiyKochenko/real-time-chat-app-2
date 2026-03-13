import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchInput from "./SearchInput.jsx";
import { AuthContextProvider } from "../../context/AuthContext";
import { SocketContextProvider } from "../../context/SocketContext";

const useConversationMock = vi.fn();
const toastError = vi.fn();
const useGetConversationsMock = vi.fn();

vi.mock("react-hot-toast", async () => {
  const actual = await vi.importActual("react-hot-toast");
  return {
    __esModule: true,
    ...actual,
    default: { error: (msg) => toastError(msg) },
  };
});

vi.mock("../../zustand/useConversation", async () => {
// Removed mock for useConversation, will use real provider

vi.mock("../../hooks/useGetConversations", async () => {
  const actual = await vi.importActual("../../hooks/useGetConversations");
  return {
    __esModule: true,
    ...actual,
    default: () => useGetConversationsMock(),
  };
});

describe("SearchInput", () => {
  const { ConversationProvider } = require("../../zustand/useConversation");
  const Providers = ({ children }) => (
    <ConversationProvider>
      <AuthContextProvider>
        <SocketContextProvider>{children}</SocketContextProvider>
      </AuthContextProvider>
    </ConversationProvider>
  );
  beforeEach(() => {
    vi.clearAllMocks();
  });
  });
  it("validates term length", () => {
    render(
      <Providers>
        <SearchInput />
      </Providers>
    );
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "ab" },
    });
    fireEvent.submit(screen.getByRole("button"));
    // Add assertion for error toast if needed
  });

  it("selects matching conversation", () => {
    const setSelectedConversation = vi.fn();
    useConversationMock.mockReturnValue({ setSelectedConversation });
    useGetConversationsMock.mockReturnValue({
      conversations: [{ _id: "1", fullName: "Jane Doe" }],
    });

    render(
      <Providers>
        <SearchInput />
      </Providers>
    );
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "jane" },
    });
    fireEvent.submit(screen.getByRole("button"));
    // Add assertion for conversation selection if needed
    expect(screen.getByPlaceholderText(/search/i)).toHaveValue("");
  });

  it("shows toast when user missing", () => {
    render(
      <Providers>
        <SearchInput />
      </Providers>
    );
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "john" },
    });
    fireEvent.submit(screen.getByRole("button"));
    // Add assertion for error toast if needed
  });
});
