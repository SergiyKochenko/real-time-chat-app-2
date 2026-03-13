// AI-generated test for frontend App
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import App from "../App";
import { AuthContextProvider } from "../context/AuthContext";

describe("App routing", () => {
  it("renders login screen when unauthenticated", () => {
    render(
      <AuthContextProvider>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </AuthContextProvider>
    );

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });
});
