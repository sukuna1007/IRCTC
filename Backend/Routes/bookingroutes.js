const express = require("express");

const router = express.Router();


// ==========================================
// BOOKING CONTROLLER
// ==========================================

const bookingController =
    require("../controllers/bookingcontroller");


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authmiddleware");


// ==========================================
// GET LOGGED-IN USER BOOKINGS
// GET /api/bookings
// ==========================================

router.get(
    "/",
    authMiddleware,
    bookingController.getAllBookings
);


// ==========================================
// GET BOOKING BY PNR
// GET /api/bookings/pnr/:pnr
// ==========================================

router.get(
    "/pnr/:pnr",
    authMiddleware,
    bookingController.getBookingByPNR
);


// ==========================================
// CANCEL BOOKING
// PUT /api/bookings/cancel/:pnr
// ==========================================

router.put(
    "/cancel/:pnr",
    authMiddleware,
    bookingController.cancelBooking
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;