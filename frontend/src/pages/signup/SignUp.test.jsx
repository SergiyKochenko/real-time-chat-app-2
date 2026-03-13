import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUp from "./SignUp.jsx";

const useSignupMock = vi.fn();

vi.mock("../../hooks/useSignup", () => ({
  __esModule: true,
  default: () => useSignupMock(),
}));

vi.mock("./GenderCheckbox", () => ({
  __esModule: true,
  default: ({ selectedGender, onCheckboxChange }) => (
    <button onClick={() => onCheckboxChange("male")}>gender-{selectedGender || "none"}</button>
  ),
}));

describe("SignUp page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits form values", async () => {
    const signup = vi.fn().mockResolvedValue();
    useSignupMock.mockReturnValue({ loading: false, signup });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: "Jane" } });
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "jane" } });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: "secret123" } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: "secret123" } });
    fireEvent.click(screen.getByText(/gender/i));

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(signup).toHaveBeenCalledWith({
      fullName: "Jane",
      username: "jane",
      password: "secret123",
      confirmPassword: "secret123",
      gender: "male",
    });
  });

  it("disables button while loading", () => {
    useSignupMock.mockReturnValue({ loading: true, signup: vi.fn() });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/sign up/i)).toBeDisabled();
  });
});
