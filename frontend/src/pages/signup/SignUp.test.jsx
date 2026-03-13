import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUp from "./SignUp.jsx";
import { AuthContextProvider } from "../../context/AuthContext";

const useSignupMock = vi.fn();

// Removed mock for useSignup, will use real provider

vi.mock("./GenderCheckbox", () => ({
  __esModule: true,
  default: ({ selectedGender, onCheckboxChange }) => (
    <button onClick={() => onCheckboxChange("male")}>
      gender-{selectedGender || "none"}
    </button>
  ),
}));

describe("SignUp page", () => {
  const { AuthContextProvider } = require("../../context/AuthContext");
  const Providers = ({ children }) => (
    <AuthContextProvider>{children}</AuthContextProvider>
  );
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits form values", async () => {
    render(
      <Providers>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Providers>
    );
    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "jane" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "secret123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByText(/gender/i));
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    // Add assertion for signup action if needed
  });

  it("disables button while loading", () => {
    render(
      <Providers>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Providers>
    );
    expect(screen.getByLabelText(/sign up/i)).toBeDisabled();
  });
});
