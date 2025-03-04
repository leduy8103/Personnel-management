const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./apis/routes/authRoute');
const payrollRoutes = require('./apis/routes/payrollRoute');
const { connectMongoDB, connetPostgres } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payroll', payrollRoutes);

// Connect to databases
connectMongoDB();
connetPostgres();

module.exports = app;