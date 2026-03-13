import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../../models/user.model.js", () => ({
  __esModule: true,
  default: { find: vi.fn() },
}));

vi.mock("../../utils/avatar.js", () => ({
  __esModule: true,
  ensureAvatarUrl: vi.fn((user) => `avatar-${user._id}`),
}));

import User from "../../models/user.model.js";
import { ensureAvatarUrl } from "../../utils/avatar.js";
import { getUsersForSidebar } from "../user.controller.js";

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("user controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters current user and maps avatar urls", async () => {
    const select = vi.fn().mockResolvedValueOnce([
      { _id: "a", toObject: () => ({ _id: "a", profilePic: "" }) },
      { _id: "b", toObject: () => ({ _id: "b", profilePic: "" }) },
    ]);
    User.find.mockReturnValueOnce({ select });

    const req = { user: { _id: "me" } };
    const res = mockResponse();

    await getUsersForSidebar(req, res);

    expect(User.find).toHaveBeenCalledWith({ _id: { $ne: "me" } });
    expect(ensureAvatarUrl).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({ profilePic: "avatar-a" }),
      expect.objectContaining({ profilePic: "avatar-b" }),
    ]);
  });

  it("handles failures", async () => {
    const select = vi.fn().mockRejectedValueOnce(new Error("boom"));
    User.find.mockReturnValueOnce({ select });

    const req = { user: { _id: "me" } };
    const res = mockResponse();

    await getUsersForSidebar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
