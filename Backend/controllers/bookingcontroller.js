const Razorpay = require("razorpay");

const bookingService =
    require("../services/bookingservice");


// ==========================================
// RAZORPAY CONFIGURATION
// ==========================================

const razorpayKeyId =
    process.env.RAZORPAY_KEY_ID;

const razorpayKeySecret =
    process.env.RAZORPAY_KEY_SECRET;


let razorpay = null;


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
        "Booking Razorpay configured successfully"
    );

}
else {

    console.error(
        "Booking Razorpay environment variables are missing"
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
// GET LOGGED-IN USER BOOKINGS
// ==========================================
// GET /api/bookings
// ==========================================

exports.getAllBookings = async (
    req,
    res
) => {

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


        return res
            .status(200)
            .json({

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


        return res
            .status(500)
            .json({

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

exports.getBookingByPNR = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.id;


        const pnr =
            String(
                req.params.pnr ||
                ""
            ).trim();


        // ==========================================
        // VALIDATE PNR
        // ==========================================

        if (!pnr) {

            return res
                .status(400)
                .json({

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


        // ==========================================
        // NOT FOUND
        // ==========================================

        if (!booking) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        `Booking not found for PNR ${pnr}`

                });

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        return res
            .status(200)
            .json({

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


        return res
            .status(500)
            .json({

                success: false,

                message:
                    "Unable to fetch booking",

                error:
                    process.env.NODE_ENV ===
                    "development"
                        ?
                        error.message
                        :
                        undefined

            });

    }

};


// ==========================================
// CANCEL BOOKING + RAZORPAY REFUND
// ==========================================
// PUT /api/bookings/cancel/:pnr
// ==========================================

exports.cancelBooking = async (
    req,
    res
) => {

    const userId =
        req.user.id;


    const pnr =
        String(
            req.params.pnr ||
            ""
        ).trim();


    // ==========================================
    // CHECK RAZORPAY CONFIGURATION
    // ==========================================

    if (!razorpay) {

        console.error(
            "Cancel Booking Error: Razorpay is not configured"
        );


        return res
            .status(500)
            .json({

                success: false,

                message:
                    "Razorpay is not configured on the server"

            });

    }


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

            return res
                .status(400)
                .json({

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

            return res
                .status(404)
                .json({

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
                booking.booking_status ||
                ""
            ).toLowerCase() ===
            "cancelled"
        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "Booking is already cancelled"

                });

        }


        // ==========================================
        // VALIDATE PAYMENT ID
        // ==========================================

        if (
            !booking.payment_id
        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "Payment ID not found for this booking"

                });

        }


        // ==========================================
        // VALIDATE PAYMENT STATUS
        // ==========================================

        if (
            String(
                booking.payment_status ||
                ""
            ).toLowerCase() !==
            "paid"
        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "Only paid bookings can be refunded"

                });

        }


        // ==========================================
        // CHECK EXISTING REFUND
        // ==========================================

        if (
            booking.refund_id
        ) {

            return res
                .status(400)
                .json({

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
            await razorpay
                .payments
                .fetch(
                    booking.payment_id
                );


        console.log(
            "Razorpay Payment Status:",
            payment.status
        );


        // ==========================================
        // PAYMENT MUST BE CAPTURED
        // ==========================================

        if (
            payment.status !==
            "captured"
        ) {

            return res
                .status(400)
                .json({

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
            !Number.isFinite(
                refundAmount
            ) ||
            refundAmount <= 0
        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "Invalid refund amount"

                });

        }


        // Razorpay uses paise

        const refundAmountInPaise =
            Math.round(
                refundAmount *
                100
            );


        // ==========================================
        // CANCEL BOOKING
        // ==========================================

        const cancelResult =
            await bookingService
                .cancelBooking(
                    pnr,
                    userId
                );


        if (
            !cancelResult ||
            cancelResult.affectedRows ===
            0
        ) {

            return res
                .status(400)
                .json({

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
                await razorpay
                    .payments
                    .refund(

                        booking.payment_id,

                        {

                            amount:
                                refundAmountInPaise,

                            speed:
                                "normal",

                            notes: {

                                pnr:
                                    String(
                                        pnr
                                    ),

                                user_id:
                                    String(
                                        userId
                                    ),

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
            // SAVE REFUND DETAILS
            // ==========================================

            await bookingService
                .saveRefund(

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

            return res
                .status(200)
                .json({

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
        catch (
            refundError
        ) {

            console.error(
                "Razorpay Refund Error:",
                refundError
            );


            // ==========================================
            // MARK REFUND FAILED
            // ==========================================

            try {

                await bookingService
                    .markRefundFailed(
                        pnr,
                        userId
                    );

            }
            catch (
                markFailedError
            ) {

                console.error(
                    "Mark Refund Failed Error:",
                    markFailedError
                );

            }


            return res
                .status(502)
                .json({

                    success: false,

                    message:
                        refundError
                            ?.error
                            ?.description ||

                        refundError
                            ?.description ||

                        refundError
                            ?.message ||

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


        return res
            .status(500)
            .json({

                success: false,

                message:
                    "Unable to cancel booking",

                error:
                    process.env.NODE_ENV ===
                    "development"
                        ?
                        error.message
                        :
                        undefined

            });

    }

};