import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home.jsx";

vi.mock("../../components/sidebar/Sidebar", () => ({
  __esModule: true,
  default: () => <div>sidebar</div>,
}));

vi.mock("../../components/messages/MessageContainer", () => ({
  __esModule: true,
  default: () => <div>messages</div>,
}));

describe("Home page", () => {
  it("renders sidebar and message container", () => {
    render(<Home />);

    expect(screen.getByText("sidebar")).not.toBeNull();
    expect(screen.getByText("messages")).not.toBeNull();
  });
});
