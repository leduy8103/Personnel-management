const leaveService = require("../../services/leaveService");

const requestLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate } = req.body;
    const userId = req.user.id; // Lấy ID từ token đăng nhập

    const leaveRequest = await leaveService.requestLeave(userId, leaveType, startDate, endDate);

    return res.status(201).json({
      message: "Yêu cầu nghỉ phép đã được gửi thành công.",
      leaveRequest,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { requestLeave };
