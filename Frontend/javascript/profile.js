document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const editBtn =
        document.getElementById("editBtn");

    const passwordBtn =
        document.getElementById("passwordBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const sidebarLogout =
        document.getElementById("sidebarLogout");

    const imageUpload =
        document.getElementById("imageUpload");

    const profileImage =
        document.getElementById("profileImage");


    // ==========================================
    // DEFAULT PROFILE IMAGE
    // ==========================================

    const defaultProfileImage =
        "../images/default-profile.png";


    // ==========================================
    // BACKEND BASE URL
    // ==========================================

    const backendUrl =
        window.location.origin;


    // ==========================================
    // TOKEN
    // ==========================================

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please login to view your profile."
        );

        window.location.href =
            "index.html";

        return;

    }


    // ==========================================
    // CURRENT USER
    // ==========================================

    let currentUser = {};


    // ==========================================
    // CLEAR LOGIN SESSION
    // ==========================================

    function clearLoginSession() {

        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    function logoutUser() {

        const confirmed =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmed) {
            return;
        }


        clearLoginSession();


        window.location.href =
            "index.html";

    }


    // ==========================================
    // GET PROFILE IMAGE URL
    // ==========================================

    function getProfileImageUrl(
        imagePath
    ) {

        if (!imagePath) {

            return defaultProfileImage;

        }


        // Already absolute URL

        if (
            imagePath.startsWith(
                "http://"
            ) ||
            imagePath.startsWith(
                "https://"
            )
        ) {

            return imagePath;

        }


        // Backend upload path

        if (
            imagePath.startsWith(
                "/uploads/"
            )
        ) {

            return (
                backendUrl +
                imagePath
            );

        }


        return imagePath;

    }


    // ==========================================
    // DISPLAY PROFILE
    // ==========================================

    function displayProfile() {

        const usernameEl =
            document.getElementById("username");

        const emailEl =
            document.getElementById("email");

        const phoneEl =
            document.getElementById("phone");

        const addressEl =
            document.getElementById("address");

        const dobEl =
            document.getElementById("dob");

        const sidebarName =
            document.querySelector(
                ".profile-name"
            );


        if (usernameEl) {

            usernameEl.textContent =
                currentUser.full_name ||
                "Not Added";

        }


        if (emailEl) {

            emailEl.textContent =
                currentUser.email ||
                "Not Added";

        }


        if (phoneEl) {

            phoneEl.textContent =
                currentUser.phone ||
                "Not Added";

        }


        if (addressEl) {

            addressEl.textContent =
                currentUser.address ||
                "Not Added";

        }


        if (dobEl) {

            dobEl.textContent =
                formatDate(
                    currentUser.dob
                );

        }


        if (sidebarName) {

            sidebarName.textContent =
                currentUser.full_name ||
                currentUser.email ||
                "User";

        }


        if (profileImage) {

            profileImage.src =
                getProfileImageUrl(
                    currentUser.profile_image
                );

        }

    }


    // ==========================================
    // PROFILE IMAGE FALLBACK
    // ==========================================

    if (profileImage) {

        profileImage.onerror =
            function () {

                this.onerror = null;

                this.src =
                    defaultProfileImage;

            };

    }


    // ==========================================
    // LOAD PROFILE FROM BACKEND
    // ==========================================

    async function loadProfileFromBackend() {

        try {

            const response =
                await fetch(

                    `${backendUrl}/api/users/profile`,

                    {
                        method:
                            "GET",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        }

                    }

                );


            const data =
                await response.json();


            console.log(
                "Profile API Response:",
                data
            );


            if (
                response.status === 401
            ) {

                clearLoginSession();


                alert(
                    data.message ||
                    "Session expired. Please login again."
                );


                window.location.href =
                    "index.html";

                return false;

            }


            if (
                !response.ok ||
                !data.success ||
                !data.user
            ) {

                throw new Error(
                    data.message ||
                    "Unable to load profile"
                );

            }


            currentUser = {

                ...data.user

            };


            localStorage.setItem(
                "currentUser",
                JSON.stringify(
                    currentUser
                )
            );


            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            displayProfile();


            return true;

        }
        catch (error) {

            console.error(
                "Load Profile Error:",
                error
            );


            alert(
                error.message ||
                "Unable to load profile."
            );


            return false;

        }

    }


    // ==========================================
    // CHANGE PROFILE PICTURE
    // ==========================================

    if (
        imageUpload &&
        profileImage
    ) {

        imageUpload.addEventListener(
            "change",
            async function () {

                const file =
                    this.files[0];


                if (!file) {
                    return;
                }


                // ==========================================
                // VALIDATE IMAGE TYPE
                // ==========================================

                const allowedTypes = [

                    "image/jpeg",

                    "image/png",

                    "image/webp"

                ];


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    alert(
                        "Only JPG, JPEG, PNG and WEBP images are allowed."
                    );

                    this.value =
                        "";

                    return;

                }


                // ==========================================
                // VALIDATE SIZE
                // ==========================================

                if (
                    file.size >
                    5 * 1024 * 1024
                ) {

                    alert(
                        "Profile image must be smaller than 5 MB."
                    );

                    this.value =
                        "";

                    return;

                }


                try {

                    // ==========================================
                    // SHOW LOCAL PREVIEW
                    // ==========================================

                    const previewUrl =
                        URL.createObjectURL(
                            file
                        );


                    profileImage.src =
                        previewUrl;


                    // ==========================================
                    // CREATE FORMDATA
                    // ==========================================

                    const formData =
                        new FormData();


                    formData.append(
                        "profileImage",
                        file
                    );


                    // ==========================================
                    // UPLOAD TO BACKEND
                    // ==========================================

                    const response =
                        await fetch(

                            `${backendUrl}/api/users/profile-image`,

                            {
                                method:
                                    "PUT",

                                headers: {

                                    "Authorization":
                                        `Bearer ${token}`

                                },

                                body:
                                    formData

                            }

                        );


                    const data =
                        await response.json();


                    console.log(
                        "Profile Image Response:",
                        data
                    );


                    // ==========================================
                    // TOKEN EXPIRED
                    // ==========================================

                    if (
                        response.status === 401
                    ) {

                        URL.revokeObjectURL(
                            previewUrl
                        );


                        clearLoginSession();


                        alert(
                            data.message ||
                            "Session expired. Please login again."
                        );


                        window.location.href =
                            "index.html";

                        return;

                    }


                    // ==========================================
                    // UPLOAD FAILED
                    // ==========================================

                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        URL.revokeObjectURL(
                            previewUrl
                        );


                        displayProfile();


                        alert(
                            data.message ||
                            "Unable to upload profile image."
                        );


                        return;

                    }


                    // ==========================================
                    // SUCCESS
                    // ==========================================

                    if (data.user) {

                        currentUser = {

                            ...currentUser,

                            ...data.user

                        };

                    }
                    else {

                        currentUser.profile_image =
                            data.profileImage;

                    }


                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(
                            currentUser
                        )
                    );


                    URL.revokeObjectURL(
                        previewUrl
                    );


                    displayProfile();


                    alert(
                        "Profile picture updated successfully!"
                    );


                    this.value =
                        "";

                }
                catch (error) {

                    console.error(
                        "Profile Image Upload Error:",
                        error
                    );


                    displayProfile();


                    alert(
                        "Unable to connect to the server."
                    );

                }

            }
        );

    }


    // ==========================================
    // EDIT PROFILE
    // ==========================================

    if (editBtn) {

        editBtn.addEventListener(
            "click",
            async function () {

                const fullName =
                    prompt(
                        "Full Name",
                        currentUser.full_name ||
                        ""
                    );


                if (
                    fullName === null
                ) {
                    return;
                }


                const phone =
                    prompt(
                        "Phone",
                        currentUser.phone ||
                        ""
                    );


                if (
                    phone === null
                ) {
                    return;
                }


                const address =
                    prompt(
                        "Address",
                        currentUser.address ||
                        ""
                    );


                if (
                    address === null
                ) {
                    return;
                }


                const dob =
                    prompt(
                        "Date of Birth (YYYY-MM-DD)",
                        currentUser.dob
                            ? formatDateForInput(
                                currentUser.dob
                            )
                            : ""
                    );


                if (
                    dob === null
                ) {
                    return;
                }


                if (
                    !fullName.trim() ||
                    !phone.trim()
                ) {

                    alert(
                        "Full name and phone are required."
                    );

                    return;

                }


                try {

                    const response =
                        await fetch(

                            `${backendUrl}/api/users/profile`,

                            {
                                method:
                                    "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        `Bearer ${token}`

                                },

                                body:
                                    JSON.stringify({

                                        full_name:
                                            fullName.trim(),

                                        phone:
                                            phone.trim(),

                                        address:
                                            address.trim(),

                                        dob:
                                            dob.trim() ||
                                            null

                                    })

                            }

                        );


                    const data =
                        await response.json();


                    console.log(
                        "Update Profile Response:",
                        data
                    );


                    if (
                        response.status === 401
                    ) {

                        clearLoginSession();


                        alert(
                            data.message ||
                            "Session expired. Please login again."
                        );


                        window.location.href =
                            "index.html";

                        return;

                    }


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        alert(
                            data.message ||
                            "Unable to update profile."
                        );

                        return;

                    }


                    currentUser = {

                        ...data.user

                    };


                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(
                            currentUser
                        )
                    );


                    displayProfile();


                    alert(
                        "Profile updated successfully!"
                    );

                }
                catch (error) {

                    console.error(
                        "Update Profile Error:",
                        error
                    );


                    alert(
                        "Unable to connect to the server."
                    );

                }

            }
        );

    }


    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    if (passwordBtn) {

        passwordBtn.addEventListener(
            "click",
            async function () {

                const currentPassword =
                    prompt(
                        "Enter Current Password"
                    );


                if (!currentPassword) {
                    return;
                }


                const newPassword =
                    prompt(
                        "Enter New Password"
                    );


                if (!newPassword) {
                    return;
                }


                if (
                    newPassword.length < 6
                ) {

                    alert(
                        "New password must be at least 6 characters."
                    );

                    return;

                }


                if (
                    newPassword ===
                    currentPassword
                ) {

                    alert(
                        "New password must be different from current password."
                    );

                    return;

                }


                const confirmPassword =
                    prompt(
                        "Confirm New Password"
                    );


                if (
                    !confirmPassword ||
                    newPassword !==
                    confirmPassword
                ) {

                    alert(
                        "New password and confirm password do not match."
                    );

                    return;

                }


                try {

                    const response =
                        await fetch(

                            `${backendUrl}/api/auth/change-password`,

                            {
                                method:
                                    "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        `Bearer ${token}`

                                },

                                body:
                                    JSON.stringify({

                                        currentPassword:
                                            currentPassword,

                                        newPassword:
                                            newPassword

                                    })

                            }

                        );


                    const data =
                        await response.json();


                    console.log(
                        "Change Password Response:",
                        data
                    );


                    if (
                        response.status === 401 &&
                        data.message !==
                        "Current password is incorrect"
                    ) {

                        clearLoginSession();


                        alert(
                            data.message ||
                            "Session expired. Please login again."
                        );


                        window.location.href =
                            "index.html";

                        return;

                    }


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        alert(
                            data.message ||
                            "Unable to change password."
                        );

                        return;

                    }


                    alert(
                        "Password changed successfully!\n\nPlease login again with your new password."
                    );


                    clearLoginSession();


                    window.location.href =
                        "index.html";

                }
                catch (error) {

                    console.error(
                        "Change Password Error:",
                        error
                    );


                    alert(
                        "Unable to connect to the server."
                    );

                }

            }
        );

    }


    // ==========================================
    // MAIN LOGOUT
    // ==========================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logoutUser
        );

    }


    // ==========================================
    // SIDEBAR LOGOUT
    // ==========================================

    if (sidebarLogout) {

        sidebarLogout.addEventListener(
            "click",
            function (e) {

                e.preventDefault();


                logoutUser();

            }
        );

    }


    // ==========================================
    // FORMAT DATE
    // ==========================================

    function formatDate(
        dateValue
    ) {

        if (!dateValue) {

            return "Not Added";

        }


        const date =
            new Date(
                dateValue
            );


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return dateValue;

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric",

                timeZone:
                    "UTC"
            }
        );

    }


    // ==========================================
    // FORMAT DATE FOR EDIT
    // ==========================================

    function formatDateForInput(
        dateValue
    ) {

        if (!dateValue) {
            return "";
        }


        const stringValue =
            String(
                dateValue
            );


        if (
            /^\d{4}-\d{2}-\d{2}/.test(
                stringValue
            )
        ) {

            return stringValue.substring(
                0,
                10
            );

        }


        const date =
            new Date(
                dateValue
            );


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return "";

        }


        const year =
            date.getUTCFullYear();

        const month =
            String(
                date.getUTCMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getUTCDate()
            ).padStart(
                2,
                "0"
            );


        return `${year}-${month}-${day}`;

    }


    // ==========================================
    // START PROFILE
    // ==========================================

    await loadProfileFromBackend();

});