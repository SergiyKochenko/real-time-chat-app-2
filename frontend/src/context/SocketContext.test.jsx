import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { SocketContextProvider, useSocketContext } from "./SocketContext.jsx";

const onMock = vi.fn();
const offMock = vi.fn();
const closeMock = vi.fn();
const socketFactory = vi.fn(() => ({
  on: onMock,
  off: offMock,
  close: closeMock,
    const { unmount } = render(

vi.mock("socket.io-client", () => ({
  __esModule: true,
  default: (...args) => socketFactory(...args),
}));

vi.mock("./AuthContext", () => {
// Removed mock for AuthContext, will use real provider

const TestComponent = () => {
  const { onlineUsers } = useSocketContext();
  return <div>online:{onlineUsers.join(",") || "none"}</div>;
};

describe("SocketContextProvider", () => {
  const { AuthContextProvider } = require("./AuthContext");
  beforeEach(() => {
    vi.clearAllMocks();
  });
});
  it("connects to socket server and updates online users", async () => {
    let handler;
    onMock.mockImplementation((event, cb) => {
      if (event === "getOnlineUsers") handler = cb;
    });
    const { unmount } = render(
      <AuthContextProvider>
        <SocketContextProvider>
          <TestComponent />
        </SocketContextProvider>
      </AuthContextProvider>
    );
    expect(socketFactory).toHaveBeenCalledWith(
      "https://real-time-chat-app-production-mdoy.onrender.com",
      expect.objectContaining({ query: { userId: "user-1" } }),
    );
    await act(async () => {
      handler(["user-1", "user-2"]);
    });
    expect(screen.getByText(/online:user-1,user-2/)).toBeInTheDocument();
    unmount();
    expect(offMock).toHaveBeenCalledWith("getOnlineUsers");
    expect(closeMock).toHaveBeenCalled();
  });


