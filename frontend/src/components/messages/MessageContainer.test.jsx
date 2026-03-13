import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import MessageContainer from "./MessageContainer.jsx";
import { AuthContextProvider } from "../../context/AuthContext";
import { SocketContextProvider } from "../../context/SocketContext";

const useConversationMock = vi.fn();

vi.mock("../../zustand/useConversation", () => ({
// Removed mock for useConversation, will use real provider

vi.mock("./MessageInput", () => ({
  __esModule: true,
  default: () => <div data-testid="message-input">input</div>,
}));

vi.mock("./Messages", () => ({
  __esModule: true,
  default: () => <div data-testid="message-list">messages</div>,
}));

vi.mock("../../context/AuthContext", async () => {
// Removed mock for useAuthContext, will use real provider

describe("MessageContainer", () => {
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

  it("renders placeholder when no conversation selected", () => {
    render(
      <Providers>
        <MessageContainer />
      </Providers>
    );
    // Add assertions for default state if needed
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.queryByTestId("message-input")).toBeNull();
  });

  it("renders header and children when conversation selected", async () => {
    const { unmount } = render(
      <Providers>
        <MessageContainer />
      </Providers>
    );
    // Add assertions for default state if needed
    expect(screen.getByText(/To:/i)).toBeInTheDocument();
    expect(screen.getByTestId("message-input")).toBeInTheDocument();
    expect(screen.getByTestId("message-list")).toBeInTheDocument();

    unmount();
    await waitFor(() =>
      expect(setSelectedConversation).toHaveBeenCalledWith(null),
    );
  });
});
