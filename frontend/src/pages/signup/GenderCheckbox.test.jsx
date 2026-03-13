import React from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import GenderCheckbox from "./GenderCheckbox.jsx";

describe("GenderCheckbox", () => {
  it("calls handler when selecting gender", () => {
    const onCheckboxChange = vi.fn();
    render(
      <GenderCheckbox
        onCheckboxChange={onCheckboxChange}
        selectedGender="male"
      />,
    );

    fireEvent.click(screen.getByLabelText(/female/i));
    expect(onCheckboxChange).toHaveBeenCalledWith("female");
  });
});
