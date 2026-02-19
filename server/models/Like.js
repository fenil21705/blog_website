const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Like = sequelize.define('Like', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    blogId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    // Ensure a user can only like a blog once
    indexes: [
        {
            unique: true,
            fields: ['userId', 'blogId']
        }
    ]
});

module.exports = Like;
