import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login.jsx";
import { AuthContextProvider } from "../../context/AuthContext";

const useLoginMock = vi.fn();

vi.mock("../../hooks/useLogin", async () => {
  const actual = await vi.importActual("../../hooks/useLogin");
  return {
    __esModule: true,
    ...actual,
    default: () => useLoginMock(),
  };
});

describe("Login page", () => {
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
    <AuthContextProvider>{children}</AuthContextProvider>
  );

  it("submits credentials", async () => {
    const login = vi.fn().mockResolvedValue();
    useLoginMock.mockReturnValue({ loading: false, login });

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

    expect(login).toHaveBeenCalledWith("jane", "secret");
  });

  it("disables button when loading", () => {
    useLoginMock.mockReturnValue({ loading: true, login: vi.fn() });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
  });
});
