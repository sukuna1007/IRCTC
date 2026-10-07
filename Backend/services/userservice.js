const db = require("../config/db");


// ==========================================
// FIND USER BY EMAIL
// ==========================================

exports.findUserByEmail = async (email) => {

    const result = await db.query(

        `SELECT
            id,
            full_name,
            email,
            phone,
            password,
            address,
            dob,
            role,
            profile_image,
            created_at
         FROM users
         WHERE email = $1
         LIMIT 1`,

        [email]

    );

    return result.rows[0] || null;
};


// ==========================================
// FIND USER BY PHONE
// ==========================================

exports.findUserByPhone = async (phone) => {

    const result = await db.query(

        `SELECT
            id,
            full_name,
            email,
            phone
         FROM users
         WHERE phone = $1
         LIMIT 1`,

        [phone]

    );

    return result.rows[0] || null;
};


// ==========================================
// FIND USER BY ID
// ==========================================

exports.findUserById = async (userId) => {

    const result = await db.query(

        `SELECT
            id,
            full_name,
            email,
            phone,
            password,
            address,
            dob,
            role,
            profile_image,
            created_at
         FROM users
         WHERE id = $1
         LIMIT 1`,

        [userId]

    );

    return result.rows[0] || null;
};


// ==========================================
// GET USER PROFILE
// ==========================================

exports.getUserProfile = async (userId) => {

    const result = await db.query(

        `SELECT
            id,
            full_name,
            email,
            phone,
            address,
            dob,
            role,
            profile_image,
            created_at
         FROM users
         WHERE id = $1
         LIMIT 1`,

        [userId]

    );

    return result.rows[0] || null;
};


// ==========================================
// CREATE USER
// ==========================================

exports.createUser = async (userData) => {

    const {
        fullName,
        email,
        phone,
        password
    } = userData;

    const result = await db.query(

        `INSERT INTO users
        (
            full_name,
            email,
            phone,
            password
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id`,

        [
            fullName,
            email,
            phone,
            password
        ]

    );

    // Keep compatibility with existing authcontroller.js
    return {
        insertId: result.rows[0].id
    };
};


// ==========================================
// UPDATE PASSWORD
// ==========================================

exports.updatePassword = async (
    userId,
    hashedPassword
) => {

    const result = await db.query(

        `UPDATE users
         SET password = $1
         WHERE id = $2
         RETURNING id`,

        [
            hashedPassword,
            userId
        ]

    );

    // Keep compatibility with existing controller
    return {
        affectedRows: result.rowCount
    };
};


// ==========================================
// UPDATE USER PROFILE
// ==========================================

exports.updateUserProfile = async (
    userId,
    profileData
) => {

    const {
        fullName,
        phone,
        address,
        dob,
        profileImage
    } = profileData;

    const result = await db.query(

        `UPDATE users
         SET
            full_name = $1,
            phone = $2,
            address = $3,
            dob = $4,
            profile_image = $5
         WHERE id = $6
         RETURNING id`,

        [
            fullName,
            phone,
            address || null,
            dob || null,
            profileImage || null,
            userId
        ]

    );

    return {
        affectedRows: result.rowCount
    };
};