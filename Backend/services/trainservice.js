const db = require("../config/db");


// ==========================================
// SEARCH TRAINS
// ==========================================

exports.searchTrains = async (from, to) => {

    const sql = `

        SELECT
            id,
            train_number,
            train_name,

            source,
            source_code,
            source_latitude,
            source_longitude,

            destination,
            destination_code,
            destination_latitude,
            destination_longitude,

            departure_time,
            arrival_time,
            duration,
            available_seats,
            fare

        FROM trains

        WHERE LOWER(TRIM(source)) =
              LOWER(TRIM(?))

        AND LOWER(TRIM(destination)) =
            LOWER(TRIM(?))

        ORDER BY train_number ASC

    `;


    const [rows] =
        await db.promise().query(

            sql,

            [
                from,
                to
            ]

        );


    return rows;

};


// ==========================================
// GET TRAIN BY TRAIN NUMBER
// ==========================================

exports.getTrainByNumber = async (
    trainNumber
) => {

    const sql = `

        SELECT
            id,
            train_number,
            train_name,

            source,
            source_code,
            source_latitude,
            source_longitude,

            destination,
            destination_code,
            destination_latitude,
            destination_longitude,

            departure_time,
            arrival_time,
            duration,
            available_seats,
            fare

        FROM trains

        WHERE TRIM(
            CAST(train_number AS CHAR)
        ) = ?

        LIMIT 1

    `;


    const [rows] =
        await db.promise().query(

            sql,

            [
                String(
                    trainNumber
                ).trim()
            ]

        );


    return rows[0] || null;

};