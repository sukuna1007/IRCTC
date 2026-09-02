const Razorpay = require("razorpay");
const crypto = require("crypto");

const bookingService =
    require("../services/bookingservice");

const trainService =
    require("../services/trainservice");

const seatAllocator =
    require("../utils/seatallocator");


// ==========================================
// RAZORPAY CONFIGURATION
// ==========================================

const razorpayKeyId =
    process.env.RAZORPAY_KEY_ID;

const razorpayKeySecret =
    process.env.RAZORPAY_KEY_SECRET;


let razorpay = null;


// ==========================================
// INITIALIZE RAZORPAY SAFELY
// ==========================================

if (
    razorpayKeyId &&
    razorpayKeySecret
) {

    razorpay =
        new Razorpay({

            key_id:
                razorpayKeyId,

            key_secret:
                razorpayKeySecret

        });


    console.log(
        "Razorpay configured successfully"
    );

}
else {

    console.error(
        "Razorpay environment variables are missing"
    );

    console.error(
        "RAZORPAY_KEY_ID exists:",
        Boolean(
            razorpayKeyId
        )
    );

    console.error(
        "RAZORPAY_KEY_SECRET exists:",
        Boolean(
            razorpayKeySecret
        )
    );

}


// ==========================================
// GENERATE UNIQUE PNR
// ==========================================

function generatePNR() {

    const datePart =
        new Date()
            .toISOString()
            .slice(2, 10)
            .replace(/-/g, "");


    const randomPart =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        datePart +
        randomPart
    );

}


// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================
// POST /api/payment/create-order
// ==========================================

exports.createOrder = async (req, res) => {

    try {

        // ==========================================
        // CHECK RAZORPAY CONFIGURATION
        // ==========================================

        if (!razorpay) {

            return res.status(500).json({

                success: false,

                message:
                    "Razorpay is not configured on the server"

            });

        }


        const userId =
            req.user.id;


        const {
            trainNo
        } = req.body;


        // ==========================================
        // VALIDATE TRAIN NUMBER
        // ==========================================

        if (!trainNo) {

            return res.status(400).json({

                success: false,

                message:
                    "Train number is required"

            });

        }


        const cleanTrainNo =
            String(
                trainNo
            ).trim();


        // ==========================================
        // GET TRAIN FROM DATABASE
        // ==========================================

        const train =
            await trainService
                .getTrainByNumber(
                    cleanTrainNo
                );


        if (!train) {

            return res.status(404).json({

                success: false,

                message:
                    "Train not found"

            });

        }


        // ==========================================
        // GET REAL DATABASE FARE
        // ==========================================

        const actualFare =
            Number(
                train.fare
            );


        if (
            !Number.isFinite(
                actualFare
            ) ||
            actualFare <= 0
        ) {

            return res.status(500).json({

                success: false,

                message:
                    "Invalid train fare in database"

            });

        }


        // ==========================================
        // CONVERT TO PAISE
        // ==========================================

        const amountInPaise =
            Math.round(
                actualFare * 100
            );


        console.log(
            "=========================================="
        );

        console.log(
            "Creating Razorpay Order"
        );

        console.log(
            "User ID:",
            userId
        );

        console.log(
            "Train Number:",
            train.train_number
        );

        console.log(
            "Database Fare:",
            actualFare
        );

        console.log(
            "Amount In Paise:",
            amountInPaise
        );

        console.log(
            "=========================================="
        );


        // ==========================================
        // CREATE RAZORPAY ORDER
        // ==========================================

        const orderOptions = {

            amount:
                amountInPaise,

            currency:
                "INR",

            receipt:
                "IRCTC_" +
                Date.now(),

            notes: {

                user_id:
                    String(
                        userId
                    ),

                train_no:
                    String(
                        train.train_number
                    ),

                fare:
                    String(
                        actualFare
                    )

            }

        };


        const order =
            await razorpay.orders.create(
                orderOptions
            );


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            key_id:
                razorpayKeyId,

            train: {

                trainNo:
                    train.train_number,

                trainName:
                    train.train_name,

                from:
                    train.source,

                to:
                    train.destination,

                fare:
                    actualFare

            },

            order:
                order

        });


    }
    catch (error) {

        console.error(
            "Razorpay Create Order Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to create payment order",

            error:
                process.env.NODE_ENV ===
                "development"
                    ? error.message
                    : undefined

        });

    }

};


