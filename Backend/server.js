const path = require("path");


// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

require("dotenv").config({
    path: path.join(
        __dirname,
        ".env"
    )
});


const express = require("express");
const cors = require("cors");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================
// DATABASE
// ==========================================

require("./config/db");


// ==========================================
// ROUTES
// ==========================================

const authRoutes =
    require("./Routes/authroutes");

const trainRoutes =
    require("./Routes/trainroutes");

const paymentRoutes =
    require("./Routes/paymentroutes");

const bookingRoutes =
    require("./Routes/bookingroutes");

const userRoutes =
    require("./Routes/userroutes");

const adminRoutes =
    require("./Routes/adminroutes");


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/trains",
    trainRoutes
);

app.use(
    "/api/payment",
    paymentRoutes
);

app.use(
    "/api/bookings",
    bookingRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);


// ==========================================
// UPLOADS
// ==========================================

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


// ==========================================
// FRONTEND PATHS
// ==========================================

const frontendPath =
    path.join(
        __dirname,
        "../Frontend"
    );

const htmlPath =
    path.join(
        frontendPath,
        "html"
    );


// ==========================================
// DEBUG PATHS
// ==========================================

console.log(
    "Backend Directory:",
    __dirname
);

console.log(
    "Frontend Directory:",
    frontendPath
);

console.log(
    "HTML Directory:",
    htmlPath
);


// ==========================================
// SERVE FRONTEND ASSETS
// ==========================================

app.use(
    express.static(
        frontendPath
    )
);


// ==========================================
// SERVE HTML FILES
// ==========================================

app.use(
    express.static(
        htmlPath
    )
);


// ==========================================
// HOME PAGE
// ==========================================

app.get(
    "/",
    (req, res) => {

        return res.sendFile(
            path.join(
                htmlPath,
                "index.html"
            )
        );

    }
);


// ==========================================
// INDEX PAGE
// ==========================================

app.get(
    "/index.html",
    (req, res) => {

        return res.sendFile(
            path.join(
                htmlPath,
                "index.html"
            )
        );

    }
);


// ==========================================
// ADMIN PAGE
// ==========================================

app.get(
    "/admin.html",
    (req, res) => {

        return res.sendFile(
            path.join(
                htmlPath,
                "admin.html"
            )
        );

    }
);


// ==========================================
// SEARCH PAGE
// ==========================================

app.get(
    "/search.html",
    (req, res) => {

        return res.sendFile(
            path.join(
                htmlPath,
                "search.html"
            )
        );

    }
);


// ==========================================
// BOOKING PAGE
// ==========================================

app.get(
    "/booking.html",
    (req, res) => {

        return res.sendFile(
            path.join(
                htmlPath,
                "booking.html"
            )
        );

    }
);


// ==========================================
// MY BOOKINGS PAGE
// ==========================================

app.get(
    "/mybooking.html",
    (req, res) => {

        return res.sendFile(
            path.join(
                htmlPath,
                "mybooking.html"
            )
        );

    }
);


// ==========================================
// PROFILE PAGE
// ==========================================

app.get(
    "/profile.html",
    (req, res) => {

        return res.sendFile(
            path.join(
                htmlPath,
                "profile.html"
            )
        );

    }
);


// ==========================================
// SUCCESS PAGE
// ==========================================

app.get(
    "/success.html",
    (req, res) => {

        return res.sendFile(
            path.join(
                htmlPath,
                "success.html"
            )
        );

    }
);


// ==========================================
// TICKET PAGE
// ==========================================

app.get(
    "/ticket.html",
    (req, res) => {

        return res.sendFile(
            path.join(
                htmlPath,
                "ticket.html"
            )
        );

    }
);


// ==========================================
// LIVE TRAIN PAGE
// ==========================================

app.get(
    "/livetrain.html",
    (req, res) => {

        const liveTrainFile =
            path.join(
                htmlPath,
                "livetrain.html"
            );


        console.log(
            "Opening Live Train Page:",
            liveTrainFile
        );


        return res.sendFile(
            liveTrainFile,
            error => {

                if (error) {

                    console.error(
                        "Live Train HTML Error:",
                        error
                    );


                    if (
                        !res.headersSent
                    ) {

                        return res
                            .status(
                                error.status ||
                                500
                            )
                            .json({

                                success: false,

                                message:
                                    "Unable to open livetrain.html",

                                error:
                                    error.message

                            });

                    }

                }

            }
        );

    }
);


// ==========================================
// OLD LIVE TRAIN URL REDIRECT
// ==========================================

app.get(
    "/live-train.html",
    (req, res) => {

        const query =
            req.originalUrl.includes("?")
                ?
                req.originalUrl.substring(
                    req.originalUrl.indexOf("?")
                )
                :
                "";


        return res.redirect(
            `/livetrain.html${query}`
        );

    }
);


// ==========================================
// API HEALTH CHECK
// ==========================================

app.get(
    "/api",
    (req, res) => {

        return res
            .status(200)
            .json({

                success: true,

                message:
                    "IRCTC API is running"

            });

    }
);


// ==========================================
// 404 ROUTE
// KEEP THIS LAST
// ==========================================

app.use(
    (req, res) => {

        return res
            .status(404)
            .json({

                success: false,

                message:
                    `Route not found: ${req.method} ${req.originalUrl}`

            });

    }
);


// ==========================================
// SERVER
// ==========================================

const PORT =
    process.env.PORT ||
    5000;


// ==========================================
// LOCAL DEVELOPMENT ONLY
// ==========================================

if (
    require.main === module
) {

    app.listen(
        PORT,
        () => {

            console.log(
                "=========================================="
            );

            console.log(
                `Server running on port ${PORT}`
            );

            console.log(
                `Website: http://localhost:${PORT}`
            );

            console.log(
                `Admin: http://localhost:${PORT}/admin.html`
            );

            console.log(
                `Live Train: http://localhost:${PORT}/livetrain.html`
            );

            console.log(
                `API: http://localhost:${PORT}/api`
            );

            console.log(
                "=========================================="
            );

        }
    );

}


// ==========================================
// EXPORT APP FOR VERCEL
// ==========================================

module.exports = app;