const jwt = require("jsonwebtoken");


// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const authMiddleware = (req, res, next) => {

    try {

        // ==========================================
        // GET AUTHORIZATION HEADER
        // ==========================================

        const authHeader = req.headers.authorization;


        // ==========================================
        // CHECK AUTHORIZATION HEADER
        // ==========================================

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Authorization token is required"

            });

        }


        // ==========================================
        // EXPECTED FORMAT:
        // Authorization: Bearer TOKEN
        // ==========================================

        const parts = authHeader.split(" ");


        if (
            parts.length !== 2 ||
            parts[0].toLowerCase() !== "bearer"
        ) {

            return res.status(401).json({

                success: false,

                message: "Invalid authorization format"

            });

        }


        // ==========================================
        // GET TOKEN
        // ==========================================

        const token = parts[1];


        if (!token) {

            return res.status(401).json({

                success: false,

                message: "Authorization token is required"

            });

        }


        // ==========================================
        // CHECK JWT SECRET
        // ==========================================

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing from .env"
            );


            return res.status(500).json({

                success: false,

                message: "Server authentication configuration error"

            });

        }


        // ==========================================
        // VERIFY TOKEN
        // ==========================================

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );


        // ==========================================
        // CHECK USER ID INSIDE TOKEN
        // ==========================================

        if (!decoded.id) {

            return res.status(401).json({

                success: false,

                message: "Invalid token: User ID not found"

            });

        }


        // ==========================================
        // SAVE USER INFORMATION IN REQUEST
        // ==========================================

        req.user = {

            id: decoded.id,

            email: decoded.email

        };


        console.log(
            "Authenticated User ID:",
            req.user.id
        );


        // ==========================================
        // CONTINUE TO CONTROLLER
        // ==========================================

        next();


    }
    catch (error) {

        // ==========================================
        // TOKEN EXPIRED
        // ==========================================

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({

                success: false,

                message: "Token has expired. Please login again."

            });

        }


        // ==========================================
        // INVALID TOKEN
        // ==========================================

        if (error.name === "JsonWebTokenError") {

            return res.status(401).json({

                success: false,

                message: "Invalid authentication token"

            });

        }


        // ==========================================
        // OTHER AUTH ERROR
        // ==========================================

        console.error(
            "Auth Middleware Error:",
            error
        );


        return res.status(401).json({

            success: false,

            message: "Authentication failed"

        });

    }

};


// ==========================================
// EXPORT MIDDLEWARE
// ==========================================

module.exports = authMiddleware;