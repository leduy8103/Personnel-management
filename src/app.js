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
const payrollRoutes = require('./apis/routes/payrollRoute');
const chatRoutes = require('./apis/routes/chatRoute');
const leaveRoutes = require('./apis/routes/leaveRoute');
const { connectMongoDB, connetPostgres } = require('./config/database');
const userRoutes = require("./apis/routes/userRoute");
const prRoutes = require("./apis/routes/prRoute");
const { connectMongoDB, connetPostgres } = require("./config/database");

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
app.use('/api/payroll', payrollRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/leave', leaveRoutes);
app.use("/api/pr", prRoutes);
// Connect to databases
connectMongoDB();
connetPostgres();



module.exports = app;