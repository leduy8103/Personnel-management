// Cập nhật file payrollService.js
const Payroll = require('../models/payroll');
const User = require('../models/User');

// Tỷ lệ thuế và bảo hiểm theo quy định Việt Nam
const PERSONAL_INCOME_TAX_RATE = 0.1; // 10% thuế TNCN
const SOCIAL_INSURANCE_RATE = 0.08; // 8% BHXH
const HEALTH_INSURANCE_RATE = 0.015; // 1.5% BHYT
const UNEMPLOYMENT_INSURANCE_RATE = 0.01; // 1% BHTN

const payrollService = {
    createPayroll: async (payrollData) => {
        const { 
            base_salary, 
            allowances, 
            deductions, 
            employee_id, 
            pay_period,
            region = 'I',
            status = 'Pending',
            // Nếu các trường này được gửi từ frontend, dùng giá trị đó
            // ngược lại tính toán dựa trên lương cơ bản
            social_insurance = base_salary * SOCIAL_INSURANCE_RATE,
            health_insurance = base_salary * HEALTH_INSURANCE_RATE,
            unemployment_insurance = base_salary * UNEMPLOYMENT_INSURANCE_RATE,
            personal_income_tax = base_salary * PERSONAL_INCOME_TAX_RATE
        } = payrollData;

        // Tính tổng khấu trừ
        const total_deductions = (
            social_insurance + 
            health_insurance + 
            unemployment_insurance + 
            personal_income_tax + 
            (deductions || 0)
        );

        // Tính lương thực nhận
        const net_salary = base_salary + (allowances || 0) - total_deductions;

        // Tạo bản ghi payroll với các trường bổ sung
        return await Payroll.create({
            employee_id,
            base_salary,
            allowances: allowances || 0,
            deductions: deductions || 0,
            social_insurance,
            health_insurance,
            unemployment_insurance,
            personal_income_tax,
            total_deductions,
            net_salary,
            pay_period,
            region,
            status
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
    },

    // Thêm phương thức để lấy tất cả bảng lương
    getAllPayrolls: async () => {
        try {
            return await Payroll.findAll({
                include: [{
                    model: User,
                    as: 'employee',
                    attributes: ['id', 'full_name', 'email']
                }],
                order: [['created_at', 'DESC']]
            });
        } catch (error) {
            console.error("Error fetching payrolls:", error);
            throw error;
        }
    },

    deletePayroll: async (payrollId) => {
        try {
            const result = await Payroll.destroy({ where: { id: payrollId } });
            return result > 0; // Trả về true nếu xóa thành công
        } catch (error) {
            console.error('Error deleting payroll:', error);
            throw error;
        }
    }
};

module.exports = payrollService;