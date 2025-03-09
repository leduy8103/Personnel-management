const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./apis/routes/authRoute');
<<<<<<< Updated upstream
const { connectMongoDB, connetPostgres } = require('./config/database');
=======
const userRoutes = require("./apis/routes/userRoute");
const prRoutes = require("./apis/routes/prRoute");
const { connectMongoDB, connetPostgres } = require("./config/database");
>>>>>>> Stashed changes

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
<<<<<<< Updated upstream
app.use('/api/auth', authRoutes);

=======
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pr", prRoutes);
>>>>>>> Stashed changes
// Connect to databases
connectMongoDB();
connetPostgres();

module.exports = app;