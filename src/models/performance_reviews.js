const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Performance_reviews  = sequelize.define('Performance_reviews', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    review_period: {
        type: DataTypes.ENUM('Monthly', 'Quarterly', 'Yearly'),
        defaultValue: 'Monthly',
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100,
        },
    },
    reviewer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    comments: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: 'performance_reviews',
    timestamps: false,
});

module.exports = Performance_reviews;