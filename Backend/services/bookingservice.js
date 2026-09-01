const db = require("../config/db");


// ==========================================
// GET BOOKINGS BY USER ID
// ==========================================

exports.getBookingsByUserId = async (userId) => {

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

                coach,
                seat_number,
                berth_type,

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

             WHERE user_id = ?

             ORDER BY id DESC`,

            [userId]

        );


    return rows;

};


// ==========================================
// GET BOOKING BY PNR
// ==========================================

exports.getBookingByPNR = async (
    pnr,
    userId
) => {

    const cleanPNR =
        String(pnr || "").trim();


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

                coach,
                seat_number,
                berth_type,

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

             WHERE TRIM(CAST(pnr AS CHAR)) = ?

             AND user_id = ?

             LIMIT 1`,

            [
                cleanPNR,
                userId
            ]

        );


    return rows[0] || null;

};


// ==========================================
// GET BOOKING BY PAYMENT ID
// ==========================================

exports.getBookingByPaymentId = async (
    paymentId
) => {

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

                coach,
                seat_number,
                berth_type,

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

             WHERE payment_id = ?

             LIMIT 1`,

            [paymentId]

        );


    return rows[0] || null;

};


// ==========================================
// CHECK IF PNR EXISTS
// ==========================================

exports.pnrExists = async (pnr) => {

    const cleanPNR =
        String(pnr || "").trim();


    const [rows] =
        await db.promise().query(

            `SELECT id
             FROM bookings
             WHERE TRIM(CAST(pnr AS CHAR)) = ?
             LIMIT 1`,

            [cleanPNR]

        );


    return rows.length > 0;

};


// ==========================================
// CREATE BOOKING
// ==========================================

exports.createBooking = async (
    bookingData
) => {

    const {

        userId,
        pnr,

        trainNo,
        trainName,

        from,
        to,
        date,

        name,
        age,
        gender,

        coach,
        seatNumber,
        berthType,

        fare,

        paymentId

    } = bookingData;


    const insertQuery = `

        INSERT INTO bookings (

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

            coach,
            seat_number,
            berth_type,

            fare,

            payment_id,
            payment_status,
            booking_status,

            refund_id,
            refund_amount,
            refund_status,
            refunded_at

        )

        VALUES (

            ?, ?,

            ?, ?,

            ?, ?, ?,

            ?, ?, ?,

            ?, ?, ?,

            ?,

            ?,
            'Paid',
            'Confirmed',

            NULL,
            0.00,
            'Not Requested',
            NULL

        )

    `;


    const [result] =
        await db.promise().query(

            insertQuery,

            [
                userId,

                String(
                    pnr
                ).trim(),

                String(
                    trainNo
                ).trim(),

                String(
                    trainName
                ).trim(),

                String(
                    from
                ).trim(),

                String(
                    to
                ).trim(),

                date,

                String(
                    name
                ).trim(),

                Number(age),

                String(
                    gender
                ).trim(),

                coach
                    ? String(coach).trim()
                    : null,

                seatNumber !== undefined &&
                seatNumber !== null
                    ? Number(seatNumber)
                    : null,

                berthType
                    ? String(berthType).trim()
                    : null,

                Number(fare),

                String(
                    paymentId
                ).trim()
            ]

        );


    return result;

};


// ==========================================
// CANCEL BOOKING
// ==========================================

exports.cancelBooking = async (
    pnr,
    userId
) => {

    const cleanPNR =
        String(pnr || "").trim();


    const [result] =
        await db.promise().query(

            `UPDATE bookings

             SET
                booking_status = 'Cancelled'

             WHERE TRIM(CAST(pnr AS CHAR)) = ?

             AND user_id = ?

             AND booking_status = 'Confirmed'`,

            [
                cleanPNR,
                userId
            ]

        );


    return result;

};


// ==========================================
// MARK REFUND AS PROCESSING
// ==========================================

exports.markRefundProcessing = async (
    pnr,
    userId
) => {

    const cleanPNR =
        String(pnr || "").trim();


    const [result] =
        await db.promise().query(

            `UPDATE bookings

             SET
                refund_status = 'Processing'

             WHERE TRIM(CAST(pnr AS CHAR)) = ?

             AND user_id = ?

             AND booking_status = 'Cancelled'

             AND (
                    refund_status = 'Not Requested'
                    OR refund_status = 'Failed'
                    OR refund_status IS NULL
                 )`,

            [
                cleanPNR,
                userId
            ]

        );


    return result;

};


// ==========================================
// SAVE SUCCESSFUL REFUND
// ==========================================

exports.saveRefund = async (
    pnr,
    userId,
    refundData
) => {

    const cleanPNR =
        String(pnr || "").trim();


    const {
        refundId,
        refundAmount
    } = refundData;


    const [result] =
        await db.promise().query(

            `UPDATE bookings

             SET
                refund_id = ?,
                refund_amount = ?,
                refund_status = 'Refunded',
                payment_status = 'Refunded',
                refunded_at = NOW()

             WHERE TRIM(CAST(pnr AS CHAR)) = ?

             AND user_id = ?

             AND booking_status = 'Cancelled'`,

            [
                refundId,

                Number(
                    refundAmount
                ),

                cleanPNR,

                userId
            ]

        );


    return result;

};


// ==========================================
// MARK REFUND AS FAILED
// ==========================================

exports.markRefundFailed = async (
    pnr,
    userId
) => {

    const cleanPNR =
        String(pnr || "").trim();


    const [result] =
        await db.promise().query(

            `UPDATE bookings

             SET
                refund_status = 'Failed'

             WHERE TRIM(CAST(pnr AS CHAR)) = ?

             AND user_id = ?

             AND booking_status = 'Cancelled'`,

            [
                cleanPNR,
                userId
            ]

        );


    return result;

};


// ==========================================
// GET REFUND DETAILS BY PNR
// ==========================================

exports.getRefundByPNR = async (
    pnr,
    userId
) => {

    const cleanPNR =
        String(pnr || "").trim();


    const [rows] =
        await db.promise().query(

            `SELECT
                id,
                pnr,

                payment_id,
                payment_status,
                booking_status,

                refund_id,
                refund_amount,
                refund_status,
                refunded_at

             FROM bookings

             WHERE TRIM(CAST(pnr AS CHAR)) = ?

             AND user_id = ?

             LIMIT 1`,

            [
                cleanPNR,
                userId
            ]

        );


    return rows[0] || null;

};