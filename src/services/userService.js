const User = require("../models/User");
const EmployeeDocument = require('../models/EmployeeDocument');

const userService = {
  createUser: async (userData) => {
    const user = await User.create(userData);
    return user;
  },

  getAllUsers: async () => {
    const users = await User.findAll();
    return users;
  },

  getUserById: async (id) => {
    const user = await User.findByPk(id);
    return user;
  },

  getUserByName: async (name) => {
    const user = await User.findOne({ where: { name } });
    return user;
  },

  getUserByEmail: async (email) => {
    const user = await User.findOne({ where: { email } });
    return user;
  },

  getUserByRole: async (role) => {
    const users = await User.findAll({ where: { role } });
    return users;
  },

  getUserByStatus: async (status) => {
    const users = await User.findAll({ where: { status } });
    return users;
  },

  getUserByDepartment: async (department) => {
    const users = await User.findAll({ where: { department } });
    return users;
  },

  getUserByPosition: async (position) => {
    const users = await User.findAll({ where: { position } });
    return users;
  },

  getUserByMultipleFields: async (fields) => {
    const users = await User.findAll({ where: { ...fields } });
    return users;
  },

  updateUser: async (id, userData) => {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    Object.assign(user, userData);
    await user.save();
    return user;
  },

  deleteUser: async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    await user.destroy();
  },

  uploadFile: async (userId, file) => {
    // Ensure userId is an integer
    const userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      throw new Error("Invalid userId");
    }

    const fileData = {
      employeeId: userIdInt, // Use userId as an integer
      fileName: file.originalname,
      fileUrl: file.path, // Assuming the file path is stored here
      fileType: file.mimetype.split("/")[1],
    };
    const uploadedFile = await EmployeeDocument.create(fileData);
    return uploadedFile;
  },
};

module.exports = userService;
