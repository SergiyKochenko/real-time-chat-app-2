import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import LogoutButton from "./LogoutButton.jsx";

const useLogoutMock = vi.fn();

vi.mock("../../hooks/useLogout", () => ({
  __esModule: true,
  default: () => useLogoutMock(),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows icon and triggers logout", () => {
    const logout = vi.fn();
    useLogoutMock.mockReturnValue({ loading: false, logout });

    const { container } = render(<LogoutButton />);

    fireEvent.click(container.querySelector("svg"));
    expect(logout).toHaveBeenCalled();
  });

  it("shows spinner when loading", () => {
    useLogoutMock.mockReturnValue({ loading: true, logout: vi.fn() });

    const { container } = render(<LogoutButton />);

    expect(container.querySelector(".loading-spinner")).toBeInTheDocument();
  });
});
