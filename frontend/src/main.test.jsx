import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock("react-dom/client", () => ({
  __esModule: true,
  default: { createRoot: (...args) => createRootMock(...args) },
}));

vi.mock("./App.jsx", () => ({
  __esModule: true,
  default: () => <div>app</div>,
}));

vi.mock("./context/AuthContext.jsx", () => ({
  AuthContextProvider: ({ children }) => <div>{children}</div>,
}));

vi.mock("./context/SocketContext.jsx", () => ({
  SocketContextProvider: ({ children }) => <div>{children}</div>,
}));

describe("main entry", () => {
  beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>";
    vi.resetModules();
    renderMock.mockClear();
    createRootMock.mockClear();
  });

  it("bootstraps the React app", async () => {
    await import("./main.jsx");

    expect(createRootMock).toHaveBeenCalled();
    expect(renderMock).toHaveBeenCalled();
  });
});
