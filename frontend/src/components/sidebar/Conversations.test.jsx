import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Conversations from "./Conversations.jsx";

const useGetConversationsMock = vi.fn();

vi.mock("../../hooks/useGetConversations", () => ({
  __esModule: true,
  default: () => useGetConversationsMock(),
}));

vi.mock("./Conversation", () => ({
  __esModule: true,
  default: ({ conversation }) => <div>{conversation.fullName}</div>,
}));

vi.mock("../../utils/emojis", () => ({
  getRandomEmoji: vi.fn(() => "🔥"),
}));

describe("Conversations list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders conversation entries", () => {
    useGetConversationsMock.mockReturnValue({
      loading: false,
      conversations: [
        { _id: "1", fullName: "Jane" },
        { _id: "2", fullName: "John" },
      ],
    });

    render(<Conversations />);

    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("shows spinner while loading", () => {
    useGetConversationsMock.mockReturnValue({
      loading: true,
      conversations: [],
    });

    const { container } = render(<Conversations />);

    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
  });
});
