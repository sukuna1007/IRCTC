const express = require("express");

const router = express.Router();

const adminController =
    require("../controllers/admincontroller");

const authMiddleware =
    require("../middleware/authmiddleware");

const adminMiddleware =
    require("../middleware/adminmiddleware");


// =====================================================
// ADMIN DASHBOARD
// =====================================================
// GET /api/admin/dashboard
// =====================================================

router.get(

    "/dashboard",

    authMiddleware,

    adminMiddleware,

    adminController.getDashboard

);


// =====================================================
// GET ALL USERS
// =====================================================
// GET /api/admin/users
// =====================================================

router.get(

    "/users",

    authMiddleware,

    adminMiddleware,

    adminController.getAllUsers

);


// =====================================================
// GET ALL BOOKINGS
// =====================================================
// GET /api/admin/bookings
// =====================================================

router.get(

    "/bookings",

    authMiddleware,

    adminMiddleware,

    adminController.getAllBookings

);


// =====================================================
// GET ALL TRAINS
// =====================================================
// GET /api/admin/trains
// =====================================================

router.get(

    "/trains",

    authMiddleware,

    adminMiddleware,

    adminController.getAllTrains

);


// =====================================================
// ADD NEW TRAIN
// =====================================================
// POST /api/admin/trains
// =====================================================

router.post(

    "/trains",

    authMiddleware,

    adminMiddleware,

    adminController.addTrain

);


// =====================================================
// UPDATE TRAIN
// =====================================================
// PUT /api/admin/trains/:id
// =====================================================

router.put(

    "/trains/:id",

    authMiddleware,

    adminMiddleware,

    adminController.updateTrain

);


// =====================================================
// DELETE TRAIN
// =====================================================
// DELETE /api/admin/trains/:id
// =====================================================

router.delete(

    "/trains/:id",

    authMiddleware,

    adminMiddleware,

    adminController.deleteTrain

);


// =====================================================
// UPDATE USER ROLE
// =====================================================
// PUT /api/admin/users/:id/role
// =====================================================

router.put(

    "/users/:id/role",

    authMiddleware,

    adminMiddleware,

    adminController.updateUserRole

);


// =====================================================
// DELETE USER
// =====================================================
// DELETE /api/admin/users/:id
// =====================================================

router.delete(

    "/users/:id",

    authMiddleware,

    adminMiddleware,

    adminController.deleteUser

);


// =====================================================
// UPDATE BOOKING STATUS
// =====================================================
// PUT /api/admin/bookings/:id/status
// =====================================================

router.put(

    "/bookings/:id/status",

    authMiddleware,

    adminMiddleware,

    adminController.updateBookingStatus

);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;