const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { JWT_SECRET } = process.env;

const authService = {
  register: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({ ...userData, password: hashedPassword });
    return user;
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
