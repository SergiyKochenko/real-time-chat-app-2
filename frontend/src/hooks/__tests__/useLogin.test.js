import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useLogin from "../useLogin.js";

const hoisted = vi.hoisted(() => ({
  authContextPath: new URL("../../context/AuthContext.jsx", import.meta.url).pathname,
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

describe("useLogin", () => {
  const setItemSpy = vi.spyOn(window.localStorage.__proto__, "setItem");

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    delete global.fetch;
    setItemSpy.mockReset();
  });

  it("validates inputs", async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.login("", "");
    });

    expect(hoisted.toastError).toHaveBeenCalledWith("Please fill in all fields");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("stores auth user on success", async () => {
    global.fetch.mockResolvedValue({ json: () => Promise.resolve({ token: "abc" }) });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.login("user", "pass");
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ method: "POST" })
    );
    expect(setItemSpy).toHaveBeenCalled();
    expect(hoisted.setAuthUser).toHaveBeenCalledWith({ token: "abc" });
  });
});
