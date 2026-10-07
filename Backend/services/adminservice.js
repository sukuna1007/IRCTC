const db = require("../config/db");


// =====================================================
// HELPER: MYSQL-LIKE RESULT
// =====================================================

function updateResult(result) {

    return {
        affectedRows: result.rowCount
    };

}


// =====================================================
// GET ADMIN DASHBOARD DATA
// =====================================================

exports.getDashboardData = async () => {

    const [
        userResult,
        trainResult,
        bookingResult,
        revenueResult,
        confirmedResult
    ] = await Promise.all([

        db.query(
            `SELECT COUNT(*) AS "totalUsers"
             FROM users`
        ),

        db.query(
            `SELECT COUNT(*) AS "totalTrains"
             FROM trains`
        ),

        db.query(
            `SELECT COUNT(*) AS "totalBookings"
             FROM bookings`
        ),

        db.query(
            `SELECT
                COALESCE(SUM(fare), 0) AS "totalRevenue"
             FROM bookings
             WHERE LOWER(payment_status) = 'paid'`
        ),

        db.query(
            `SELECT
                COUNT(*) AS "confirmedBookings"
             FROM bookings
             WHERE LOWER(booking_status) = 'confirmed'`
        )

    ]);


    return {

        totalUsers:
            Number(
                userResult.rows[0].totalUsers
            ),

        totalTrains:
            Number(
                trainResult.rows[0].totalTrains
            ),

        totalBookings:
            Number(
                bookingResult.rows[0].totalBookings
            ),

        confirmedBookings:
            Number(
                confirmedResult.rows[0].confirmedBookings
            ),

        totalRevenue:
            Number(
                revenueResult.rows[0].totalRevenue
            )

    };

};


// =====================================================
// GET ALL USERS
// =====================================================

exports.getAllUsers = async () => {

    const result =
        await db.query(

            `SELECT
                id,
                full_name,
                email,
                phone,
                role,
                address,
                dob,
                profile_image,
                created_at

             FROM users

             ORDER BY id DESC`

        );


    return result.rows;

};


// =====================================================
// GET USER BY ID
// =====================================================

exports.getUserById = async (userId) => {

    const result =
        await db.query(

            `SELECT
                id,
                full_name,
                email,
                phone,
                role,
                address,
                dob,
                profile_image,
                created_at

             FROM users

             WHERE id = $1

             LIMIT 1`,

            [userId]

        );


    return result.rows[0] || null;

};


// =====================================================
// UPDATE USER ROLE
// =====================================================

exports.updateUserRole = async (
    userId,
    role
) => {

    const result =
        await db.query(

            `UPDATE users

             SET role = $1

             WHERE id = $2`,

            [
                role,
                userId
            ]

        );


    return updateResult(result);

};


// =====================================================
// DELETE USER
// =====================================================

exports.deleteUser = async (userId) => {

    const result =
        await db.query(

            `DELETE FROM users

             WHERE id = $1`,

            [userId]

        );


    return updateResult(result);

};


// =====================================================
// GET ALL BOOKINGS
// =====================================================

exports.getAllBookings = async () => {

    const result =
        await db.query(

            `SELECT
                b.id,
                b.user_id,

                u.full_name AS user_name,
                u.email AS user_email,

                b.pnr,

                b.train_no,
                b.train_name,

                b.source,
                b.destination,

                b.journey_date,

                b.passenger_name,
                b.passenger_age,
                b.passenger_gender,

                b.fare,

                b.payment_id,
                b.payment_status,
                b.booking_status,

                b.refund_id,
                b.refund_amount,
                b.refund_status,
                b.refunded_at,

                b.created_at

             FROM bookings b

             LEFT JOIN users u
                ON b.user_id = u.id

             ORDER BY b.id DESC`

        );


    return result.rows;

};


// =====================================================
// GET BOOKING BY ID
// =====================================================

exports.getBookingById = async (
    bookingId
) => {

    const result =
        await db.query(

            `SELECT
                id,
                user_id,
                pnr,

                train_no,
                train_name,

                source,
                destination,

                journey_date,

                passenger_name,
                passenger_age,
                passenger_gender,

                fare,

                payment_id,
                payment_status,
                booking_status,

                refund_id,
                refund_amount,
                refund_status,
                refunded_at,

                created_at

             FROM bookings

             WHERE id = $1

             LIMIT 1`,

            [bookingId]

        );


    return result.rows[0] || null;

};


// =====================================================
// UPDATE BOOKING STATUS
// =====================================================

