import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Sidebar from "./Sidebar.jsx";

vi.mock("./SearchInput", () => ({
  __esModule: true,
  default: () => <div>search-input</div>,
}));

vi.mock("./Conversations", () => ({
  __esModule: true,
  default: () => <div>conversations</div>,
}));

vi.mock("./LogoutButton", () => ({
  __esModule: true,
  default: () => <div>logout</div>,
}));

describe("Sidebar", () => {
  it("renders all child widgets", () => {
    render(<Sidebar />);

    expect(screen.getByText("search-input")).not.toBeNull();
    expect(screen.getByText("conversations")).not.toBeNull();
    expect(screen.getByText("logout")).not.toBeNull();
  });
});
