const db = require("../config/db");


// =====================================================
// GET ADMIN DASHBOARD DATA
// =====================================================

exports.getDashboardData = async () => {

    const [
        [userResult],
        [trainResult],
        [bookingResult],
        [revenueResult],
        [confirmedResult]
    ] = await Promise.all([

        db.promise().query(
            `SELECT COUNT(*) AS totalUsers
             FROM users`
        ),

        db.promise().query(
            `SELECT COUNT(*) AS totalTrains
             FROM trains`
        ),

        db.promise().query(
            `SELECT COUNT(*) AS totalBookings
             FROM bookings`
        ),

        db.promise().query(
            `SELECT
                COALESCE(SUM(fare), 0) AS totalRevenue
             FROM bookings
             WHERE payment_status = 'Paid'`
        ),

        db.promise().query(
            `SELECT
                COUNT(*) AS confirmedBookings
             FROM bookings
             WHERE booking_status = 'Confirmed'`
        )

    ]);


    return {

        totalUsers:
            Number(
                userResult[0].totalUsers
            ),

        totalTrains:
            Number(
                trainResult[0].totalTrains
            ),

        totalBookings:
            Number(
                bookingResult[0].totalBookings
            ),

        confirmedBookings:
            Number(
                confirmedResult[0].confirmedBookings
            ),

        totalRevenue:
            Number(
                revenueResult[0].totalRevenue
            )

    };

};


// =====================================================
// GET ALL USERS
// =====================================================

exports.getAllUsers = async () => {

    const [rows] =
        await db.promise().query(

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


    return rows;
};


// =====================================================
// GET USER BY ID
// =====================================================

exports.getUserById = async (userId) => {

    const [rows] =
        await db.promise().query(

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
             WHERE id = ?
             LIMIT 1`,

            [userId]

        );


    return rows[0] || null;
};


// =====================================================
// UPDATE USER ROLE
// =====================================================

exports.updateUserRole = async (
    userId,
    role
) => {

    const [result] =
        await db.promise().query(

            `UPDATE users
             SET role = ?
             WHERE id = ?`,

            [
                role,
                userId
            ]

        );


    return result;
};


// =====================================================
// DELETE USER
// =====================================================

exports.deleteUser = async (userId) => {

    const [result] =
        await db.promise().query(

            `DELETE FROM users
             WHERE id = ?`,

            [userId]

        );


    return result;
};


// =====================================================
// GET ALL BOOKINGS
// =====================================================

exports.getAllBookings = async () => {

    const [rows] =
        await db.promise().query(

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


    return rows;
};


// =====================================================
// GET BOOKING BY ID
// =====================================================

exports.getBookingById = async (bookingId) => {

    const [rows] =
        await db.promise().query(

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
             WHERE id = ?
             LIMIT 1`,

            [bookingId]

        );


    return rows[0] || null;
};


// =====================================================
// UPDATE BOOKING STATUS
// =====================================================

exports.updateBookingStatus = async (
    bookingId,
    bookingStatus
) => {

    const [result] =
        await db.promise().query(

            `UPDATE bookings
             SET booking_status = ?
             WHERE id = ?`,

            [
                bookingStatus,
                bookingId
            ]

        );


    return result;
};


// =====================================================
// GET ALL TRAINS
// =====================================================

exports.getAllTrains = async () => {

    const [rows] =
        await db.promise().query(

            `SELECT
                id,
                train_number,
                train_name,
                source,
                destination,
                departure_time,
                arrival_time,
                duration,
                available_seats,
                fare
             FROM trains
             ORDER BY id DESC`

        );


    return rows;
};


// =====================================================
// GET TRAIN BY ID
// =====================================================

exports.getTrainById = async (trainId) => {

    const [rows] =
        await db.promise().query(

            `SELECT
                id,
                train_number,
                train_name,
                source,
                destination,
                departure_time,
                arrival_time,
                duration,
                available_seats,
                fare
             FROM trains
             WHERE id = ?
             LIMIT 1`,

            [trainId]

        );


    return rows[0] || null;
};


// =====================================================
// GET TRAIN BY NUMBER
// =====================================================

exports.getTrainByNumber = async (
    trainNumber
) => {

    const [rows] =
        await db.promise().query(

            `SELECT
                id,
                train_number,
                train_name,
                source,
                destination,
                departure_time,
                arrival_time,
                duration,
                available_seats,
                fare
             FROM trains
             WHERE TRIM(
                CAST(train_number AS CHAR)
             ) = ?
             LIMIT 1`,

            [
                String(
                    trainNumber
                ).trim()
            ]

        );


    return rows[0] || null;
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

        WHERE TRIM(
            CAST(train_number AS CHAR)
        ) = ?

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

            AND id != ?

        `;

        values.push(
            excludeTrainId
        );

    }


    sql += `

        LIMIT 1

    `;


    const [rows] =
        await db.promise().query(

            sql,

            values

        );


    return rows[0] || null;
};


// =====================================================
// ADD TRAIN
// =====================================================

exports.addTrain = async (trainData) => {

    const {

        trainNumber,
        trainName,
        source,
        destination,
        departureTime,
        arrivalTime,
        duration,
        availableSeats,
        fare

    } = trainData;


    const [result] =
        await db.promise().query(

            `INSERT INTO trains (
                train_number,
                train_name,
                source,
                destination,
                departure_time,
                arrival_time,
                duration,
                available_seats,
                fare
             )
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,

            [
                trainNumber,
                trainName,
                source,
                destination,
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


    return result;
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
        destination,
        departureTime,
        arrivalTime,
        duration,
        availableSeats,
        fare

    } = trainData;


    const [result] =
        await db.promise().query(

            `UPDATE trains
             SET
                train_number = ?,
                train_name = ?,
                source = ?,
                destination = ?,
                departure_time = ?,
                arrival_time = ?,
                duration = ?,
                available_seats = ?,
                fare = ?
             WHERE id = ?`,

            [
                trainNumber,
                trainName,
                source,
                destination,
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


    return result;
};


// =====================================================
// DELETE TRAIN
// =====================================================

exports.deleteTrain = async (trainId) => {

    const [result] =
        await db.promise().query(

            `DELETE FROM trains
             WHERE id = ?`,

            [trainId]

        );


    return result;
};