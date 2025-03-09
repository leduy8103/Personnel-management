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

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});