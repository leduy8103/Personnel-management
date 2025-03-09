const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./apis/routes/authRoute');
const userRoutes = require("./apis/routes/userRoute");
const projectRoutes = require("./apis/routes/projectRoute");
const taskRoutes = require("./apis/routes/taskRoute");
const projectMemberRoutes = require("./apis/routes/projectMemberRoute");
const { connectMongoDB, connetPostgres } = require("./config/database");
const { Socket } = require("socket.io");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/project-member", projectMemberRoutes);
// Connect to databases
connectMongoDB();
connetPostgres();



module.exports = app;