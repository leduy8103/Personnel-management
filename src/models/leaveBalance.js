const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require("./User");

const LeaveBalance = sequelize.define("LeaveBalance", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  total_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: process.env.DEFAULT_LEAVE_DAYS || 12, // Lấy từ .env
  },
});

module.exports = LeaveBalance;
