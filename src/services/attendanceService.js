const User = require("../models/User");
const Attendance = require("../models/Attendance");
const { Op } = require("sequelize");

const attendanceService = {
  arrive: async (userId, check_in_time, gps_location) => {
    try {

      // Validate user ID
      if (!userId) {
        throw new Error('UserId is required');
      }

      // Validate GPS location
      if (!gps_location || typeof gps_location !== 'object') {
        throw new Error('Valid GPS location object is required');
      }

      // Create a clean GPS object to ensure we only store what we need
      const locationData = {
        latitude: parseFloat(gps_location.latitude),
        longitude: parseFloat(gps_location.longitude)
      };

      // Add optional accuracy if provided
      if (gps_location.accuracy) {
        locationData.accuracy = parseFloat(gps_location.accuracy);
      }

      // Define cutoff time (8:00 AM)
      const cutoffTime = new Date(check_in_time);
      cutoffTime.setHours(8, 0, 0, 0);

      // Determine check-in status
      let status = check_in_time > cutoffTime ? 'Late' : 'On time';

      // Check if user already has a check-in for today
      const today = new Date(check_in_time);
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const existingAttendance = await Attendance.findOne({
        where: {
          user_id: userId,
          check_in_time: {
            [Op.gte]: today,
            [Op.lt]: tomorrow
          }
        }
      });

      // if (existingAttendance) {
      //   throw new Error('You have already checked in today');
      // }

      // Create attendance record
      const attendance = await Attendance.create({
        user_id: userId,
        status,
        check_in_time, 
        gps_location: locationData,
        check_out_time: null
      });

      console.log('✅ Check-in recorded:', attendance.toJSON());

      return attendance;
    } catch (error) {
      console.error('❌ Error in attendanceService.arrive:', error);
      throw error;
    }
  },
  
  leave: async (userId, check_out_time, gps_location) => {
    try {
      // Find the most recent attendance record for the user without checkout time
      const attendance = await Attendance.findOne({
        where: {
          user_id: userId,
          check_out_time: null
        },
        order: [['check_in_time', 'DESC']]
      });
      
      if (!attendance) {
        throw new Error('No active check-in found. Please check in first.');
      }

      // Format GPS location if provided
      let locationData = attendance.gps_location;
      if (gps_location && typeof gps_location === 'object') {
        locationData = {
          ...locationData,
          checkout_latitude: parseFloat(gps_location.latitude),
          checkout_longitude: parseFloat(gps_location.longitude)
        };
        
        if (gps_location.accuracy) {
          locationData.checkout_accuracy = parseFloat(gps_location.accuracy);
        }
      }
      
      // Update checkout time and location
      attendance.check_out_time = check_out_time;
      attendance.gps_location = locationData;
      
      await attendance.save();
      
      return attendance;
    } catch (error) {
      console.error('❌ Error in attendanceService.leave:', error);
      throw error;
    }
  },
};

module.exports = attendanceService;
