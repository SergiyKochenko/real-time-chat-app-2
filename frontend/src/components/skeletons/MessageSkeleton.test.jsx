import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import MessageSkeleton from "./MessageSkeleton.jsx";

describe("MessageSkeleton", () => {
  it("renders placeholder elements", () => {
    const { container } = render(<MessageSkeleton />);
    expect(container.querySelectorAll(".skeleton").length).toBeGreaterThan(0);
  });
});