// ==========================================
// VERIFY PAYMENT + SAVE BOOKING
// ==========================================
// POST /api/payment/verify
// ==========================================

exports.verifyPayment = async (req, res) => {

    try {

        // ==========================================
        // CHECK RAZORPAY CONFIGURATION
        // ==========================================

        if (!razorpay) {

            return res.status(500).json({

                success: false,

                message:
                    "Razorpay is not configured on the server"

            });

        }


        // ==========================================
        // GET LOGGED-IN USER
        // ==========================================

        const userId =
            req.user.id;


        console.log(
            "=========================================="
        );

        console.log(
            "Verifying Payment For User ID:",
            userId
        );

        console.log(
            "=========================================="
        );


        // ==========================================
        // GET REQUEST DATA
        // ==========================================

        const {

            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,

            trainNo,

            date,

            name,
            age,
            gender

        } = req.body;


        // ==========================================
        // VALIDATE PAYMENT DETAILS
        // ==========================================

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment details are incomplete"

            });

        }


        // ==========================================
        // VALIDATE BOOKING DETAILS
        // ==========================================

        if (
            !trainNo ||
            !date ||
            !name ||
            age === undefined ||
            age === null ||
            !gender
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Booking details are incomplete"

            });

        }


        // ==========================================
        // VALIDATE AGE
        // ==========================================

        const passengerAge =
            Number(
                age
            );


        if (
            !Number.isInteger(
                passengerAge
            ) ||
            passengerAge <= 0 ||
            passengerAge > 120
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid passenger age"

            });

        }


        // ==========================================
        // CLEAN TRAIN NUMBER
        // ==========================================

        const cleanTrainNo =
            String(
                trainNo
            ).trim();


        // ==========================================
        // GET TRAIN FROM DATABASE
        // ==========================================

        const train =
            await trainService
                .getTrainByNumber(
                    cleanTrainNo
                );


        if (!train) {

            return res.status(404).json({

                success: false,

                message:
                    "Train not found"

            });

        }


        // ==========================================
        // GET REAL DATABASE FARE
        // ==========================================

        const bookingFare =
            Number(
                train.fare
            );


        if (
            !Number.isFinite(
                bookingFare
            ) ||
            bookingFare <= 0
        ) {

            return res.status(500).json({

                success: false,

                message:
                    "Invalid train fare in database"

            });

        }


        // ==========================================
        // CHECK DUPLICATE PAYMENT
        // ==========================================

        const existingBooking =
            await bookingService
                .getBookingByPaymentId(
                    razorpay_payment_id
                );


        if (existingBooking) {

            return res.status(409).json({

                success: false,

                message:
                    "This payment has already been used for a booking",

                pnr:
                    existingBooking.pnr

            });

        }


        // ==========================================
        // VALIDATE SIGNATURE FORMAT
        // ==========================================

        if (
            typeof razorpay_signature !==
            "string" ||
            !/^[a-fA-F0-9]{64}$/.test(
                razorpay_signature
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid payment signature"

            });

        }


        // ==========================================
        // GENERATE EXPECTED SIGNATURE
        // ==========================================

        const generatedSignature =
            crypto
                .createHmac(

                    "sha256",

                    razorpayKeySecret

                )
                .update(

                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id

                )
                .digest(
                    "hex"
                );


        const generatedBuffer =
            Buffer.from(
                generatedSignature,
                "hex"
            );


        const receivedBuffer =
            Buffer.from(
                razorpay_signature,
                "hex"
            );


        // ==========================================
        // CHECK SIGNATURE LENGTH
        // ==========================================

        if (
            generatedBuffer.length !==
            receivedBuffer.length
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid payment signature"

            });

        }


        // ==========================================
        // VERIFY SIGNATURE
        // ==========================================

        const signatureValid =
            crypto.timingSafeEqual(

                generatedBuffer,

                receivedBuffer

            );


        if (!signatureValid) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid payment signature"

            });

        }


        console.log(
            "Razorpay Payment Signature Verified"
        );


        // ==========================================
        // FETCH RAZORPAY ORDER
        // ==========================================

        const razorpayOrder =
            await razorpay.orders.fetch(
                razorpay_order_id
            );


        if (!razorpayOrder) {

            return res.status(400).json({

                success: false,

                message:
                    "Razorpay order not found"

            });

        }


        // ==========================================
        // VERIFY ORDER USER
        // ==========================================

        if (
            !razorpayOrder.notes ||
            !razorpayOrder.notes.user_id ||
            String(
                razorpayOrder
                    .notes
                    .user_id
            ) !==
            String(
                userId
            )
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Payment order does not belong to this user"

            });

        }


        // ==========================================
        // VERIFY ORDER TRAIN
        // ==========================================

        if (
            !razorpayOrder.notes.train_no ||
            String(
                razorpayOrder
                    .notes
                    .train_no
            ) !==
            String(
                train.train_number
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment order does not belong to this train"

            });

        }


        // ==========================================
        // EXPECTED DATABASE AMOUNT
        // ==========================================

        const expectedAmountInPaise =
            Math.round(
                bookingFare * 100
            );


        // ==========================================
        // VERIFY ORDER AMOUNT
        // ==========================================

        if (
            Number(
                razorpayOrder.amount
            ) !==
            expectedAmountInPaise
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment amount does not match current train fare"

            });

        }


        // ==========================================
        // FETCH RAZORPAY PAYMENT
        // ==========================================

        const payment =
            await razorpay.payments.fetch(
                razorpay_payment_id
            );


        if (!payment) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment not found"

            });

        }


        // ==========================================
        // PAYMENT MUST BE CAPTURED
        // ==========================================

        if (
            payment.status !==
            "captured"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment has not been captured"

            });

        }


        // ==========================================
        // VERIFY PAYMENT ORDER ID
        // ==========================================

        if (
            String(
                payment.order_id
            ) !==
            String(
                razorpay_order_id
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment does not belong to this order"

            });

        }


        // ==========================================
        // VERIFY PAYMENT AMOUNT
        // ==========================================

        if (
            Number(
                payment.amount
            ) !==
            expectedAmountInPaise
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment amount verification failed"

            });

        }


        // ==========================================
        // GENERATE UNIQUE PNR
        // ==========================================

        let pnr;

        let pnrExists =
            true;


        while (pnrExists) {

            pnr =
                generatePNR();


            pnrExists =
                await bookingService
                    .pnrExists(
                        pnr
                    );

        }


        // ==========================================
        // ALLOCATE SEAT
        // ==========================================

        const seat =
            await seatAllocator
                .allocateSeat(

                    train.train_number,

                    date

                );


        if (
            !seat ||
            !seat.coach ||
            !seat.seatNumber ||
            !seat.berthType
        ) {

            return res.status(500).json({

                success: false,

                message:
                    "Unable to allocate seat"

            });

        }


        console.log(
            "=========================================="
        );

        console.log(
            "Seat Allocated"
        );

        console.log(
            "Coach:",
            seat.coach
        );

        console.log(
            "Seat Number:",
            seat.seatNumber
        );

        console.log(
            "Berth Type:",
            seat.berthType
        );

        console.log(
            "=========================================="
        );


        // ==========================================
        // SAVE BOOKING
        // ==========================================

        const result =
            await bookingService
                .createBooking({

                    userId:
                        userId,

                    pnr:
                        pnr,

                    trainNo:
                        train.train_number,

                    trainName:
                        train.train_name,

                    from:
                        train.source,

                    to:
                        train.destination,

                    date:
                        date,

                    name:
                        String(
                            name
                        ).trim(),

                    age:
                        passengerAge,

                    gender:
                        String(
                            gender
                        ).trim(),

                    coach:
                        seat.coach,

                    seatNumber:
                        seat.seatNumber,

                    berthType:
                        seat.berthType,

                    fare:
                        bookingFare,

                    paymentId:
                        razorpay_payment_id

                });


        // ==========================================
        // SUCCESS LOG
        // ==========================================

        console.log(
            "=========================================="
        );

        console.log(
            "Booking Saved Successfully"
        );

        console.log(
            "Booking ID:",
            result.insertId
        );

        console.log(
            "User ID:",
            userId
        );

        console.log(
            "PNR:",
            pnr
        );

        console.log(
            "Train:",
            train.train_number
        );

        console.log(
            "Coach:",
            seat.coach
        );

        console.log(
            "Seat:",
            seat.seatNumber
        );

        console.log(
            "Berth:",
            seat.berthType
        );

        console.log(
            "Database Fare:",
            bookingFare
        );

        console.log(
            "=========================================="
        );


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Payment verified and booking saved successfully",

            pnr:
                pnr,

            bookingId:
                result.insertId,

            userId:
                userId,

            paymentId:
                razorpay_payment_id,

            orderId:
                razorpay_order_id,

            seat: {

                coach:
                    seat.coach,

                seatNumber:
                    seat.seatNumber,

                berthType:
                    seat.berthType

            }

        });


    }
    catch (error) {

        console.error(
            "Payment Verification / Booking Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Payment verification or booking failed",

            error:
                process.env.NODE_ENV ===
                "development"
                    ? error.message
                    : undefined

        });

    }

};


