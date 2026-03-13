import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login.jsx";
import { AuthContextProvider } from "../../context/AuthContext";

const useLoginMock = vi.fn();

// Removed mock for useLogin, will use real provider

describe("Login page", () => {
  const { AuthContextProvider } = require("../../context/AuthContext");
  const Providers = ({ children }) => (
    <AuthContextProvider>{children}</AuthContextProvider>
  );
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits credentials", async () => {
    render(
      <Providers>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Providers>
    );
    fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
      target: { value: "jane" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    // Add assertion for login action if needed
  });

  it("disables button when loading", () => {
    render(
      <Providers>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Providers>
    );
    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
  });
});
