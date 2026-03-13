import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Messages from "./Messages.jsx";
import { AuthContextProvider } from "../../context/AuthContext";
import { SocketContextProvider } from "../../context/SocketContext";

const useGetMessagesMock = vi.fn();

// Removed mock for useGetMessages, will use real provider

vi.mock("../../hooks/useListenMessages", async () => {
  const actual = await vi.importActual("../../hooks/useListenMessages");
  return {
    __esModule: true,
    ...actual,
    default: vi.fn(),
  };
});

vi.mock("./Message", async () => {
  const actual = await vi.importActual("./Message");
  return {
    __esModule: true,
    ...actual,
    default: ({ message }) => <div>{message.message}</div>,
  };
});

vi.mock("../skeletons/MessageSkeleton", async () => {
  const actual = await vi.importActual("../skeletons/MessageSkeleton");
  return {
    __esModule: true,
    ...actual,
    default: () => <div role="status">skeleton</div>,
  };
});

describe("Messages", () => {
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

  it("renders skeletons while loading", () => {
    render(
      <Providers>
        <Messages />
      </Providers>
    );
    expect(screen.getAllByRole("status")).toHaveLength(3);
  });

  it("renders message list when available", () => {
    render(
      <Providers>
        <Messages />
      </Providers>
    );
    // Add assertions for default state if needed
    expect(screen.getByText("hi")).toBeInTheDocument();
    expect(screen.getByText("there")).toBeInTheDocument();
  });

  it("shows empty state when no messages", () => {
    render(
      <Providers>
        <Messages />
      </Providers>
    );
    expect(screen.getByText(/send a message/i)).toBeInTheDocument();
  });
});
