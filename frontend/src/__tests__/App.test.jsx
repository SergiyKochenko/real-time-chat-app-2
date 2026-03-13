// AI-generated test for frontend App
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import App from "../App";
import { AuthContextProvider } from "../context/AuthContext";

describe("App routing", () => {
  const { ConversationProvider } = require("../zustand/useConversation");
  const { SocketContextProvider } = require("../context/SocketContext");
  it("renders login screen when unauthenticated", () => {
    render(
      <ConversationProvider>
        <AuthContextProvider>
          <SocketContextProvider>
            <MemoryRouter initialEntries={["/"]}>
              <App />
            </MemoryRouter>
          </SocketContextProvider>
        </AuthContextProvider>
      </ConversationProvider>
    );
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });
});
