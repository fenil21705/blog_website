const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Failsafe for Self-Signed Certificate errors on Vercel/Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Switching to SQLite for a "no-setup" experience without XAMPP
// This creates a 'database.sqlite' file in the server directory
let sequelize;

if (process.env.DATABASE_URL) {
    console.log("Using Supabase/PostgreSQL Database");

    // Sanitize the URL: remove sslmode=require if it exists to avoid conflicts with dialectOptions
    let connectionString = process.env.DATABASE_URL.trim().replace('sslmode=require', '');
    if (connectionString.includes('?')) {
        connectionString = connectionString.replace(/\?$/, '');
    } else {
        connectionString = connectionString;
    }

    sequelize = new Sequelize(connectionString, {
        dialect: 'postgres',
        dialectModule: require('pg'),
        protocol: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
} else {
    console.log("Using Local SQLite Database");
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../database.sqlite'),
        logging: false,
    });
}

module.exports = sequelize;
