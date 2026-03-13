import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Messages from "./Messages.jsx";

const useGetMessagesMock = vi.fn();

vi.mock("../../hooks/useGetMessages", () => ({
  __esModule: true,
  default: () => useGetMessagesMock(),
}));

vi.mock("../../hooks/useListenMessages", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("./Message", () => ({
  __esModule: true,
  default: ({ message }) => <div>{message.message}</div>,
}));

vi.mock("../skeletons/MessageSkeleton", () => ({
  __esModule: true,
  default: () => <div role="status">skeleton</div>,
}));

describe("Messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders skeletons while loading", () => {
    useGetMessagesMock.mockReturnValue({ loading: true, messages: [] });

    render(<Messages />);

    expect(screen.getAllByRole("status")).toHaveLength(3);
  });

  it("renders message list when available", () => {
    useGetMessagesMock.mockReturnValue({
      loading: false,
      messages: [
        { _id: "1", message: "hi" },
        { _id: "2", message: "there" },
      ],
    });

    render(<Messages />);

    expect(screen.getByText("hi")).toBeInTheDocument();
    expect(screen.getByText("there")).toBeInTheDocument();
  });

  it("shows empty state when no messages", () => {
    useGetMessagesMock.mockReturnValue({ loading: false, messages: [] });

    render(<Messages />);

    expect(screen.getByText(/send a message/i)).toBeInTheDocument();
  });
});
