const attendanceService = require('../../services/attendanceService');

const attendanceController = {
  /**
   * Handle employee check-in
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  arrive: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        console.error('❌ Authentication error: User ID not found in request.');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      const userId = req.user.id; 
      const { gps_location } = req.body;
      const check_in_time = new Date(); 

      // Validate GPS location format
      if (!gps_location || !gps_location.latitude || !gps_location.longitude) {
        return res.status(400).json({
          success: false,
          message: 'Invalid GPS format. Must include latitude and longitude.',
        });
      }

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
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }
      
      const userId = req.user.id;
      const check_out_time = new Date();
      const { gps_location } = req.body;
      
      const attendance = await attendanceService.leave(userId, check_out_time, gps_location);
      
      return res.status(200).json({
        success: true,
        message: 'Check-out recorded successfully',
        data: attendance
      });
    } catch (error) {
      console.error('❌ Error recording check-out:', error);
      return res.status(400).json({
        success: false,
        message: 'Error recording check-out: ' + error.message,
      });
    }
  },
};

module.exports = attendanceController;