exports.updateBookingStatus = async (
    bookingId,
    bookingStatus
) => {

    const result =
        await db.query(

            `UPDATE bookings

             SET booking_status = $1

             WHERE id = $2`,

            [
                bookingStatus,
                bookingId
            ]

        );


    return updateResult(result);

};


// =====================================================
// GET ALL TRAINS
// =====================================================

exports.getAllTrains = async () => {

    const result =
        await db.query(

            `SELECT
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

             ORDER BY id DESC`

        );


    return result.rows;

};


// =====================================================
// GET TRAIN BY ID
// =====================================================

exports.getTrainById = async (trainId) => {

    const result =
        await db.query(

            `SELECT
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

             WHERE id = $1

             LIMIT 1`,

            [trainId]

        );


    return result.rows[0] || null;

};


// =====================================================
// GET TRAIN BY NUMBER
// =====================================================

exports.getTrainByNumber = async (
    trainNumber
) => {

    const result =
        await db.query(

            `SELECT
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

             WHERE TRIM(train_number::text) = $1

             LIMIT 1`,

            [
                String(
                    trainNumber
                ).trim()
            ]

        );


    return result.rows[0] || null;

};


// =====================================================
// FIND DUPLICATE TRAIN NUMBER
// =====================================================

exports.findDuplicateTrainNumber = async (
    trainNumber,
    excludeTrainId = null
) => {

    let sql = `

        SELECT
            id,
            train_number

        FROM trains

        WHERE TRIM(train_number::text) = $1

    `;


    const values = [

        String(
            trainNumber
        ).trim()

    ];


    if (
        excludeTrainId !== null
    ) {

        sql += `

            AND id != $2

        `;

        values.push(
            excludeTrainId
        );

    }


    sql += `

        LIMIT 1

    `;


    const result =
        await db.query(
            sql,
            values
        );


    return result.rows[0] || null;

};


// =====================================================
// ADD TRAIN
// =====================================================

exports.addTrain = async (trainData) => {

    const {

        trainNumber,
        trainName,

        source,
        sourceCode,
        sourceLatitude,
        sourceLongitude,

        destination,
        destinationCode,
        destinationLatitude,
        destinationLongitude,

        departureTime,
        arrivalTime,

        duration,
        availableSeats,
        fare

    } = trainData;


    const result =
        await db.query(

            `INSERT INTO trains (

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

             )

             VALUES (
                $1, $2,
                $3, $4, $5, $6,
                $7, $8, $9, $10,
                $11, $12,
                $13, $14, $15
             )

             RETURNING id`,

            [
                trainNumber,
                trainName,

                source,
                sourceCode || null,
                sourceLatitude || null,
                sourceLongitude || null,

                destination,
                destinationCode || null,
                destinationLatitude || null,
                destinationLongitude || null,

                departureTime,
                arrivalTime,

                duration,

                Number(
                    availableSeats
                ),

                Number(
                    fare
                )
            ]

        );


    return {
        insertId:
            result.rows[0].id,

        affectedRows:
            result.rowCount
    };

};


// =====================================================
// UPDATE TRAIN
// =====================================================

exports.updateTrain = async (
    trainId,
    trainData
) => {

    const {

        trainNumber,
        trainName,

        source,
        sourceCode,
        sourceLatitude,
        sourceLongitude,

        destination,
        destinationCode,
        destinationLatitude,
        destinationLongitude,

        departureTime,
        arrivalTime,

        duration,
        availableSeats,
        fare

    } = trainData;


    const result =
        await db.query(

            `UPDATE trains

             SET
                train_number = $1,
                train_name = $2,

                source = $3,
                source_code = $4,
                source_latitude = $5,
                source_longitude = $6,

                destination = $7,
                destination_code = $8,
                destination_latitude = $9,
                destination_longitude = $10,

                departure_time = $11,
                arrival_time = $12,

                duration = $13,
                available_seats = $14,
                fare = $15

             WHERE id = $16`,

            [
                trainNumber,
                trainName,

                source,
                sourceCode || null,
                sourceLatitude || null,
                sourceLongitude || null,

                destination,
                destinationCode || null,
                destinationLatitude || null,
                destinationLongitude || null,

                departureTime,
                arrivalTime,

                duration,

                Number(
                    availableSeats
                ),

                Number(
                    fare
                ),

                trainId
            ]

        );


    return updateResult(result);

};


// =====================================================
// DELETE TRAIN
// =====================================================

exports.deleteTrain = async (trainId) => {

    const result =
        await db.query(

            `DELETE FROM trains

             WHERE id = $1`,

            [trainId]

        );


    return updateResult(result);

};