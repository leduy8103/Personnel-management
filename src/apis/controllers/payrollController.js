const payrollService = require('../../services/payrollService');

class PayrollController {
    async createPayroll(req, res) {
        try {
            const payroll = await payrollService.createPayroll(req.body);
            res.status(201).json({ message: 'Payroll created successfully', payroll });
        } catch (error) {
            res.status(400).json({ message: 'Payroll creation failed', error: error.message });
        }
    }

    async getPayrollHistory(req, res) {
        try {
            const { employeeId, month } = req.params;
            const history = await payrollService.getPayrollHistory(employeeId, month);
            res.status(200).json({ history });
        } catch (error) {
            res.status(400).json({ message: 'Failed to fetch payroll history', error: error.message });
        }
    }

    async getPayrollStatistics(req, res) {
        try {
            const statistics = await payrollService.getPayrollStatistics();
            res.status(200).json(statistics);
        } catch (error) {
            res.status(400).json({ message: 'Failed to fetch payroll statistics', error: error.message });
        }
    }

    async exportPayroll(req, res) {
        try {
            const { employeeId } = req.params;
            const payroll = await payrollService.exportPayroll(employeeId);

            if (!payroll) {
                return res.status(404).json({ message: 'Payroll record not found' });
            }

            res.status(200).json({ payroll });
        } catch (error) {
            res.status(400).json({ message: 'Failed to export payroll', error: error.message });
        }
    }

}

module.exports = new PayrollController();
