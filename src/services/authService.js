const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { JWT_SECRET } = process.env;
const leaveService = require("./leaveService");

const authService = {
  register: async (userData) => {
    try {
      // Kiểm tra email đã tồn tại chưa
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error("Email đã được sử dụng");
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Tạo user mới
      const newUser = await User.create({
        ...userData,
        password: hashedPassword,
        role: userData.role || "user" // Mặc định là user nếu không chỉ định
      });

      // Khởi tạo số ngày nghỉ phép cho user mới
      await leaveService.initializeLeaveBalance(newUser.id);

      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  login: async (email, password) => {
    const hardcodedAdmin = {
      email: "admin@gmail.com",
      password: "123",
      role: "Admin",
    };
    if (email === hardcodedAdmin.email) {
      if (password === hardcodedAdmin.password) {
        const token = jwt.sign(
          { email: hardcodedAdmin.email, role: hardcodedAdmin.role },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        return { user: hardcodedAdmin, token };
      } else {
        throw new Error("Invalid password");
      }
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return { user, token };
  },

  validateToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid token");
    }
  },

  getUserRole: (user) => {
    return user.role;
  },
};

module.exports = authService;
