const db = require("../config/db");


// ==========================================
// HELPER: MYSQL-LIKE UPDATE RESULT
// ==========================================

function updateResult(result) {

    return {
        affectedRows: result.rowCount
    };

}


// ==========================================
// GET BOOKINGS BY USER ID
// ==========================================

exports.getBookingsByUserId = async (userId) => {

    const result = await db.query(

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

         WHERE user_id = $1

         ORDER BY id DESC`,

        [userId]

    );


    return result.rows;

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


    const result = await db.query(

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

         WHERE TRIM(pnr::text) = $1

         AND user_id = $2

         LIMIT 1`,

        [
            cleanPNR,
            userId
        ]

    );


    return result.rows[0] || null;

};


// ==========================================
// GET BOOKING BY PAYMENT ID
// ==========================================

exports.getBookingByPaymentId = async (
    paymentId
) => {

    const result = await db.query(

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

         WHERE payment_id = $1

         LIMIT 1`,

        [paymentId]

    );


    return result.rows[0] || null;

};


// ==========================================
// CHECK IF PNR EXISTS
// ==========================================

exports.pnrExists = async (pnr) => {

    const cleanPNR =
        String(pnr || "").trim();


    const result = await db.query(

        `SELECT id

         FROM bookings

         WHERE TRIM(pnr::text) = $1

         LIMIT 1`,

        [cleanPNR]

    );


    return result.rows.length > 0;

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

            $1, $2,

            $3, $4,

            $5, $6, $7,

            $8, $9, $10,

            $11, $12, $13,

            $14,

            $15,
            'Paid',
            'Confirmed',

            NULL,
            0.00,
            'Not Requested',
            NULL

        )

        RETURNING id

    `;


    const result = await db.query(

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
                ? String(seatNumber).trim()
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


    return {
        insertId: result.rows[0].id,
        affectedRows: result.rowCount
    };

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


    const result = await db.query(

        `UPDATE bookings

         SET
            booking_status = 'Cancelled'

         WHERE TRIM(pnr::text) = $1

         AND user_id = $2

         AND booking_status = 'Confirmed'`,

        [
            cleanPNR,
            userId
        ]

    );


    return updateResult(result);

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


    const result = await db.query(

        `UPDATE bookings

         SET
            refund_status = 'Processing'

         WHERE TRIM(pnr::text) = $1

         AND user_id = $2

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


    return updateResult(result);

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


    const result = await db.query(

        `UPDATE bookings

         SET
            refund_id = $1,
            refund_amount = $2,
            refund_status = 'Refunded',
            payment_status = 'Refunded',
            refunded_at = NOW()

         WHERE TRIM(pnr::text) = $3

         AND user_id = $4

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


    return updateResult(result);

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


    const result = await db.query(

        `UPDATE bookings

         SET
            refund_status = 'Failed'

         WHERE TRIM(pnr::text) = $1

         AND user_id = $2

         AND booking_status = 'Cancelled'`,

        [
            cleanPNR,
            userId
        ]

    );


    return updateResult(result);

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


    const result = await db.query(

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

         WHERE TRIM(pnr::text) = $1

         AND user_id = $2

         LIMIT 1`,

        [
            cleanPNR,
            userId
        ]

    );


    return result.rows[0] || null;

};