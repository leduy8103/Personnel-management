const attendanceService = require('../../services/attendanceService');

const attendanceController = {
  /**
   * Handle employee check-in
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  arrive: async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        console.error('❌ Authentication error: User ID not found in request.');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      const userId = req.user.id; // Extract user ID from request
      const { gps_location } = req.body;
      const check_in_time = new Date(); // Use current time as check-in time

      // Debugging logs
      console.log('--- Check-in Debug Log ---');
      console.log('User ID:', userId);
      console.log('Check-in time:', check_in_time);
      console.log('GPS location:', gps_location);

      // Ensure userId is valid before proceeding
      if (!userId) {
        console.error('❌ Error: userId is null or undefined.');
        return res.status(400).json({
          success: false,
          message: 'Invalid request: userId cannot be null',
        });
      }

      // Call service function
      const attendance = await attendanceService.arrive(userId, check_in_time, gps_location);
      
      return res.status(200).json({
        success: true,
        message: 'Check-in recorded successfully',
        data: attendance,
      });
    } catch (error) {
      console.error('❌ Error recording check-in:', error);
      return res.status(400).json({
        success: false,
        message: 'Error recording check-in: ' + error.message,
        errorDetails: error, // Sends full error details in response (optional)
      });
    }
  },
  /**
   * Handle employee check-out
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  leave: async (req, res) => {
    try {
      const userId = req.user.id; // Assuming user is authenticated and available in req.user
      const check_out_time = new Date(); // Use current time as check-out time
      
      const attendance = await attendanceService.leave(userId, check_out_time);
      
      return res.status(200).json({
        success: true,
        message: 'Check-out recorded successfully',
        data: attendance
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Mark an employee as absent
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  markAbsent: async (req, res) => {
    try {
      const { userId, date } = req.body;
      
      // Check if admin or authorized role
      if (!req.user.isAdmin && req.user.id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to perform this action'
        });
      }
      
      const attendance = await attendanceService.markAbsent(userId, date);
      
      return res.status(200).json({
        success: true,
        message: 'User marked as absent successfully',
        data: attendance
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Get attendance records for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getUserAttendance: async (req, res) => {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;
      
      // Simple validation
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      // Check authorization - users can only view their own records unless admin
      if (!req.user.isAdmin && req.user.id !== parseInt(userId)) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to access these records'
        });
      }
      
      // This would need to be implemented in the service
      // const records = await attendanceService.getUserAttendance(userId, startDate, endDate);
      
      return res.status(200).json({
        success: true,
        message: 'Attendance records fetched successfully',
        data: []
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = attendanceController;