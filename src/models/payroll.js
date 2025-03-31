const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const crypto = require("crypto");

// Helper function to generate random string of length 16
const generateRandomId = () => {
  return crypto.randomBytes(8).toString("hex"); // 8 bytes = 16 hex characters
};

const Payroll = sequelize.define(
  "Payroll",
  {
    id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      defaultValue: () => generateRandomId(),
    },
    employee_id: {
      type: DataTypes.STRING(16),
      references: { model: User, key: "id" },
      allowNull: false,
    },
    base_salary: { type: DataTypes.FLOAT, allowNull: false },
    allowances: { type: DataTypes.FLOAT, defaultValue: 0 },
    deductions: { type: DataTypes.FLOAT, defaultValue: 0 },
    net_salary: { type: DataTypes.FLOAT, allowNull: false },
    pay_period: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  },
  { tableName: "payrolls", timestamps: false }
);

module.exports = Payroll;
