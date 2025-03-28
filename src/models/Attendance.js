const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('On time', 'Late', 'Absent'),
    allowNull: false
  },
  check_in_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  check_out_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  gps_location: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'attendance',
  timestamps: false
});

module.exports = Attendance;
