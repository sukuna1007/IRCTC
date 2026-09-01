require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


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
// Examples:
//
// /css/style.css
// /css/search.css
// /css/live-train.css
//
// /javascript/script.js
// /javascript/search.js
// /javascript/livetrain.js
//
// /images/...
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

        res.sendFile(
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

        res.sendFile(
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

        res.sendFile(
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

        res.sendFile(
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

        res.sendFile(
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

        res.sendFile(
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

        res.sendFile(
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

        res.sendFile(
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

        res.sendFile(
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
// IMPORTANT:
// Actual filename = livetrain.html
//
// URL:
// http://localhost:5000/livetrain.html
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


        res.sendFile(
            liveTrainFile,
            error => {

                if (error) {

                    console.error(
                        "Live Train HTML Error:",
                        error
                    );


                    if (!res.headersSent) {

                        return res.status(
                            error.status || 500
                        ).json({

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
// OPTIONAL OLD LIVE-TRAIN URL REDIRECT
// ==========================================
// If old search.js still opens:
// /live-train.html
//
// Redirect it automatically to:
// /livetrain.html
// ==========================================

app.get(
    "/live-train.html",
    (req, res) => {

        const query =
            req.originalUrl.includes("?")
                ? req.originalUrl.substring(
                    req.originalUrl.indexOf("?")
                )
                : "";


        return res.redirect(
            `/livetrain.html${query}`
        );

    }
);


// ==========================================
// 404 ROUTE
// IMPORTANT: KEEP THIS LAST
// ==========================================

app.use(
    (req, res) => {

        return res.status(404).json({

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
    process.env.PORT || 5000;


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
            "=========================================="
        );

    }
);