import { describe, it, expect, vi, beforeEach } from "vitest";

const { connectMock } = vi.hoisted(() => ({ connectMock: vi.fn() }));

vi.mock("mongoose", () => ({
  __esModule: true,
  default: { connect: connectMock },
}));

import connectToMongoDB from "../connectToMongoDB.js";

const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

describe("connectToMongoDB", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MONGO_DB_URI = "mongodb://example";
  });

  it("connects using env uri", async () => {
    connectMock.mockResolvedValueOnce();

    await connectToMongoDB();

    expect(connectMock).toHaveBeenCalledWith("mongodb://example");
    expect(logSpy).toHaveBeenCalledWith("Connected to MongoDB successfully");
  });

  it("logs errors when connection fails", async () => {
    connectMock.mockRejectedValueOnce(new Error("boom"));

    await connectToMongoDB();

    expect(logSpy).toHaveBeenCalledWith("Error connecting to MongoDB:", "boom");
  });
});
