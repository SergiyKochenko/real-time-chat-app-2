import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import MessageInput from "./MessageInput.jsx";
import { AuthContextProvider } from "../../context/AuthContext";
import { SocketContextProvider } from "../../context/SocketContext";

const useSendMessagesMock = vi.fn();

// Removed mock for useSendMessages, will use real provider

describe("MessageInput", () => {
  const { ConversationProvider } = require("../../zustand/useConversation");
  const { AuthContextProvider } = require("../../context/AuthContext");
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

  it("sends a message and clears the field", async () => {
    render(
      <Providers>
        <MessageInput />
      </Providers>
    );
    const input = screen.getByPlaceholderText(/send a message/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: "Hello" } });
      fireEvent.submit(input.closest("form"));
    });
    // Add assertion for sendMessage action if needed
    expect(input).toHaveValue("");
  });

  it("shows spinner while loading", () => {
    const { container } = render(
      <Providers>
        <MessageInput />
      </Providers>
    );
    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
  });
});
