import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Message from "./Message.jsx";

const useConversationMock = vi.fn();
const useAuthContextMock = vi.fn();

vi.mock("../../zustand/useConversation.js", () => ({
  __esModule: true,
  default: () => useConversationMock(),
}));

vi.mock("../../context/AuthContext.jsx", () => ({
  useAuthContext: () => useAuthContextMock(),
}));

vi.mock("../../assets/default-avatar.svg", () => ({
  default: "default-avatar.svg",
}));

describe("Message component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the current user's message with the correct styling", () => {
    useAuthContextMock.mockReturnValue({
      authUser: { _id: "user-1", profilePic: "self.png" },
    });
    useConversationMock.mockReturnValue({
      selectedConversation: { profilePic: "other.png" },
    });

    render(
      <Message
        message={{
          senderId: "user-1",
          createdAt: new Date().toISOString(),
          message: "Hello",
        }}
      />,
    );

    const container = screen.getByText("Hello").closest("div.chat");
    expect(container?.className).toContain("chat-end");

    const bubble = screen.getByText("Hello");
    expect(bubble.className).toContain("bg-blue-500");

    const avatar = screen.getByAltText(/tailwind css chat bubble component/i);
    expect(avatar.getAttribute("src")).toBe("self.png");
  });

  it("falls back to the default avatar when the conversation has no image", () => {
    useAuthContextMock.mockReturnValue({
      authUser: { _id: "user-1", profilePic: "self.png" },
    });
    useConversationMock.mockReturnValue({
      selectedConversation: { profilePic: "" },
    });

    render(
      <Message
        message={{
          senderId: "other",
          createdAt: new Date().toISOString(),
          message: "Hi",
        }}
      />,
    );

    const avatar = screen.getByAltText(/tailwind css chat bubble component/i);
    expect(avatar.getAttribute("src")).toBe("default-avatar.svg");
  });
});
