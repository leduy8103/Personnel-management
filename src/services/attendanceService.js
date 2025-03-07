const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Overtime = require("../models/Overtime");

const attendanceService = {
    arrive: async (check_in_time, gps_location) => {
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
};

module.exports = attendanceServiceService;
