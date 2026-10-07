require("dotenv").config();

const { Pool } = require("pg");


// ==========================================================
// CHECK DATABASE URL
// ==========================================================

if (!process.env.DATABASE_URL) {

    console.error(
        "❌ DATABASE_URL is missing from environment variables"
    );

}


// ==========================================================
// SUPABASE POSTGRESQL CONNECTION POOL
// ==========================================================

const db = new Pool({

    connectionString:
        process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    },

    max: 5,

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 20000

});


// ==========================================================
// DATABASE ERROR HANDLER
// ==========================================================

db.on(
    "error",
    (error) => {

        console.error(
            "❌ PostgreSQL Pool Error:",
            error.message
        );

    }
);


// ==========================================================
// TEST DATABASE CONNECTION
// ==========================================================

async function testDatabaseConnection() {

    try {

        const result =
            await db.query(
                "SELECT NOW() AS current_time"
            );

        console.log(
            "✅ Supabase PostgreSQL connected successfully"
        );

        console.log(
            "Database Time:",
            result.rows[0].current_time
        );

    }
    catch (error) {

        console.error(
            "❌ Supabase PostgreSQL connection failed:",
            error.message
        );

    }

}


testDatabaseConnection();


// ==========================================================
// EXPORT DATABASE POOL
// ==========================================================

module.exports = db;