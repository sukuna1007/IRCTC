const mysql = require("mysql2");


// ==========================================
// MYSQL DATABASE CONNECTION
// ==========================================

const connection = mysql.createConnection({

    host: process.env.DB_HOST || "localhost",

    user: process.env.DB_USER || "root",

    password: process.env.DB_PASSWORD || "",

    database: process.env.DB_NAME || "irctc_db"

});


// ==========================================
// CONNECT TO MYSQL
// ==========================================

connection.connect((err) => {

    if (err) {

        console.error(
            "=========================================="
        );

        console.error(
            "MySQL Connection Failed"
        );

        console.error(
            "Error:",
            err.message
        );

        console.error(
            "=========================================="
        );

        return;
    }


    console.log(
        "=========================================="
    );

    console.log(
        "MySQL Connected Successfully"
    );

    console.log(
        "Database:",
        process.env.DB_NAME || "irctc_db"
    );

    console.log(
        "=========================================="
    );


    // ==========================================
    // VERIFY ACTIVE DATABASE
    // ==========================================

    connection.query(

        "SELECT DATABASE() AS database_name",

        (error, results) => {

            if (error) {

                console.error(
                    "Unable to verify database:",
                    error.message
                );

                return;
            }


            console.log(
                "Active MySQL Database:",
                results[0].database_name
            );

        }

    );

});


// ==========================================
// DATABASE ERROR HANDLER
// ==========================================

connection.on(
    "error",
    (err) => {

        console.error(
            "MySQL Error:",
            err.message
        );

    }
);


// ==========================================
// EXPORT CONNECTION
// ==========================================

module.exports = connection;