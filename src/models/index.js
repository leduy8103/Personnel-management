const { sequelize } = require('../config/database');
const User = require('./User');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
    
    await sequelize.sync({ force: true }); // Xóa & tạo lại bảng
    console.log('✅ All models were synchronized successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

syncDatabase();

module.exports = { User };