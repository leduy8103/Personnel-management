const { sequelize } = require('../config/database');
const User = require('./User');
const LeaveRequest = require('./leaveRequest');
const LeaveBalance = require('./leaveBalance');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
    
    await sequelize.sync({ alter: true }); // Chỉ cập nhật bảng nếu có thay đổi
    console.log('✅ All models were synchronized successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

syncDatabase();

module.exports = { User, LeaveRequest, LeaveBalance };