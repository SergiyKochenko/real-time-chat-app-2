import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { buildAvatarUrl, ensureAvatarUrl } from "./avatar.js";

const ORIGINAL_ENV = { ...process.env };

describe("avatar utilities", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.AVATAR_TEMPLATE_URL;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("falls back to the default template when no env override is provided", () => {
    const url = buildAvatarUrl("john doe", "male");
    expect(url).toBe(
      "https://avatar.iran.liara.run/public/boy?username=john%20doe",
    );
  });

  it("supports custom templates with placeholders", () => {
    process.env.AVATAR_TEMPLATE_URL =
      "https://cdn.example.com/{{gender}}/{{genderPath}}/{{username}}";
    const url = buildAvatarUrl("Jane_Doe", "female");
    expect(url).toBe("https://cdn.example.com/female/girl/Jane_Doe");
  });

  it("returns existing profile pics via ensureAvatarUrl", () => {
    const profilePic = ensureAvatarUrl({
      username: "abc",
      gender: "male",
      profilePic: "https://existing",
    });
    expect(profilePic).toBe("https://existing");
  });

  it("builds a new url when profile pic is empty", () => {
    const profilePic = ensureAvatarUrl({
      username: "abc",
      gender: "female",
      profilePic: "",
    });
    expect(profilePic).toBe(
      "https://avatar.iran.liara.run/public/girl?username=abc",
    );
  });
});