// ==========================================
// REFUND CANCELLED BOOKING
// ==========================================
// POST /api/payment/refund/:pnr
// ==========================================

exports.refundBooking = async (req, res) => {

    let pnr = null;
    let userId = null;


    try {

        // ==========================================
        // CHECK RAZORPAY CONFIGURATION
        // ==========================================

        if (!razorpay) {

            return res.status(500).json({

                success: false,

                message:
                    "Razorpay is not configured on the server"

            });

        }


        // ==========================================
        // GET LOGGED-IN USER
        // ==========================================

        userId =
            req.user.id;


        // ==========================================
        // GET PNR
        // ==========================================

        pnr =
            String(
                req.params.pnr || ""
            ).trim();


        console.log(
            "=========================================="
        );

        console.log(
            "Refund Request"
        );

        console.log(
            "User ID:",
            userId
        );

        console.log(
            "PNR:",
            pnr
        );

        console.log(
            "=========================================="
        );


        // ==========================================
        // VALIDATE PNR
        // ==========================================

        if (!pnr) {

            return res.status(400).json({

                success: false,

                message:
                    "PNR is required"

            });

        }


        // ==========================================
        // GET BOOKING
        // ==========================================

        const booking =
            await bookingService
                .getBookingByPNR(
                    pnr,
                    userId
                );


        if (!booking) {

            return res.status(404).json({

                success: false,

                message:
                    `Booking not found for PNR ${pnr}`

            });

        }


        // ==========================================
        // BOOKING MUST BE CANCELLED
        // ==========================================

        if (
            String(
                booking.booking_status
            ).toLowerCase() !==
            "cancelled"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Booking must be cancelled before requesting a refund"

            });

        }


        // ==========================================
        // CHECK PAYMENT ID
        // ==========================================

        if (!booking.payment_id) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment ID not found for this booking"

            });

        }


        // ==========================================
        // ALREADY REFUNDED
        // ==========================================

        if (
            String(
                booking.refund_status
            ).toLowerCase() ===
            "refunded" ||
            booking.refund_id
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "This booking has already been refunded",

                refundId:
                    booking.refund_id,

                refundAmount:
                    booking.refund_amount

            });

        }


        // ==========================================
        // ALREADY PROCESSING
        // ==========================================

        if (
            String(
                booking.refund_status
            ).toLowerCase() ===
            "processing"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Refund is already being processed"

            });

        }


        // ==========================================
        // REFUND AMOUNT
        // ==========================================

        const refundAmount =
            Number(
                booking.fare
            );


        if (
            !Number.isFinite(
                refundAmount
            ) ||
            refundAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid refund amount"

            });

        }


        const refundAmountInPaise =
            Math.round(
                refundAmount * 100
            );


        // ==========================================
        // FETCH PAYMENT
        // ==========================================

        const payment =
            await razorpay.payments.fetch(
                booking.payment_id
            );


        if (!payment) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment not found in Razorpay"

            });

        }


        // ==========================================
        // PAYMENT MUST BE CAPTURED
        // ==========================================

        if (
            payment.status !==
            "captured"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only captured payments can be refunded"

            });

        }


        // ==========================================
        // PREVENT REFUND ABOVE PAYMENT AMOUNT
        // ==========================================

        if (
            refundAmountInPaise >
            Number(
                payment.amount
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Refund amount cannot exceed payment amount"

            });

        }


        // ==========================================
        // MARK REFUND PROCESSING
        // ==========================================

        const processingResult =
            await bookingService
                .markRefundProcessing(
                    pnr,
                    userId
                );


        if (
            processingResult.affectedRows === 0
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Refund could not be started or has already been requested"

            });

        }


        // ==========================================
        // CREATE RAZORPAY REFUND
        // ==========================================

        const refund =
            await razorpay.payments.refund(

                booking.payment_id,

                {

                    amount:
                        refundAmountInPaise,

                    notes: {

                        pnr:
                            String(
                                pnr
                            ),

                        user_id:
                            String(
                                userId
                            )

                    },

                    receipt:
                        `REFUND_${pnr}`

                }

            );


        // ==========================================
        // CHECK REFUND
        // ==========================================

        if (
            !refund ||
            !refund.id
        ) {

            await bookingService
                .markRefundFailed(
                    pnr,
                    userId
                );


            return res.status(500).json({

                success: false,

                message:
                    "Refund could not be created"

            });

        }


        // ==========================================
        // SAVE REFUND IN MYSQL
        // ==========================================

        const saveResult =
            await bookingService
                .saveRefund(

                    pnr,

                    userId,

                    {

                        refundId:
                            refund.id,

                        refundAmount:
                            Number(
                                refund.amount
                            ) / 100

                    }

                );


        if (
            saveResult.affectedRows === 0
        ) {

            console.error(
                "Refund created in Razorpay but database update failed"
            );


            return res.status(500).json({

                success: false,

                message:
                    "Refund created, but database update failed",

                refundId:
                    refund.id

            });

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Refund initiated successfully",

            pnr:
                pnr,

            paymentId:
                booking.payment_id,

            refundId:
                refund.id,

            refundAmount:
                Number(
                    refund.amount
                ) / 100,

            refundStatus:
                "Refunded"

        });


    }
    catch (error) {

        console.error(
            "Refund Error:",
            error
        );


        // ==========================================
        // MARK REFUND FAILED
        // ==========================================

        if (
            pnr &&
            userId
        ) {

            try {

                await bookingService
                    .markRefundFailed(
                        pnr,
                        userId
                    );

            }
            catch (dbError) {

                console.error(
                    "Unable to mark refund as failed:",
                    dbError
                );

            }

        }


        const razorpayMessage =
            error?.error?.description ||
            error?.description ||
            error?.message;


        return res.status(500).json({

            success: false,

            message:
                razorpayMessage ||
                "Unable to process refund"

        });

    }

};