const Chat = require('../models/chat');
const User = require('../models/User');

const chatService = {
    sendMessage: async (sender_id, receiver_id, message) => {
        return await Chat.create({ sender_id, receiver_id, message });
    },

    getMessages: async (user1_id, user2_id) => {
        return await Chat.findAll({
            where: {
                [Op.or]: [
                    { sender_id: user1_id, receiver_id: user2_id },
                    { sender_id: user2_id, receiver_id: user1_id }
                ]
            },
            order: [['timestamp', 'ASC']]
        });
    },

    getChatList: async (user_id) => {
        return await Chat.findAll({
            where: {
                [Op.or]: [
                    { sender_id: user_id },
                    { receiver_id: user_id }
                ]
            },
            attributes: ['sender_id', 'receiver_id'],
            group: ['sender_id', 'receiver_id']
        });
    },

    getAllEmployees: async () => {
        return await User.findAll({
            attributes: ['id', 'full_name', 'email', 'department', 'position']
        });
    }

};

module.exports = chatService;
