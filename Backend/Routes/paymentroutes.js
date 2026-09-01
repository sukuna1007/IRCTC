const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const paymentController =
    require("../controllers/paymentcontroller");


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authmiddleware");


// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================
// POST /api/payment/create-order
// ==========================================

router.post(

    "/create-order",

    authMiddleware,

    paymentController.createOrder

);


// ==========================================
// VERIFY PAYMENT + SAVE BOOKING
// ==========================================
// POST /api/payment/verify
// ==========================================

router.post(

    "/verify",

    authMiddleware,

    paymentController.verifyPayment

);


// ==========================================
// REFUND CANCELLED BOOKING
// ==========================================
// POST /api/payment/refund/:pnr
// ==========================================

router.post(

    "/refund/:pnr",

    authMiddleware,

    paymentController.refundBooking

);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;