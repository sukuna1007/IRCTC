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

    port: Number(process.env.DB_PORT) || 3306,


    // ======================================================
    // POOL SETTINGS
    // ======================================================

    waitForConnections: true,

    connectionLimit: 5,

    maxIdle: 5,

    idleTimeout: 60000,

    queueLimit: 0,

    enableKeepAlive: true,

    keepAliveInitialDelay: 10000,

    connectTimeout: 20000

});


// ==========================================================
// NEW CONNECTION LOG
// ==========================================================

db.on(
    "connection",
    (connection) => {

        console.log(
            "✅ MySQL connection created:",
            connection.threadId
        );

    }
);


// ==========================================================
// POOL ERROR LOG
// ==========================================================

db.on(
    "error",
    (error) => {

        console.error(
            "❌ MySQL Pool Error:",
            error.code,
            error.message
        );

    }
);


// ==========================================================
// TEST DATABASE CONNECTION
// ==========================================================

db.promise()
    .query("SELECT 1")
    .then(() => {

        console.log(
            "✅ MySQL database connected successfully"
        );

    })
    .catch((error) => {

        console.error(
            "❌ MySQL connection failed:",
            error.code,
            error.message
        );

    });


// ==========================================================
// EXPORT POOL
// ==========================================================

module.exports = db;