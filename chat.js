import mongoose from "mongoose";
import Message from "../models/chat.js";

export const chatService = {
  async sendMessage(data) {
    return await Message.create(data)
  },

  async getChatHistory(userA, userB) {
    return await Message.find({
      $or: [
        { senderId: userA, receiverId: userB },
        { senderId: userB, receiverId: userA },
      ],
    }).sort({ createdAt: 1 }); // oldest to newest
  },
  async getLastMessagesBySender(senderId) {
    return await Message.aggregate([
      { $match: { senderId: new mongoose.Types.ObjectId(senderId) } },
      { $sort: { receiverId: 1, createdAt: -1 } },
      {
        $group: {
          _id: "$receiverId",
          lastMessage: { $first: "$$ROOT" },
          receiverModel: { $first: "$receiverModel" },
        },
      },
      // Lookup both collections
      {
        $lookup: {
          from: "users", // Confirm this matches your actual collection name
          localField: "_id",
          foreignField: "_id",
          as: "userProfile",
        },
      },
      {
        $lookup: {
          from: "vendors", // Confirm this matches your actual collection name
          localField: "_id",
          foreignField: "_id",
          as: "vendorProfile",
        },
      },
      // Unwind results
      { $unwind: { path: "$userProfile", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$vendorProfile", preserveNullAndEmptyArrays: true } },
      // Project final fields
      {
        $project: {
          _id: 0,
          receiverId: "$_id",
          name: {
            $ifNull: [
              {
                $cond: {
                  if: { $eq: ["$receiverModel", "User"] },
                  then: "$userProfile.username",
                  else: "$vendorProfile.businessName",
                },
              },
              "Unknown",
            ],
          },
          lastMessage: {
            content: "$lastMessage.content",
            type: "$lastMessage.type",
            createdAt: "$lastMessage.createdAt",
          },
        },
      },
    ]);
  },
};
