import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useLogout from "../useLogout.js";

const hoisted = vi.hoisted(() => ({
  setAuthUser: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock(hoisted.authContextPath, () => ({
  // Removed mock for AuthContext, will use real provider
}));

vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { error: hoisted.toastError },
}));

describe("useLogout", () => {
  const removeItemSpy = vi.spyOn(window.localStorage.__proto__, "removeItem");
  const { AuthContextProvider } = require("../../context/AuthContext");

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    delete global.fetch;
    removeItemSpy.mockReset();
  });

  it("clears auth state on success", async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    });

    const wrapper = ({ children }) => <AuthContextProvider>{children}</AuthContextProvider>;
    const { result } = renderHook(() => useLogout(), { wrapper });
    await act(async () => {
      await result.current.logout();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/logout",
      expect.objectContaining({ method: "POST" }),
    );
    expect(removeItemSpy).toHaveBeenCalledWith("chat-user");
    expect(hoisted.setAuthUser).toHaveBeenCalledWith(null);
  });

  it("shows toast on failure", async () => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ error: "Boom" }),
    });

    const { result } = renderHook(() => useLogout());
    await act(async () => {
      await result.current.logout();
    });

    expect(hoisted.toastError).toHaveBeenCalledWith("Boom");
  });
});
