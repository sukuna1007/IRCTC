const express = require("express");

const router = express.Router();

console.log("USER ROUTES FILE LOADED");


// ==========================================
// CONTROLLER
// ==========================================

const userController =
    require("../controllers/usercontroller");


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const authMiddleware =
    require("../middleware/authmiddleware");


// ==========================================
// UPLOAD MIDDLEWARE
// ==========================================

const upload =
    require("../middleware/uploadsmiddleware");


// ==========================================
// TEST ROUTE
// ==========================================
// GET /api/users/test
// ==========================================

router.get(
    "/test",
    (req, res) => {

        return res.status(200).json({

            success: true,

            message:
                "userroutes.js is working"

        });

    }
);


// ==========================================
// GET PROFILE
// ==========================================
// GET /api/users/profile
// ==========================================

router.get(
    "/profile",
    authMiddleware,
    userController.getProfile
);


// ==========================================
// UPDATE PROFILE
// ==========================================
// PUT /api/users/profile
// ==========================================

router.put(
    "/profile",
    authMiddleware,
    userController.updateProfile
);


// ==========================================
// UPDATE PROFILE IMAGE
// ==========================================
// PUT /api/users/profile-image
// ==========================================

router.put(
    "/profile-image",
    authMiddleware,
    upload.single("profileImage"),
    userController.updateProfileImage
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;