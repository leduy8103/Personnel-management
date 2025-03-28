const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Overtime = require("../models/Overtime");

const attendanceService = {
  arrive: async (userId, check_in_time, gps_location) => {
    try {
      // Debugging logs
      console.log('➡️ attendanceService.arrive called with:', {
        userId,
        check_in_time,
        gps_location
      });

      // Validate user ID
      if (!userId) {
        throw new Error('❌ userId is null in attendanceService');
      }

      // Validate GPS location
      if (!gps_location) {
        throw new Error('❌ GPS location is required');
      }

      // Define cutoff time (8:00 AM)
      const cutoffTime = new Date(check_in_time);
      cutoffTime.setHours(8, 0, 0, 0);

      // Determine check-in status
      let status = check_in_time > cutoffTime ? 'Late' : 'On time';

      // Create attendance record
      const attendance = await Attendance.create({
        user_id: userId, // Ensure this matches the database field name
        status,
        check_in_time, 
        gps_location,
        check_out_time: null
      });

      console.log('✅ Check-in recorded:', attendance);

      return attendance;
    } catch (error) {
      console.error('❌ Error in attendanceService.arrive:', error);
      throw new Error(`Error recording check-in: ${error.message}`);
    }
  },
  
  leave: async (userId, check_out_time) => {
    try {
      const attendance = await Attendance.findOne({
        where: {
          userId,
          check_out_time: null
        },
        order: [['check_in_time', 'DESC']]
      });
      
      if (!attendance) {
        throw new Error('No active attendance record found');
      }
      attendance.check_out_time = check_out_time;
      await attendance.save();
      
      return attendance;
    } catch (error) {
      throw new Error(`Error recording check-out: ${error.message}`);
    }
  },
  
  markAbsent: async (userId, date) => {
    try {
      const absentDate = new Date(date);
      absentDate.setHours(0, 0, 0, 0);
      
      const attendance = await Attendance.create({
        userId,
        status: 'Absent',
        check_in_time: absentDate,
        check_out_time: null,
        gps_location: null
      });
      
      return attendance;
    } catch (error) {
      throw new Error(`Error marking absent: ${error.message}`);
    }
  }
};

module.exports = attendanceService;
