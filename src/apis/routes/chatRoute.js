const express = require("express");
const ChatController = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/messages/:user1_id/:user2_id", authMiddleware, ChatController.getMessages);
router.get("/chat-list", authMiddleware, ChatController.getChatList);

module.exports = router;
