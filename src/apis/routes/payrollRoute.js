const express = require('express');
const PayrollController = require('../controllers/payrollController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Tạo bảng lương (chỉ Admin & Accountant)
router.post('/create', authMiddleware, roleMiddleware(['Admin', 'Accountant']), PayrollController.createPayroll);

// Lấy lịch sử nhận lương của nhân viên (có thể lọc theo tháng)
router.get('/history/:employeeId/:month?', authMiddleware, PayrollController.getPayrollHistory);

// Thống kê lương
router.get('/statistics', authMiddleware, roleMiddleware(['Admin', 'Accountant']), PayrollController.getPayrollStatistics);

// Xuất bảng lương (JSON hoặc PDF)
router.get('/export/:employeeId', authMiddleware, PayrollController.exportPayroll);

module.exports = router;
