const userService =
    require("../services/userservice");

const cloudinary =
    require("cloudinary").v2;

const streamifier =
    require("streamifier");


// ==========================================
// CLOUDINARY CONFIGURATION
// ==========================================

cloudinary.config({

    cloud_name:
        process.env.CLOUDINARY_CLOUD_NAME,

    api_key:
        process.env.CLOUDINARY_API_KEY,

    api_secret:
        process.env.CLOUDINARY_API_SECRET

});


// ==========================================
// UPLOAD IMAGE TO CLOUDINARY
// ==========================================

function uploadToCloudinary(
    fileBuffer,
    userId
) {

    return new Promise(
        (resolve, reject) => {

            const uploadStream =
                cloudinary.uploader.upload_stream(

                    {

                        folder:
                            "irctc/profile-images",

                        public_id:
                            `profile-${userId}-${Date.now()}`,

                        resource_type:
                            "image",

                        overwrite:
                            true

                    },

                    (error, result) => {

                        if (error) {

                            return reject(
                                error
                            );

                        }

                        return resolve(
                            result
                        );

                    }

                );


            streamifier
                .createReadStream(
                    fileBuffer
                )
                .pipe(
                    uploadStream
                );

        }
    );

}


// ==========================================
// GET LOGGED-IN USER PROFILE
// ==========================================
// GET /api/users/profile
// ==========================================

exports.getProfile = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.id;


        // ==========================================
        // GET USER FROM SERVICE
        // ==========================================

        const user =
            await userService.getUserProfile(
                userId
            );


        if (!user) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        "User not found"

                });

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        return res
            .status(200)
            .json({

                success: true,

                user:
                    user

            });

    }
    catch (error) {

        console.error(
            "Get Profile Error:",
            error
        );


        return res
            .status(500)
            .json({

                success: false,

                message:
                    "Unable to fetch user profile",

                error:
                    process.env.NODE_ENV ===
                    "development"
                        ? error.message
                        : undefined

            });

    }

};


// ==========================================
// UPDATE LOGGED-IN USER PROFILE
// ==========================================
// PUT /api/users/profile
// ==========================================

exports.updateProfile = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.id;


        let {
            full_name,
            phone,
            address,
            dob
        } = req.body;


        // ==========================================
        // VALIDATE REQUIRED FIELDS
        // ==========================================

        if (
            !full_name ||
            !phone
        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "Full name and phone are required"

                });

        }


        // ==========================================
        // CLEAN VALUES
        // ==========================================

        full_name =
            String(
                full_name
            ).trim();


        phone =
            String(
                phone
            ).trim();


        address =
            address
                ? String(
                    address
                ).trim()
                : null;


        // ==========================================
        // VALIDATE NAME
        // ==========================================

        if (!full_name) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "Full name is required"

                });

        }


        // ==========================================
        // VALIDATE PHONE
        // ==========================================

        if (
            !/^[0-9]{10}$/.test(
                phone
            )
        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "Phone number must contain exactly 10 digits"

                });

        }


        // ==========================================
        // VALIDATE DOB
        // ==========================================

        let cleanDob =
            null;


        if (dob) {

            const dobString =
                String(
                    dob
                ).trim();


            const validDateFormat =
                /^\d{4}-\d{2}-\d{2}$/.test(
                    dobString
                );


            if (!validDateFormat) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Date of birth must be in YYYY-MM-DD format"

                    });

            }


            const parsedDate =
                new Date(
                    `${dobString}T00:00:00`
                );


            if (
                isNaN(
                    parsedDate.getTime()
                )
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Invalid date of birth"

                    });

            }


            // ==========================================
            // PREVENT FUTURE DOB
            // ==========================================

            const today =
                new Date();


            if (
                parsedDate >
                today
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Date of birth cannot be in the future"

                    });

            }


            cleanDob =
                dobString;

        }


        // ==========================================
        // GET CURRENT USER
        // ==========================================

        const currentUser =
            await userService.findUserById(
                userId
            );


        if (!currentUser) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        "User not found"

                });

        }


        // ==========================================
        // CHECK PHONE DUPLICATE
        // ==========================================

        const phoneUser =
            await userService.findUserByPhone(
                phone
            );


        if (
            phoneUser &&
            Number(
                phoneUser.id
            ) !==
            Number(
                userId
            )
        ) {

            return res
                .status(409)
                .json({

                    success: false,

                    message:
                        "Phone number already exists"

                });

        }


        // ==========================================
        // UPDATE PROFILE USING SERVICE
        // ==========================================

        const result =
            await userService.updateUserProfile(

                userId,

                {

                    fullName:
                        full_name,

                    phone:
                        phone,

                    address:
                        address,

                    dob:
                        cleanDob,

                    profileImage:
                        currentUser.profile_image

                }

            );


        if (
            result.affectedRows === 0
        ) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        "User not found"

                });

        }


        // ==========================================
        // GET UPDATED PROFILE
        // ==========================================

        const updatedUser =
            await userService.getUserProfile(
                userId
            );


        if (!updatedUser) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        "Updated user could not be found"

                });

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        return res
            .status(200)
            .json({

                success: true,

                message:
                    "Profile updated successfully",

                user:
                    updatedUser

            });

    }
    catch (error) {

        console.error(
            "Update Profile Error:",
            error
        );


        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res
                .status(409)
                .json({

                    success: false,

                    message:
                        "Phone number already exists"

                });

        }


        return res
            .status(500)
            .json({

                success: false,

                message:
                    "Unable to update user profile",

                error:
                    process.env.NODE_ENV ===
                    "development"
                        ? error.message
                        : undefined

            });

    }

};


