const db = require("../config/db");


// ==========================================
// FIND USER BY EMAIL
// ==========================================

exports.findUserByEmail = async (email) => {

    const [rows] = await db.promise().query(

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
         WHERE email = ?
         LIMIT 1`,

        [email]

    );


    return rows[0] || null;
};


// ==========================================
// FIND USER BY PHONE
// ==========================================

exports.findUserByPhone = async (phone) => {

    const [rows] = await db.promise().query(

        `SELECT
            id,
            full_name,
            email,
            phone
         FROM users
         WHERE phone = ?
         LIMIT 1`,

        [phone]

    );


    return rows[0] || null;
};


// ==========================================
// FIND USER BY ID
// ==========================================

exports.findUserById = async (userId) => {

    const [rows] = await db.promise().query(

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
         WHERE id = ?
         LIMIT 1`,

        [userId]

    );


    return rows[0] || null;
};


// ==========================================
// GET USER PROFILE
// ==========================================

exports.getUserProfile = async (userId) => {

    const [rows] = await db.promise().query(

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
         WHERE id = ?
         LIMIT 1`,

        [userId]

    );


    return rows[0] || null;
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


    const [result] = await db.promise().query(

        `INSERT INTO users
        (
            full_name,
            email,
            phone,
            password
        )
        VALUES (?, ?, ?, ?)`,


        [
            fullName,
            email,
            phone,
            password
        ]

    );


    return result;
};


// ==========================================
// UPDATE PASSWORD
// ==========================================

exports.updatePassword = async (
    userId,
    hashedPassword
) => {

    const [result] = await db.promise().query(

        `UPDATE users
         SET password = ?
         WHERE id = ?`,

        [
            hashedPassword,
            userId
        ]

    );


    return result;
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


    const [result] = await db.promise().query(

        `UPDATE users
         SET
            full_name = ?,
            phone = ?,
            address = ?,
            dob = ?,
            profile_image = ?
         WHERE id = ?`,

        [
            fullName,
            phone,
            address || null,
            dob || null,
            profileImage || null,
            userId
        ]

    );


    return result;
};