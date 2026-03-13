import { describe, it, expect, beforeEach, vi } from "vitest";
import { signup, login } from "../auth.controller.js";

const useConversationMock = vi.fn();

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  return res;
};

const saveMock = vi.fn();

vi.mock("../../models/user.model.js", () => {
  const UserMock = vi.fn().mockImplementation((doc) => ({
    ...doc,
    _id: "new-user-id",
    save: saveMock,
  }));
  UserMock.findOne = vi.fn();
  return { __esModule: true, default: UserMock };
});

vi.mock("bcryptjs", () => ({
  __esModule: true,
  default: {
    genSalt: vi.fn().mockResolvedValue("salt"),
    hash: vi.fn().mockResolvedValue("hashed"),
    compare: vi.fn(),
  },
}));

vi.mock("../../utils/generateToken.js", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../../utils/avatar.js", () => ({
  __esModule: true,
  buildAvatarUrl: vi.fn(() => "https://avatar/built.png"),
  ensureAvatarUrl: vi.fn(
    (user) => user.profilePic || "https://avatar/ensured.png",
  ),
}));

import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../../utils/generateToken.js";
import { ensureAvatarUrl } from "../../utils/avatar.js";

describe("auth controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    saveMock.mockResolvedValue();
  });

  describe("signup", () => {
    it("returns 400 when passwords do not match", async () => {
      const req = {
        body: {
          fullName: "John",
          username: "john",
          password: "123456",
          confirmPassword: "other",
          gender: "male",
        },
      };
      const res = mockResponse();

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Passwords don't match" });
    });

    it("returns 400 when username already exists", async () => {
      User.findOne.mockResolvedValueOnce({ _id: "existing" });
      const req = {
        body: {
          fullName: "John",
          username: "john",
          password: "123456",
          confirmPassword: "123456",
          gender: "male",
        },
      };
      const res = mockResponse();

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Username already exists",
      });
    });

    it("creates and returns a new user when data is valid", async () => {
      User.findOne.mockResolvedValueOnce(null);
      const req = {
        body: {
          fullName: "John",
          username: "john",
          password: "123456",
          confirmPassword: "123456",
          gender: "male",
        },
      };
      const res = mockResponse();

      await signup(req, res);

      expect(generateTokenAndSetCookie).toHaveBeenCalledWith(
        "new-user-id",
        res,
      );
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: "new-user-id",
        fullName: "John",
        username: "john",
        profilePic: "https://avatar/built.png",
      });
    });
  });

  describe("login", () => {
    it("returns 400 when credentials are invalid", async () => {
      User.findOne.mockResolvedValueOnce(null);
      const req = { body: { username: "john", password: "bad" } };
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid username or password",
      });
    });

    it("returns 200 and user info when credentials are valid", async () => {
      const userDoc = {
        _id: "existing",
        fullName: "John",
        username: "john",
        password: "hashed",
        profilePic: "saved",
      };
      User.findOne.mockResolvedValueOnce(userDoc);
      bcrypt.compare.mockResolvedValueOnce(true);

      const req = { body: { username: "john", password: "123456" } };
      const res = mockResponse();

      await login(req, res);

      expect(generateTokenAndSetCookie).toHaveBeenCalledWith("existing", res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _id: "existing",
        fullName: "John",
        username: "john",
        profilePic: ensureAvatarUrl(userDoc),
      });
    });
  });
});
