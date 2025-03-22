const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Payroll = sequelize.define('Payroll', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employee_id: { type: DataTypes.INTEGER, references: { model: User, key: 'id' }, allowNull: false },
    base_salary: { type: DataTypes.FLOAT, allowNull: false },
    allowances: { type: DataTypes.FLOAT, defaultValue: 0 },
    deductions: { type: DataTypes.FLOAT, defaultValue: 0 },
    net_salary: { type: DataTypes.FLOAT, allowNull: false },
    //hourly_rate: { type: DataTypes.FLOAT, allowNull: true },
    pay_period: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, { tableName: 'payrolls', timestamps: false });

module.exports = Payroll;
