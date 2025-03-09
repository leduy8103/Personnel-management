const Chat = require("../models/chat");

const chatService = {
    sendMessage: async (sender_id, receiver_id, message) => {
        return await Chat.create({ sender_id, receiver_id, message });
    },

    getMessages: async (user1_id, user2_id) => {
        return await Chat.find({
            $or: [
                { sender_id: user1_id, receiver_id: user2_id },
                { sender_id: user2_id, receiver_id: user1_id }
            ]
        }).sort({ timestamp: 1 });
    },

    getChatList: async (user_id) => {
        return await Chat.aggregate([
            {
                $match: {
                    $or: [{ sender_id: user_id }, { receiver_id: user_id }]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender_id", user_id] },
                            then: "$receiver_id",
                            else: "$sender_id"
                        }
                    }
                }
            }
        ]);
    }
};

module.exports = chatService;
