import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const ORIGINAL_ENV = { ...process.env };

describe("generateTokenAndSetCookie", () => {
  const res = { cookie: vi.fn() };

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    process.env.NODE_ENV = "development";
    res.cookie.mockClear();
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("sets a signed JWT cookie with expected attributes", () => {
    generateTokenAndSetCookie("user-123", res);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    const [name, token, options] = res.cookie.mock.calls[0];

    expect(name).toBe("jwt");
    expect(typeof token).toBe("string");
    expect(options).toMatchObject({
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
  });

  it("marks cookie secure outside development", () => {
    process.env.NODE_ENV = "production";

    generateTokenAndSetCookie("user-123", res);
    const [, , options] = res.cookie.mock.calls[0];

    expect(options.secure).toBe(true);
  });
});
