const chatService = require("../../services/chatService");

class ChatController {
    async getMessages(req, res) {
        try {
            const { user1_id, user2_id } = req.params;
            const messages = await chatService.getMessages(user1_id, user2_id);
            res.status(200).json({ messages });
        } catch (error) {
            res.status(400).json({ message: "Failed to fetch messages", error: error.message });
        }
    }

    async getChatList(req, res) {
        try {
            const user_id = req.user.id;
            const chatList = await chatService.getChatList(user_id);
            res.status(200).json({ chatList });
        } catch (error) {
            res.status(400).json({ message: "Failed to fetch chat list", error: error.message });
        }
    }
}

module.exports = new ChatController();
