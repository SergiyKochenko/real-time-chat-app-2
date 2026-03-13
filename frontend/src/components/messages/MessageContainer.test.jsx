import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import MessageContainer from "./MessageContainer.jsx";
import { AuthContextProvider } from "../../context/AuthContext";
import { SocketContextProvider } from "../../context/SocketContext";

const useConversationMock = vi.fn();
const useAuthContextMock = vi.fn();

vi.mock("../../zustand/useConversation", () => ({
  __esModule: true,
  default: () => useConversationMock(),
}));

vi.mock("./MessageInput", () => ({
  __esModule: true,
  default: () => <div data-testid="message-input">input</div>,
}));

vi.mock("./Messages", () => ({
  __esModule: true,
  default: () => <div data-testid="message-list">messages</div>,
}));

vi.mock("../../context/AuthContext", async () => {
  const actual = await vi.importActual("../../context/AuthContext");
  return {
    ...actual,
    useAuthContext: () => useAuthContextMock(),
  };
});

describe("MessageContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const Providers = ({ children }) => (
    <AuthContextProvider>
      <SocketContextProvider>{children}</SocketContextProvider>
    </AuthContextProvider>
  );

  it("renders placeholder when no conversation selected", () => {
    useConversationMock.mockReturnValue({
      selectedConversation: null,
      setSelectedConversation: vi.fn(),
    });
    useAuthContextMock.mockReturnValue({ authUser: { fullName: "Tester" } });

    render(
      <Providers>
        <MessageContainer />
      </Providers>
    );

    expect(screen.getByText(/welcome/i)).toHaveTextContent("Tester");
    expect(screen.queryByTestId("message-input")).toBeNull();
  });

  it("renders header and children when conversation selected", async () => {
    const setSelectedConversation = vi.fn();
    useConversationMock.mockReturnValue({
      selectedConversation: { _id: "1", fullName: "Jane" },
      setSelectedConversation,
    });
    useAuthContextMock.mockReturnValue({ authUser: { fullName: "Tester" } });

    const { unmount } = render(
      <Providers>
        <MessageContainer />
      </Providers>
    );

    expect(screen.getByText(/To:/i)).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByTestId("message-input")).toBeInTheDocument();
    expect(screen.getByTestId("message-list")).toBeInTheDocument();

    unmount();
    await waitFor(() =>
      expect(setSelectedConversation).toHaveBeenCalledWith(null),
    );
  });
});
