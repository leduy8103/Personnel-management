const Payroll = require('../../models/payroll');
const PDFDocument = require('pdfkit');
const { sequelize } = require('../config/database');

class PayrollController {
    // Tạo bảng lương mới
    async createPayroll(req, res) {
        try {
            const { employee_id, base_salary, allowances, pay_period } = req.body;

            // Tính thuế (10%) và bảo hiểm (8%)
            const tax = base_salary * 0.1;
            const insurance = base_salary * 0.08;
            const deductions = tax + insurance;
            const net_salary = base_salary + allowances - deductions;

            const payroll = await Payroll.create({ employee_id, base_salary, allowances, deductions, net_salary, pay_period });
            res.status(201).json({ message: 'Payroll record created', payroll });
        } catch (error) {
            res.status(400).json({ message: 'Error creating payroll record', error: error.message });
        }
    }

    // Xem lịch sử nhận lương của nhân viên
    async getPayrollHistory(req, res) {
        try {
            const { employeeId, month } = req.params;
            const query = { employee_id: employeeId };
            if (month) query.pay_period = month;

            const history = await Payroll.findAll({ where: query });
            res.status(200).json({ history });
        } catch (error) {
            res.status(400).json({ message: 'Error retrieving payroll history', error: error.message });
        }
    }

    // Thống kê lương
    async getPayrollStatistics(req, res) {
        try {
            const totalPayroll = await Payroll.sum('net_salary');
            const avgSalary = await Payroll.findAll({
                attributes: [[sequelize.fn('AVG', sequelize.col('net_salary')), 'average_salary']]
            });

            const topPaidEmployees = await Payroll.findAll({
                attributes: ['employee_id', [sequelize.fn('MAX', sequelize.col('net_salary')), 'max_salary']],
                group: ['employee_id'],
                order: [[sequelize.literal('max_salary'), 'DESC']],
                limit: 5
            });

            res.status(200).json({
                totalPayroll,
                averageSalary: avgSalary[0].dataValues.average_salary,
                topPaidEmployees
            });
        } catch (error) {
            res.status(400).json({ message: 'Error calculating payroll statistics', error: error.message });
        }
    }

    // Xuất phiếu lương PDF hoặc JSON
    async exportPayroll(req, res) {
        try {
            const { employeeId } = req.params;
            const payrolls = await Payroll.findAll({ where: { employee_id: employeeId } });

            if (req.query.format === 'pdf') {
                const doc = new PDFDocument();
                res.setHeader('Content-Disposition', 'attachment; filename="payslip.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                doc.pipe(res);

                doc.fontSize(16).text(`Phiếu lương cho nhân viên ID: ${employeeId}`, { align: 'center' });
                payrolls.forEach(payroll => {
                    doc.moveDown().fontSize(12).text(`Thời gian: ${payroll.pay_period}`);
                    doc.text(`Lương cơ bản: ${payroll.base_salary}`);
                    doc.text(`Phụ cấp: ${payroll.allowances}`);
                    doc.text(`Khấu trừ: ${payroll.deductions}`);
                    doc.text(`Lương ròng: ${payroll.net_salary}`);
                    doc.moveDown();
                });

                doc.end();
            } else {
                res.status(200).json({ payrolls });
            }
        } catch (error) {
            res.status(400).json({ message: 'Error exporting payroll', error: error.message });
        }
    }
}

module.exports = new PayrollController();
