const db = require("../config/db");


// ==========================================
// ADMIN MIDDLEWARE
// ==========================================

const adminMiddleware = async (req, res, next) => {

    try {

        // ==========================================
        // USER MUST ALREADY BE AUTHENTICATED
        // ==========================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required"

            });

        }


        const userId =
            req.user.id;


        // ==========================================
        // GET USER ROLE FROM POSTGRESQL
        // ==========================================

        const result =
            await db.query(

                `SELECT
                    id,
                    role

                 FROM users

                 WHERE id = $1

                 LIMIT 1`,

                [userId]

            );


        // ==========================================
        // USER NOT FOUND
        // ==========================================

        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        const user =
            result.rows[0];


        // ==========================================
        // CHECK ADMIN ROLE
        // ==========================================

        if (
            user.role !== "admin"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Admin access required"

            });

        }


        // ==========================================
        // ADMIN VERIFIED
        // ==========================================

        req.admin = user;


        next();

    }
    catch (error) {

        console.error(
            "Admin Middleware Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to verify admin access"

        });

    }

};


module.exports = adminMiddleware;