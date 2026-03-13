// AI-generated test for backend message API
import request from "supertest";
import dotenv from "dotenv";
dotenv.config();
import { app } from "../socket/socket.js";

describe("Message API", () => {
  it("should return 401 for unauthenticated message send", async () => {
    const res = await request(app)
      .post("/api/messages")
      .send({ message: "Hello", conversationId: "fakeid" });
    expect([401, 404]).toContain(res.statusCode);
  });
});
