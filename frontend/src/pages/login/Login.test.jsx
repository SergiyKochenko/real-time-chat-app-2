import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login.jsx";

const useLoginMock = vi.fn();

vi.mock("../../hooks/useLogin", () => ({
  __esModule: true,
  default: () => useLoginMock(),
}));

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits credentials", async () => {
    const login = vi.fn().mockResolvedValue();
    useLoginMock.mockReturnValue({ loading: false, login });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter username/i), { target: { value: "jane" } });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(login).toHaveBeenCalledWith("jane", "secret");
  });

  it("disables button when loading", () => {
    useLoginMock.mockReturnValue({ loading: true, login: vi.fn() });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
  });
});
