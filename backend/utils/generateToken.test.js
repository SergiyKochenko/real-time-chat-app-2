import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import generateTokenAndSetCookie from "./generateToken.js";

const originalEnv = { ...process.env };

describe("generateTokenAndSetCookie", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("sets an httpOnly cookie with a JWT", () => {
    const res = {
      cookie: vi.fn(),
    };

    generateTokenAndSetCookie("user123", res);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    const [name, token, options] = res.cookie.mock.calls[0];
    expect(name).toBe("jwt");
    expect(typeof token).toBe("string");
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("strict");
  });
});
