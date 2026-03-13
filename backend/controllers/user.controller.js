import User from "../models/user.model.js";
import { ensureAvatarUrl } from "../utils/avatar.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    const usersWithAvatars = filteredUsers.map((user) => ({
      ...user.toObject(),
      profilePic: ensureAvatarUrl(user),
    }));

    res.status(200).json(usersWithAvatars);
  } catch (error) {
    console.error("Error in getUsersForSidebar", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
