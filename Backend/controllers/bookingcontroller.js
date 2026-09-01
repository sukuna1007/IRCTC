const Razorpay = require("razorpay");

const bookingService =
    require("../services/bookingservice");


// ==========================================
// RAZORPAY
// ==========================================

const razorpay =
    new Razorpay({

        key_id:
            process.env.RAZORPAY_KEY_ID,

        key_secret:
            process.env.RAZORPAY_KEY_SECRET

    });


// ==========================================
// GET LOGGED-IN USER BOOKINGS
// ==========================================
// GET /api/bookings
// ==========================================

exports.getAllBookings = async (req, res) => {

    try {

        const userId =
            req.user.id;


        console.log(
            "Fetching bookings for User ID:",
            userId
        );


        const bookings =
            await bookingService
                .getBookingsByUserId(
                    userId
                );


        return res.status(200).json({

            success: true,

            bookings:
                bookings

        });

    }
    catch (error) {

        console.error(
            "Get Bookings Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch bookings"

        });

    }

};


// ==========================================
// GET BOOKING BY PNR
// ==========================================
// GET /api/bookings/pnr/:pnr
// ==========================================

exports.getBookingByPNR = async (req, res) => {

    try {

        const userId =
            req.user.id;


        const pnr =
            String(
                req.params.pnr || ""
            ).trim();


        if (!pnr) {

            return res.status(400).json({

                success: false,

                message:
                    "PNR is required"

            });

        }


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


        return res.status(200).json({

            success: true,

            booking:
                booking

        });

    }
    catch (error) {

        console.error(
            "Get Booking By PNR Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch booking",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};


// ==========================================
// CANCEL BOOKING + RAZORPAY REFUND
// ==========================================
// PUT /api/bookings/cancel/:pnr
// ==========================================

exports.cancelBooking = async (req, res) => {

    const userId =
        req.user.id;


    const pnr =
        String(
            req.params.pnr || ""
        ).trim();


    try {

        console.log(
            "=========================================="
        );

        console.log(
            "Cancel + Refund Request"
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
        // ALREADY CANCELLED
        // ==========================================

        if (
            String(
                booking.booking_status
            ).toLowerCase() ===
            "cancelled"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Booking is already cancelled"

            });

        }


        // ==========================================
        // VALIDATE PAYMENT
        // ==========================================

        if (!booking.payment_id) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment ID not found for this booking"

            });

        }


        if (
            String(
                booking.payment_status
            ).toLowerCase() !==
            "paid"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Only paid bookings can be refunded"

            });

        }


        // ==========================================
        // CHECK EXISTING REFUND
        // ==========================================

        if (booking.refund_id) {

            return res.status(400).json({

                success: false,

                message:
                    "Refund has already been initiated for this booking",

                refundId:
                    booking.refund_id,

                refundStatus:
                    booking.refund_status

            });

        }


        // ==========================================
        // FETCH RAZORPAY PAYMENT
        // ==========================================

        const payment =
            await razorpay.payments.fetch(
                booking.payment_id
            );


        console.log(
            "Razorpay Payment Status:",
            payment.status
        );


        // Razorpay refunds require captured payment

        if (
            payment.status !==
            "captured"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    `Payment cannot be refunded because Razorpay payment status is ${payment.status}`

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
            !refundAmount ||
            refundAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid refund amount"

            });

        }


        // Razorpay expects INR amount in paise

        const refundAmountInPaise =
            Math.round(
                refundAmount * 100
            );


        // ==========================================
        // CANCEL BOOKING FIRST
        // ==========================================

        const cancelResult =
            await bookingService.cancelBooking(
                pnr,
                userId
            );


        if (
            cancelResult.affectedRows === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Unable to cancel booking"

            });

        }


        // ==========================================
        // MARK REFUND PROCESSING
        // ==========================================

        await bookingService
            .markRefundProcessing(
                pnr,
                userId
            );


        try {

            // ==========================================
            // CREATE RAZORPAY REFUND
            // ==========================================

            const refund =
                await razorpay.payments.refund(

                    booking.payment_id,

                    {
                        amount:
                            refundAmountInPaise,

                        speed:
                            "normal",

                        notes: {

                            pnr:
                                String(pnr),

                            user_id:
                                String(userId),

                            reason:
                                "Ticket cancellation"

                        }

                    }

                );


            console.log(
                "Razorpay Refund Response:",
                refund
            );


            // ==========================================
            // SAVE REFUND
            // ==========================================

            await bookingService.saveRefund(

                pnr,

                userId,

                {
                    refundId:
                        refund.id,

                    refundAmount:
                        refundAmount

                }

            );


            // ==========================================
            // SUCCESS
            // ==========================================

            return res.status(200).json({

                success: true,

                message:
                    "Booking cancelled and refund initiated successfully",

                pnr:
                    pnr,

                bookingStatus:
                    "Cancelled",

                paymentStatus:
                    "Refunded",

                refund: {

                    id:
                        refund.id,

                    amount:
                        refundAmount,

                    razorpayAmount:
                        refund.amount,

                    status:
                        refund.status

                }

            });

        }
        catch (refundError) {

            console.error(
                "Razorpay Refund Error:",
                refundError
            );


            // ==========================================
            // MARK REFUND FAILED
            // ==========================================

            await bookingService
                .markRefundFailed(
                    pnr,
                    userId
                );


            return res.status(502).json({

                success: false,

                message:
                    refundError.error?.description ||
                    refundError.description ||
                    refundError.message ||
                    "Booking was cancelled but refund could not be processed",

                bookingStatus:
                    "Cancelled",

                refundStatus:
                    "Failed"

            });

        }

    }
    catch (error) {

        console.error(
            "Cancel Booking Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to cancel booking",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};