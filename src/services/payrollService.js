const Payroll = require('../models/payroll');
const User = require('../models/User');

const TAX_RATE = 0.1; // Thuế thu nhập cá nhân 10%
const INSURANCE_RATE = 0.08; // Bảo hiểm xã hội 8%
//const HOURS_PER_MONTH = 22 * 8; // 22 ngày làm việc, 8 giờ mỗi ngày

const payrollService = {
    createPayroll: async (payrollData) => {
        const { base_salary, allowances, deductions, employee_id, pay_period } = payrollData;

        // Tính thuế và bảo hiểm
        const tax = base_salary * TAX_RATE;
        const insurance = base_salary * INSURANCE_RATE;
        const totalDeductions = tax + insurance + (deductions || 0);

        // Tính lương thực nhận
        const net_salary = base_salary + (allowances || 0) - totalDeductions;

        // Tính lương theo giờ
        //const hourly_rate = base_salary / HOURS_PER_MONTH;

        return await Payroll.create({
            employee_id,
            base_salary,
            allowances,
            deductions: totalDeductions, // Bao gồm thuế + bảo hiểm + các khoản khấu trừ khác
            net_salary,
            //hourly_rate,
            pay_period
        });
    },

    getPayrollHistory: async (employeeId, month) => {
        let whereCondition = { employee_id: employeeId };
        if (month) {
            whereCondition.pay_period = month;
        }
        return await Payroll.findAll({ where: whereCondition });
    },

    getPayrollStatistics: async () => {
        const totalPayroll = await Payroll.sum('net_salary');
        const payrollCount = await Payroll.count();
        return { totalPayroll, payrollCount };
    },

    exportPayroll: async (employeeId) => {
        return await Payroll.findOne({ where: { employee_id: employeeId } });
    }

};

module.exports = payrollService;
