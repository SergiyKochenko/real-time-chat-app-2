import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Conversation from "./Conversation.jsx";

const useConversationMock = vi.fn();
const socketContextMock = vi.fn();

vi.mock("../../zustand/useConversation", () => ({
  __esModule: true,
  default: () => useConversationMock(),
}));

vi.mock("../../context/SocketContext", () => ({
  useSocketContext: () => socketContextMock(),
}));

vi.mock("../../assets/default-avatar.svg", () => ({
  default: "default-avatar.svg",
}));

describe("Conversation component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a fallback avatar when none is provided", () => {
    const setSelectedConversation = vi.fn();
    useConversationMock.mockReturnValue({
      selectedConversation: null,
      setSelectedConversation,
    });
    socketContextMock.mockReturnValue({ onlineUsers: [] });

    render(
      <Conversation
        conversation={{ _id: "1", fullName: "Jane Doe", profilePic: "" }}
        lastIdx={false}
        emoji="😊"
      />
    );

    const avatar = screen.getByAltText(/user avatar/i);
    expect(avatar.getAttribute("src")).toBe("default-avatar.svg");
  });

  it("highlights the selected conversation and handles clicks", () => {
    const conversation = { _id: "1", fullName: "Jane" };
    const setSelectedConversation = vi.fn();
    useConversationMock.mockReturnValue({
      selectedConversation: conversation,
      setSelectedConversation,
    });
    socketContextMock.mockReturnValue({ onlineUsers: ["1"] });

    render(<Conversation conversation={conversation} lastIdx emoji="🔥" />);

    const wrapper = screen.getByTestId("conversation-1");
    expect(wrapper?.className).toContain("bg-sky-500");

    fireEvent.click(wrapper);
    expect(setSelectedConversation).toHaveBeenCalledWith(conversation);

    const badge = screen.getByAltText(/user avatar/i).parentElement?.parentElement;
    expect(badge?.className).toContain("online");
  });
});