// ==========================================
// UPDATE PROFILE IMAGE
// ==========================================
// PUT /api/users/profile-image
// ==========================================

exports.updateProfileImage = async (
    req,
    res
) => {

    try {

        const userId =
            req.user.id;


        // ==========================================
        // CHECK IMAGE
        // ==========================================

        if (!req.file) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "Please select a profile image"

                });

        }


        // ==========================================
        // CHECK FILE BUFFER
        // ==========================================

        if (!req.file.buffer) {

            return res
                .status(400)
                .json({

                    success: false,

                    message:
                        "Invalid profile image"

                });

        }


        // ==========================================
        // GET CURRENT USER
        // ==========================================

        const currentUser =
            await userService.findUserById(
                userId
            );


        if (!currentUser) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        "User not found"

                });

        }


        // ==========================================
        // CHECK CLOUDINARY CONFIGURATION
        // ==========================================

        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {

            console.error(
                "Cloudinary environment variables are missing"
            );


            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Image storage is not configured"

                });

        }


        // ==========================================
        // UPLOAD IMAGE TO CLOUDINARY
        // ==========================================

        const cloudinaryResult =
            await uploadToCloudinary(
                req.file.buffer,
                userId
            );


        if (
            !cloudinaryResult ||
            !cloudinaryResult.secure_url
        ) {

            throw new Error(
                "Cloudinary did not return an image URL"
            );

        }


        // ==========================================
        // CLOUDINARY IMAGE URL
        // ==========================================

        const profileImagePath =
            cloudinaryResult.secure_url;


        // ==========================================
        // UPDATE PROFILE USING SERVICE
        // ==========================================

        const result =
            await userService.updateUserProfile(

                userId,

                {

                    fullName:
                        currentUser.full_name,

                    phone:
                        currentUser.phone,

                    address:
                        currentUser.address,

                    dob:
                        currentUser.dob,

                    profileImage:
                        profileImagePath

                }

            );


        if (
            result.affectedRows === 0
        ) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        "User not found"

                });

        }


        // ==========================================
        // GET UPDATED USER
        // ==========================================

        const updatedUser =
            await userService.getUserProfile(
                userId
            );


        if (!updatedUser) {

            return res
                .status(404)
                .json({

                    success: false,

                    message:
                        "Updated user could not be found"

                });

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        return res
            .status(200)
            .json({

                success: true,

                message:
                    "Profile image updated successfully",

                profileImage:
                    profileImagePath,

                user:
                    updatedUser

            });

    }
    catch (error) {

        console.error(
            "Update Profile Image Error:",
            error
        );


        return res
            .status(500)
            .json({

                success: false,

                message:
                    "Unable to update profile image",

                error:
                    process.env.NODE_ENV ===
                    "development"
                        ? error.message
                        : undefined

            });

    }

};