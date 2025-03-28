const chatService = require('../../services/chatService');

class ChatController {
    async sendMessage(req, res) {
        try {
            const { receiver_id, message } = req.body;
            const sender_id = req.user.id; // Lấy từ token đã đăng nhập
            const chat = await chatService.sendMessage(sender_id, receiver_id, message);
            res.status(201).json({ message: 'Message sent successfully', chat });
        } catch (error) {
            res.status(400).json({ message: 'Failed to send message', error: error.message });
        }
    }

    async getMessages(req, res) {
        try {
            const { user1_id, user2_id } = req.params;
            const messages = await chatService.getMessages(user1_id, user2_id);
            res.status(200).json({ messages });
        } catch (error) {
            res.status(400).json({ message: 'Failed to fetch messages', error: error.message });
        }
    }

    async getChatList(req, res) {
        try {
            const user_id = req.user.id;
            const chatList = await chatService.getChatList(user_id);
            res.status(200).json({ chatList });
        } catch (error) {
            res.status(400).json({ message: 'Failed to fetch chat list', error: error.message });
        }
    }
}

module.exports = new ChatController();
