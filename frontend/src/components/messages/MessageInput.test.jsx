import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import MessageInput from "./MessageInput.jsx";
import { AuthContextProvider } from "../../context/AuthContext";
import { SocketContextProvider } from "../../context/SocketContext";

const useSendMessagesMock = vi.fn();

vi.mock("../../hooks/useSendMessages", () => ({
  __esModule: true,
  default: () => useSendMessagesMock(),
}));

describe("MessageInput", () => {
  vi.mock("../../context/AuthContext", async () => {
    const actual = await vi.importActual("../../context/AuthContext");
    return {
      ...actual,
    };
  });
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const Providers = ({ children }) => (
    <AuthContextProvider>
      <SocketContextProvider>{children}</SocketContextProvider>
    </AuthContextProvider>
  );

  it("sends a message and clears the field", async () => {
    const sendMessage = vi.fn().mockResolvedValue();
    useSendMessagesMock.mockReturnValue({ loading: false, sendMessage });

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

    expect(sendMessage).toHaveBeenCalledWith("Hello");
    expect(input).toHaveValue("");
  });

  it("shows spinner while loading", () => {
    useSendMessagesMock.mockReturnValue({
      loading: true,
      sendMessage: vi.fn(),
    });

    const { container } = render(
      <Providers>
        <MessageInput />
      </Providers>
    );

    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
  });
});
