const app = require('./app');
const http = require("http");
const socket = require("./socket");
const { PORT } = process.env;

const server = http.createServer(app);
const io = socket.init(server);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Xử lý sự kiện gửi tin nhắn
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);

    // Phát tin nhắn đến người nhận
    io.to(message.receiver_id).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});