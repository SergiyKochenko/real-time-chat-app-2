import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useSignup from "../useSignup.js";

const hoisted = vi.hoisted(() => ({
  authContextPath: new URL("../../context/AuthContext.jsx", import.meta.url)
    .pathname,
  setAuthUser: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock(hoisted.authContextPath, () => ({
  __esModule: true,
  useAuthContext: () => ({ setAuthUser: hoisted.setAuthUser }),
}));

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { error: hoisted.toastError },
}));

describe("useSignup", () => {
  const setItemSpy = vi.spyOn(window.localStorage.__proto__, "setItem");

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    delete global.fetch;
    setItemSpy.mockReset();
  });

  const basePayload = {
    fullName: "Jane",
    username: "jane",
    password: "secret123",
    confirmPassword: "secret123",
    gender: "female",
  };

  it("validates passwords", async () => {
    const { result } = renderHook(() => useSignup());

    await act(async () => {
      await result.current.signup({ ...basePayload, confirmPassword: "nope" });
    });

    expect(hoisted.toastError).toHaveBeenCalledWith("Passwords do not match");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("stores auth user on success", async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ token: "abc" }),
    });

    const { result } = renderHook(() => useSignup());

    await act(async () => {
      await result.current.signup(basePayload);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      "chat-user",
      JSON.stringify({ token: "abc" }),
    );
    expect(hoisted.setAuthUser).toHaveBeenCalledWith({ token: "abc" });
  });
});
