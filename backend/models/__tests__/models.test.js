import { describe, it, expect } from "vitest";
import User from "../user.model.js";
import Message from "../message.model.js";
import Conversation from "../conversation.model.js";

describe("mongoose models", () => {
  it("exposes the user model", () => {
    expect(User.modelName).toBe("User");
  });

  it("exposes the message model", () => {
    expect(Message.modelName).toBe("Message");
  });

  it("exposes the conversation model", () => {
    expect(Conversation.modelName).toBe("Conversation");
  });
});
