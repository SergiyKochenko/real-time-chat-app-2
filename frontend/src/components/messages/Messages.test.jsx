import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Messages from "./Messages.jsx";
import { AuthContextProvider } from "../../context/AuthContext";
import { SocketContextProvider } from "../../context/SocketContext";

const useGetMessagesMock = vi.fn();

vi.mock("../../hooks/useGetMessages", async () => {
  const actual = await vi.importActual("../../hooks/useGetMessages");
  return {
    __esModule: true,
    ...actual,
    default: () => useGetMessagesMock(),
  };
});

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
  vi.mock("../../context/AuthContext", async () => {
    const actual = await vi.importActual("../../context/AuthContext");
    return {
      __esModule: true,
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

  it("renders skeletons while loading", () => {
    useGetMessagesMock.mockReturnValue({ loading: true, messages: [] });

    render(
      <Providers>
        <Messages />
      </Providers>
    );

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
