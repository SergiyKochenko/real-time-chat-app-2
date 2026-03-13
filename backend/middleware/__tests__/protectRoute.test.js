import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    verify: vi.fn(),
  },
}));

vi.mock("../../models/user.model.js", () => ({
  __esModule: true,
  default: { findById: vi.fn() },
}));

import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import protectRoute from "../protectRoute.js";

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("protectRoute middleware", () => {
  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects when no token present", async () => {
    const req = { cookies: {} };
    const res = mockResponse();

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("sets req.user when token valid", async () => {
    const req = { cookies: { jwt: "token" } };
    const res = mockResponse();
    jwt.verify.mockReturnValueOnce({ userId: "user-1" });
    const select = vi.fn().mockResolvedValueOnce({ _id: "user-1" });
    User.findById.mockReturnValueOnce({ select });

    await protectRoute(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("user-1");
    expect(req.user).toEqual({ _id: "user-1" });
    expect(next).toHaveBeenCalled();
  });

  it("rejects when user missing", async () => {
    const req = { cookies: { jwt: "token" } };
    const res = mockResponse();
    jwt.verify.mockReturnValueOnce({ userId: "user-1" });
    const select = vi.fn().mockResolvedValueOnce(null);
    User.findById.mockReturnValueOnce({ select });

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "User Not Found" });
  });

  it("handles verification errors", async () => {
    const req = { cookies: { jwt: "token" } };
    const res = mockResponse();
    jwt.verify.mockImplementationOnce(() => {
      throw new Error("bad");
    });

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
