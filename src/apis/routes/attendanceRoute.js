const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate, isAdmin, isManager } = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @route   POST /api/attendance/check-in
 * @desc    Record employee check-in with GPS location
 * @access  Private (All authenticated users)
 */
router.post('/check-in', attendanceController.arrive);

/**
 * @route   POST /api/attendance/check-out
 * @desc    Record employee check-out
 * @access  Private (All authenticated users)
 */
router.post('/check-out', attendanceController.leave);

/**
 * @route   POST /api/attendance/absent
 * @desc    Mark an employee as absent
 * @access  Private (Admin/Manager only)
 */
router.post('/absent', isManager, attendanceController.markAbsent);

/**
 * @route   GET /api/attendance/user/:userId
 * @desc    Get attendance records for a specific user
 * @access  Private (Own records or Admin/Manager)
 */
router.get('/user/:userId', attendanceController.getUserAttendance);

/**
 * @route   GET /api/attendance/department/:deptId
 * @desc    Get attendance records for all users in a department
 * @access  Private (Admin/Manager only)
 */
router.get('/department/:deptId', isManager, (req, res) => {
  // This would be implemented in the controller
  res.status(501).json({ message: 'Not yet implemented' });
});

/**
 * @route   GET /api/attendance/report
 * @desc    Generate attendance report with optional filters
 * @access  Private (Admin/Manager only)
 */
router.get('/report', isManager, (req, res) => {
  // This would be implemented in the controller
  res.status(501).json({ message: 'Not yet implemented' });
});

module.exports = router;