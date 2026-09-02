require("dotenv").config();

const mysql = require("mysql2");

// ==========================================================
// MYSQL CONNECTION POOL
// ==========================================================

const db = mysql.createPool({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT || 3306,


    // ======================================================
    // POOL SETTINGS
    // ======================================================

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0,

    enableKeepAlive: true,

    keepAliveInitialDelay: 0

});


// ==========================================================
// TEST DATABASE CONNECTION
// ==========================================================

db.query(
    "SELECT 1",
    (error) => {

        if (error) {

            console.error(
                "❌ MySQL connection failed:",
                error.message
            );

            return;

        }

        console.log(
            "✅ MySQL database connected successfully"
        );

    }
);


// ==========================================================
// EXPORT POOL
// ==========================================================

module.exports = db;