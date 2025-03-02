const { LeaveRequest, LeaveBalance } = require("../models");

const requestLeave = async (userId, leaveType, startDate, endDate) => {
  try {
    // Kiểm tra số ngày nghỉ phép còn lại
    const leaveBalance = await LeaveBalance.findOne({ where: { user_id: userId } });

    if (!leaveBalance || leaveBalance.total_days <= 0) {
      throw new Error("Bạn không có đủ ngày phép để nghỉ.");
    }

    // Tính số ngày nghỉ
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (leaveBalance.total_days < diffDays) {
      throw new Error("Bạn không đủ số ngày phép để nghỉ trong khoảng thời gian này.");
    }

    // Tạo yêu cầu nghỉ phép
    const leaveRequest = await LeaveRequest.create({
      user_id: userId,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      status: "Pending",
    });

    return leaveRequest;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { requestLeave };
