const express = require("express");

const router = express.Router();


// ==========================================
// AUTH CONTROLLER
// ==========================================

const authController =
    require("../controllers/authcontroller");


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authmiddleware");


// ==========================================
// REGISTER
// ==========================================
// POST /api/auth/register
// ==========================================

router.post(
    "/register",
    authController.register
);


// ==========================================
// LOGIN
// ==========================================
// POST /api/auth/login
// ==========================================

router.post(
    "/login",
    authController.login
);


// ==========================================
// CHANGE PASSWORD
// ==========================================
// PUT /api/auth/change-password
// Protected route
// ==========================================

router.put(
    "/change-password",
    authMiddleware,
    authController.changePassword
);


module.exports = router;