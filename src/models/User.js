const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING(100),
  },
  position: {
    type: DataTypes.STRING(100),
  },
  hire_date: {
    type: DataTypes.DATEONLY,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Resigned'),
    defaultValue: 'Active',
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Employee', 'Manager', 'Account'),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;