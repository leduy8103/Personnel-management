const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Chat = sequelize.define('Chat', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sender_id: { type: DataTypes.INTEGER, references: { model: User, key: 'id' }, allowNull: false },
  receiver_id: { type: DataTypes.INTEGER, references: { model: User, key: 'id' }, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, { tableName: 'chats', timestamps: false });

module.exports = Chat;
