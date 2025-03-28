const { errorResponse } = require('../utils/responseHandler');
const Attendance = require('../../models/Attendance');
const moment = require('moment');

const attendanceMiddleware = {
  /**
   * Middleware to validate GPS location for check-in
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  validateGpsLocation: (req, res, next) => {
    const { gps_location } = req.body;

    if (!gps_location) {
      return errorResponse(res, 400, 'GPS location is required for check-in');
    }

    // Basic GPS validation - latitude between -90 and 90, longitude between -180 and 180
    if (!gps_location.latitude || !gps_location.longitude) {
      return errorResponse(res, 400, 'Invalid GPS format. Both latitude and longitude are required');
    }

    const { latitude, longitude } = gps_location;

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return errorResponse(res, 400, 'Invalid latitude value. Must be between -90 and 90');
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return errorResponse(res, 400, 'Invalid longitude value. Must be between -180 and 180');
    }

    next();
  },

  /**
   * Middleware to check if user has already checked in today
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  checkDuplicateCheckin: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const existingCheckin = await Attendance.findOne({
        where: {
          userId,
          check_in_time: {
            $gte: today,
            $lt: tomorrow
          }
        }
      });

      if (existingCheckin) {
        return errorResponse(res, 400, 'You have already checked in today');
      }

      next();
    } catch (error) {
      return errorResponse(res, 500, 'Error checking for duplicate check-in');
    }
  },

  /**
   * Middleware to validate checkout (must have checked in first)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  validateCheckout: async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      const activeAttendance = await Attendance.findOne({
        where: {
          userId,
          check_out_time: null
        },
        order: [['check_in_time', 'DESC']]
      });

      if (!activeAttendance) {
        return errorResponse(res, 400, 'You need to check in before checking out');
      }

      // Store the active attendance record ID for the controller
      req.activeAttendanceId = activeAttendance.id;
      
      next();
    } catch (error) {
      return errorResponse(res, 500, 'Error validating checkout request');
    }
  },

  /**
   * Middleware to validate absence requests
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  validateAbsenceRequest: async (req, res, next) => {
    try {
      const { userId, date } = req.body;
      
      if (!userId) {
        return errorResponse(res, 400, 'User ID is required');
      }
      
      if (!date) {
        return errorResponse(res, 400, 'Date is required');
      }
      
      // Validate date format
      if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
        return errorResponse(res, 400, 'Invalid date format. Use YYYY-MM-DD');
      }
      
      // Check if date is in the past or today
      const absenceDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (absenceDate > today) {
        return errorResponse(res, 400, 'Cannot mark absence for future dates');
      }
      
      // Check for existing attendance record on that day
      const absenceDateEnd = new Date(absenceDate);
      absenceDateEnd.setDate(absenceDateEnd.getDate() + 1);
      
      const existingRecord = await Attendance.findOne({
        where: {
          userId,
          check_in_time: {
            $gte: absenceDate,
            $lt: absenceDateEnd
          }
        }
      });
      
      if (existingRecord) {
        return errorResponse(res, 400, 'Attendance record already exists for this date');
      }
      
      next();
    } catch (error) {
      return errorResponse(res, 500, 'Error validating absence request');
    }
  },

  /**
   * Middleware to validate a user has the right to access attendance records
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  validateAttendanceAccess: (req, res, next) => {
    const { userId } = req.params;
    const currentUser = req.user;

    // Self-access or admin/manager access
    if (
      currentUser.id === parseInt(userId) || 
      currentUser.role === 'admin' || 
      currentUser.role === 'manager'
    ) {
      return next();
    }

    return errorResponse(res, 403, 'Unauthorized to access these attendance records');
  }
};

module.exports = attendanceMiddleware;