const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require("./User"); // Giả sử bạn đã có model User

const LeaveRequest = sequelize.define("LeaveRequest", {
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
  leave_type: {
    type: DataTypes.ENUM("Annual", "Sick", "Maternity", "Unpaid"),
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    defaultValue: 'Personal',
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
    defaultValue: "Pending",
  },
  reject_reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'leave_requests',
  timestamps: true
});

// Không cần định nghĩa quan hệ ở đây nữa vì đã được định nghĩa trong index.js
// LeaveRequest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = LeaveRequest;
