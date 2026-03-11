import { describe, it, expect } from "vitest";
import { extractTime } from "./extractTime";

describe("extractTime", () => {
  it("formats single-digit hours and minutes with leading zeros", () => {
    const value = extractTime("2024-01-02T03:04:00Z");
    expect(value).toBe("03:04");
  });

  it("returns hours and minutes for afternoon times", () => {
    const value = extractTime("2024-01-02T15:09:00Z");
    expect(value).toBe("15:09");
  });
});
