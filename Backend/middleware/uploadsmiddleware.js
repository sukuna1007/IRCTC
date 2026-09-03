const multer = require("multer");


// =====================================================
// MEMORY STORAGE
// =====================================================
// Vercel serverless should not permanently save uploaded
// files inside Backend/uploads.
//
// The uploaded image will be available as:
// req.file.buffer
// =====================================================

const storage =
    multer.memoryStorage();


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        );

    }
    else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            ),
            false
        );

    }

};


// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload =
    multer({

        storage: storage,

        fileFilter: fileFilter,

        limits: {

            // Maximum image size = 5 MB
            fileSize:
                5 * 1024 * 1024

        }

    });


// =====================================================
// EXPORT
// =====================================================

module.exports = upload;