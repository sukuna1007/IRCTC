const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userService =
    require("../services/userservice");


// ==========================================
// REGISTER
// ==========================================

exports.register = async (req, res) => {

    try {

        let {
            full_name,
            email,
            phone,
            password
        } = req.body;


        if (
            !full_name ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required"

            });

        }


        full_name =
            String(full_name).trim();

        email =
            String(email)
                .trim()
                .toLowerCase();

        phone =
            String(phone).trim();

        password =
            String(password);


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(email)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid email address"

            });

        }


        if (
            !/^[0-9]{10}$/.test(phone)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Phone number must contain exactly 10 digits"

            });

        }


        if (
            password.length < 6
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters"

            });

        }


        const existingEmailUser =
            await userService.findUserByEmail(
                email
            );


        if (existingEmailUser) {

            return res.status(409).json({

                success: false,

                message:
                    "Email already exists"

            });

        }


        const existingPhoneUser =
            await userService.findUserByPhone(
                phone
            );


        if (existingPhoneUser) {

            return res.status(409).json({

                success: false,

                message:
                    "Phone number already exists"

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const result =
            await userService.createUser({

                fullName:
                    full_name,

                email:
                    email,

                phone:
                    phone,

                password:
                    hashedPassword

            });


        return res.status(201).json({

            success: true,

            message:
                "User Registered Successfully",

            userId:
                result.insertId

        });

    }
    catch (error) {

        console.error(
            "Register Error:",
            error
        );


        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Email or phone number already exists"

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Registration failed",

            error:
                process.env.NODE_ENV ===
                "development"
                    ? error.message
                    : undefined

        });

    }

};


// ==========================================
// LOGIN
// ==========================================

exports.login = async (req, res) => {

    try {

        let {
            email,
            password
        } = req.body;


        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }


        email =
            String(email)
                .trim()
                .toLowerCase();

        password =
            String(password);


        const user =
            await userService.findUserByEmail(
                email
            );


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        const token =
            jwt.sign(

                {

                    id:
                        user.id,

                    email:
                        user.email,

                    role:
                        user.role || "user"

                },

                process.env.JWT_SECRET,

                {

                    expiresIn:
                        "1d"

                }

            );


        return res.status(200).json({

            success: true,

            message:
                "Login Successful",

            token:
                token,

            user: {

                id:
                    user.id,

                full_name:
                    user.full_name,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role || "user",

                profile_image:
                    user.profile_image || null

            }

        });

    }
    catch (error) {

        console.error(
            "Login Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to login",

            error:
                process.env.NODE_ENV ===
                "development"
                    ? error.message
                    : undefined

        });

    }

};


// ==========================================
// CHANGE PASSWORD
// ==========================================
// PUT /api/auth/change-password
// ==========================================

exports.changePassword = async (req, res) => {

    try {

        const userId =
            req.user.id;


        let {
            currentPassword,
            newPassword
        } = req.body;


        if (
            !currentPassword ||
            !newPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Current password and new password are required"

            });

        }


        currentPassword =
            String(currentPassword);

        newPassword =
            String(newPassword);


        if (
            newPassword.length < 6
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be at least 6 characters"

            });

        }


        if (
            currentPassword ===
            newPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be different from current password"

            });

        }


        const user =
            await userService.findUserById(
                userId
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        const passwordMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Current password is incorrect"

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        const result =
            await userService.updatePassword(
                userId,
                hashedPassword
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Password could not be updated"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Password changed successfully"

        });

    }
    catch (error) {

        console.error(
            "Change Password Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to change password",

            error:
                process.env.NODE_ENV ===
                "development"
                    ? error.message
                    : undefined

        });

    }

};


// ==========================================
// FORGOT PASSWORD
// ==========================================
// POST /api/auth/forgot-password
// ==========================================

exports.forgotPassword = async (req, res) => {

    try {

        let {
            email
        } = req.body;


        if (!email) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is required"

            });

        }


        email =
            String(email)
                .trim()
                .toLowerCase();


        const user =
            await userService.findUserByEmail(
                email
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "No account found with this email"

            });

        }


        const resetToken =
            jwt.sign(

                {

                    id:
                        user.id,

                    email:
                        user.email,

                    purpose:
                        "password-reset"

                },

                process.env.JWT_SECRET,

                {

                    expiresIn:
                        "15m"

                }

            );


        return res.status(200).json({

            success: true,

            message:
                "Email verified. You can now reset your password.",

            resetToken:
                resetToken

        });

    }
    catch (error) {

        console.error(
            "Forgot Password Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to process forgot password request"

        });

    }

};


// ==========================================
// RESET PASSWORD
// ==========================================
// PUT /api/auth/reset-password
// ==========================================

exports.resetPassword = async (req, res) => {

    try {

        const {
            resetToken,
            newPassword,
            confirmPassword
        } = req.body;


        if (
            !resetToken ||
            !newPassword ||
            !confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Reset token and password fields are required"

            });

        }


        if (
            String(newPassword).length < 6
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters"

            });

        }


        if (
            newPassword !==
            confirmPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New password and confirm password do not match"

            });

        }


        let decoded;


        try {

            decoded =
                jwt.verify(
                    resetToken,
                    process.env.JWT_SECRET
                );

        }
        catch (error) {

            return res.status(401).json({

                success: false,

                message:
                    "Reset link is invalid or has expired"

            });

        }


        if (
            decoded.purpose !==
            "password-reset"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid password reset token"

            });

        }


        const user =
            await userService.findUserById(
                decoded.id
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        const samePassword =
            await bcrypt.compare(
                String(newPassword),
                user.password
            );


        if (samePassword) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be different from your old password"

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                String(newPassword),
                10
            );


        const result =
            await userService.updatePassword(
                user.id,
                hashedPassword
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Password could not be reset"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Password reset successfully. Please login with your new password."

        });

    }
    catch (error) {

        console.error(
            "Reset Password Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to reset password"

        });

    }

};