const { sequelize } = require("../config/database"); // Ensure correct import
const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");
const ProjectMember = require("./ProjectMember"); // Import model mới

// **Thiết lập quan hệ**
User.hasMany(Task, { foreignKey: "user_id" });
Task.belongsTo(User, { foreignKey: "user_id" });

Project.hasMany(Task, { foreignKey: "project_id" });
Task.belongsTo(Project, { foreignKey: "project_id" });

User.hasMany(ProjectMember, { foreignKey: "user_id" });
ProjectMember.belongsTo(User, { foreignKey: "user_id" });

Project.hasMany(ProjectMember, { foreignKey: "project_id" });
ProjectMember.belongsTo(Project, { foreignKey: "project_id" });

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    await sequelize.sync({ alter: true }); // Cập nhật bảng nếu thay đổi
    console.log("✅ All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

syncDatabase();

module.exports = { User, Project, Task, ProjectMember };
