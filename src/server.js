// server.js
const app = require('./app');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Lắng nghe kết nối WebSocket
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('send_message', async (data) => {
    const { sender_id, receiver_id, message } = data;

    // Lưu tin nhắn vào MongoDB
    const Chat = require('./models/chat');
    const savedMessage = await Chat.create({ sender_id, receiver_id, message });

    // Gửi lại cho cả hai người dùng
    io.emit('receive_message', savedMessage); // broadcast cho tất cả
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
