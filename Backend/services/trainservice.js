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
              LOWER(TRIM($1))

        AND LOWER(TRIM(destination)) =
            LOWER(TRIM($2))

        ORDER BY train_number ASC

    `;


    const result =
        await db.query(

            sql,

            [
                String(from).trim(),
                String(to).trim()
            ]

        );


    return result.rows;

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
            train_number::text
        ) = $1

        LIMIT 1

    `;


    const result =
        await db.query(

            sql,

            [
                String(
                    trainNumber
                ).trim()
            ]

        );


    return result.rows[0] || null;

};