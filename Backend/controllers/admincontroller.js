const adminService =
    require("../services/adminservice");


// =====================================================
// ADMIN DASHBOARD
// =====================================================
// GET /api/admin/dashboard
// =====================================================

exports.getDashboard = async (req, res) => {

    try {

        const dashboard =
            await adminService
                .getDashboardData();


        return res.status(200).json({

            success: true,

            dashboard:
                dashboard

        });

    }
    catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load admin dashboard",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};


// =====================================================
// GET ALL USERS
// =====================================================
// GET /api/admin/users
// =====================================================

exports.getAllUsers = async (req, res) => {

    try {

        const users =
            await adminService
                .getAllUsers();


        return res.status(200).json({

            success: true,

            totalUsers:
                users.length,

            users:
                users

        });

    }
    catch (error) {

        console.error(
            "Get All Users Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch users",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};


// =====================================================
// GET ALL BOOKINGS
// =====================================================
// GET /api/admin/bookings
// =====================================================

exports.getAllBookings = async (req, res) => {

    try {

        const bookings =
            await adminService
                .getAllBookings();


        return res.status(200).json({

            success: true,

            totalBookings:
                bookings.length,

            bookings:
                bookings

        });

    }
    catch (error) {

        console.error(
            "Admin Get All Bookings Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch bookings",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};


// =====================================================
// GET ALL TRAINS
// =====================================================
// GET /api/admin/trains
// =====================================================

exports.getAllTrains = async (req, res) => {

    try {

        const trains =
            await adminService
                .getAllTrains();


        return res.status(200).json({

            success: true,

            totalTrains:
                trains.length,

            trains:
                trains

        });

    }
    catch (error) {

        console.error(
            "Admin Get All Trains Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch trains",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};


// =====================================================
// ADD NEW TRAIN
// =====================================================
// POST /api/admin/trains
// =====================================================

exports.addTrain = async (req, res) => {

    try {

        const {

            train_number,
            train_name,
            source,
            destination,
            departure_time,
            arrival_time,
            duration,
            available_seats,
            fare

        } = req.body;


        // =====================================================
        // VALIDATE REQUIRED FIELDS
        // =====================================================

        if (
            !train_number ||
            !train_name ||
            !source ||
            !destination ||
            !departure_time ||
            !arrival_time ||
            !duration ||
            available_seats === undefined ||
            fare === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All train fields are required"

            });

        }


        const cleanTrainNumber =
            String(
                train_number
            ).trim();


        const cleanTrainName =
            String(
                train_name
            ).trim();


        const cleanSource =
            String(
                source
            ).trim();


        const cleanDestination =
            String(
                destination
            ).trim();


        const cleanDepartureTime =
            String(
                departure_time
            ).trim();


        const cleanArrivalTime =
            String(
                arrival_time
            ).trim();


        const cleanDuration =
            String(
                duration
            ).trim();


        // =====================================================
        // VALIDATE SEATS
        // =====================================================

        if (
            isNaN(
                available_seats
            ) ||
            Number(
                available_seats
            ) < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Available seats must be a valid number"

            });

        }


        // =====================================================
        // VALIDATE FARE
        // =====================================================

        if (
            isNaN(
                fare
            ) ||
            Number(
                fare
            ) <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Fare must be greater than 0"

            });

        }


        // =====================================================
        // VALIDATE ROUTE
        // =====================================================

        if (
            cleanSource.toLowerCase() ===
            cleanDestination.toLowerCase()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Source and destination cannot be the same"

            });

        }


        // =====================================================
        // CHECK DUPLICATE TRAIN NUMBER
        // =====================================================

        const duplicateTrain =
            await adminService
                .findDuplicateTrainNumber(
                    cleanTrainNumber
                );


        if (duplicateTrain) {

            return res.status(409).json({

                success: false,

                message:
                    "Train number already exists"

            });

        }


        // =====================================================
        // CREATE TRAIN
        // =====================================================

        const result =
            await adminService
                .addTrain({

                    trainNumber:
                        cleanTrainNumber,

                    trainName:
                        cleanTrainName,

                    source:
                        cleanSource,

                    destination:
                        cleanDestination,

                    departureTime:
                        cleanDepartureTime,

                    arrivalTime:
                        cleanArrivalTime,

                    duration:
                        cleanDuration,

                    availableSeats:
                        Number(
                            available_seats
                        ),

                    fare:
                        Number(
                            fare
                        )

                });


        // =====================================================
        // GET CREATED TRAIN
        // =====================================================

        const train =
            await adminService
                .getTrainById(
                    result.insertId
                );


        return res.status(201).json({

            success: true,

            message:
                "Train added successfully",

            train:
                train

        });

    }
    catch (error) {

        console.error(
            "Admin Add Train Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to add train",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};


// =====================================================
// UPDATE TRAIN
// =====================================================
// PUT /api/admin/trains/:id
// =====================================================

exports.updateTrain = async (req, res) => {

    try {

        const trainId =
            Number(
                req.params.id
            );


        const {

            train_number,
            train_name,
            source,
            destination,
            departure_time,
            arrival_time,
            duration,
            available_seats,
            fare

        } = req.body;


        // =====================================================
        // VALIDATE TRAIN ID
        // =====================================================

        if (
            !trainId ||
            trainId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid train ID"

            });

        }


        // =====================================================
        // VALIDATE REQUIRED FIELDS
        // =====================================================

        if (
            !train_number ||
            !train_name ||
            !source ||
            !destination ||
            !departure_time ||
            !arrival_time ||
            !duration ||
            available_seats === undefined ||
            fare === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All train fields are required"

            });

        }


        const cleanTrainNumber =
            String(
                train_number
            ).trim();


        const cleanTrainName =
            String(
                train_name
            ).trim();


        const cleanSource =
            String(
                source
            ).trim();


        const cleanDestination =
            String(
                destination
            ).trim();


        const cleanDepartureTime =
            String(
                departure_time
            ).trim();


        const cleanArrivalTime =
            String(
                arrival_time
            ).trim();


        const cleanDuration =
            String(
                duration
            ).trim();


        // =====================================================
        // VALIDATE SEATS
        // =====================================================

        if (
            isNaN(
                available_seats
            ) ||
            Number(
                available_seats
            ) < 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Available seats must be a valid number"

            });

        }


        // =====================================================
        // VALIDATE FARE
        // =====================================================

        if (
            isNaN(
                fare
            ) ||
            Number(
                fare
            ) <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Fare must be greater than 0"

            });

        }


        // =====================================================
        // VALIDATE ROUTE
        // =====================================================

        if (
            cleanSource.toLowerCase() ===
            cleanDestination.toLowerCase()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Source and destination cannot be the same"

            });

        }


        // =====================================================
        // CHECK TRAIN EXISTS
        // =====================================================

        const existingTrain =
            await adminService
                .getTrainById(
                    trainId
                );


        if (!existingTrain) {

            return res.status(404).json({

                success: false,

                message:
                    "Train not found"

            });

        }


        // =====================================================
        // CHECK DUPLICATE TRAIN NUMBER
        // =====================================================

        const duplicateTrain =
            await adminService
                .findDuplicateTrainNumber(

                    cleanTrainNumber,

                    trainId

                );


        if (duplicateTrain) {

            return res.status(409).json({

                success: false,

                message:
                    "Train number already exists"

            });

        }


        // =====================================================
        // UPDATE TRAIN
        // =====================================================

        const result =
            await adminService
                .updateTrain(

                    trainId,

                    {

                        trainNumber:
                            cleanTrainNumber,

                        trainName:
                            cleanTrainName,

                        source:
                            cleanSource,

                        destination:
                            cleanDestination,

                        departureTime:
                            cleanDepartureTime,

                        arrivalTime:
                            cleanArrivalTime,

                        duration:
                            cleanDuration,

                        availableSeats:
                            Number(
                                available_seats
                            ),

                        fare:
                            Number(
                                fare
                            )

                    }

                );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Train not found"

            });

        }


        // =====================================================
        // GET UPDATED TRAIN
        // =====================================================

        const updatedTrain =
            await adminService
                .getTrainById(
                    trainId
                );


        return res.status(200).json({

            success: true,

            message:
                "Train updated successfully",

            train:
                updatedTrain

        });

    }
    catch (error) {

        console.error(
            "Admin Update Train Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update train",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};


// =====================================================
// DELETE TRAIN
// =====================================================
// DELETE /api/admin/trains/:id
// =====================================================

exports.deleteTrain = async (req, res) => {

    try {

        const trainId =
            Number(
                req.params.id
            );


        // =====================================================
        // VALIDATE ID
        // =====================================================

        if (
            !trainId ||
            trainId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid train ID"

            });

        }


        // =====================================================
        // GET TRAIN
        // =====================================================

        const train =
            await adminService
                .getTrainById(
                    trainId
                );


        if (!train) {

            return res.status(404).json({

                success: false,

                message:
                    "Train not found"

            });

        }


        // =====================================================
        // DELETE TRAIN
        // =====================================================

        const result =
            await adminService
                .deleteTrain(
                    trainId
                );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Train not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Train deleted successfully",

            deletedTrain: {

                id:
                    train.id,

                train_number:
                    train.train_number,

                train_name:
                    train.train_name

            }

        });

    }
    catch (error) {

        console.error(
            "Admin Delete Train Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to delete train",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};


// =====================================================
// UPDATE USER ROLE
// =====================================================
// PUT /api/admin/users/:id/role
// =====================================================

exports.updateUserRole = async (req, res) => {

    try {

        const userId =
            Number(
                req.params.id
            );


        const {
            role
        } = req.body;


        // =====================================================
        // VALIDATE USER ID
        // =====================================================

        if (
            !userId ||
            userId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user ID"

            });

        }


        // =====================================================
        // VALIDATE ROLE
        // =====================================================

        if (
            ![
                "user",
                "admin"
            ].includes(
                role
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Role must be user or admin"

            });

        }


        // =====================================================
        // GET USER
        // =====================================================

        const user =
            await adminService
                .getUserById(
                    userId
                );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        // =====================================================
        // PREVENT ADMIN REMOVING OWN ROLE
        // =====================================================

        if (
            Number(
                req.user.id
            ) ===
            userId &&
            role !== "admin"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You cannot remove your own admin role"

            });

        }


        // =====================================================
        // UPDATE ROLE
        // =====================================================

        const result =
            await adminService
                .updateUserRole(
                    userId,
                    role
                );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "User role updated successfully",

            user: {

                id:
                    user.id,

                full_name:
                    user.full_name,

                email:
                    user.email,

                role:
                    role

            }

        });

    }
    catch (error) {

        console.error(
            "Update User Role Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update user role",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};


// =====================================================
// DELETE USER
// =====================================================
// DELETE /api/admin/users/:id
// =====================================================

exports.deleteUser = async (req, res) => {

    try {

        const userId =
            Number(
                req.params.id
            );


        // =====================================================
        // VALIDATE USER ID
        // =====================================================

        if (
            !userId ||
            userId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user ID"

            });

        }


        // =====================================================
        // PREVENT ADMIN DELETING OWN ACCOUNT
        // =====================================================

        if (
            Number(
                req.user.id
            ) ===
            userId
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You cannot delete your own admin account"

            });

        }


        // =====================================================
        // GET USER
        // =====================================================

        const user =
            await adminService
                .getUserById(
                    userId
                );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        // =====================================================
        // DELETE USER
        // =====================================================

        const result =
            await adminService
                .deleteUser(
                    userId
                );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "User deleted successfully",

            deletedUser: {

                id:
                    user.id,

                full_name:
                    user.full_name,

                email:
                    user.email

            }

        });

    }
    catch (error) {

        console.error(
            "Delete User Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to delete user",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};


// =====================================================
// UPDATE BOOKING STATUS
// =====================================================
// PUT /api/admin/bookings/:id/status
// =====================================================

exports.updateBookingStatus = async (req, res) => {

    try {

        const bookingId =
            Number(
                req.params.id
            );


        const {
            booking_status
        } = req.body;


        // =====================================================
        // VALIDATE BOOKING ID
        // =====================================================

        if (
            !bookingId ||
            bookingId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid booking ID"

            });

        }


        // =====================================================
        // VALIDATE STATUS
        // =====================================================

        const allowedStatuses = [

            "Confirmed",
            "Cancelled"

        ];


        if (
            !allowedStatuses.includes(
                booking_status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Booking status must be Confirmed or Cancelled"

            });

        }


        // =====================================================
        // GET BOOKING
        // =====================================================

        const booking =
            await adminService
                .getBookingById(
                    bookingId
                );


        if (!booking) {

            return res.status(404).json({

                success: false,

                message:
                    "Booking not found"

            });

        }


        // =====================================================
        // UPDATE BOOKING STATUS
        // =====================================================

        const result =
            await adminService
                .updateBookingStatus(

                    bookingId,

                    booking_status

                );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Booking not found"

            });

        }


        // =====================================================
        // GET UPDATED BOOKING
        // =====================================================

        const updatedBooking =
            await adminService
                .getBookingById(
                    bookingId
                );


        return res.status(200).json({

            success: true,

            message:
                "Booking status updated successfully",

            booking:
                updatedBooking

        });

    }
    catch (error) {

        console.error(
            "Update Booking Status Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update booking status",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};