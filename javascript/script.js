document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // CONFIG
    // =====================================================

    const API_BASE =
        "http://localhost:5000";

    const defaultProfileImage =
        "../images/default-profile.png";


    // =====================================================
    // ELEMENTS
    // =====================================================

    const wrapper =
        document.querySelector(".wrapper");

    const loginFormBox =
        document.getElementById("loginFormBox") ||
        document.querySelector(".form-box.login");

    const registerFormBox =
        document.getElementById("registerFormBox") ||
        document.querySelector(".form-box.register");

    const loginLink =
        document.querySelector(".login-link");

    const registerLink =
        document.querySelector(".register-link");

    const loginPopupBtn =
        document.querySelector(".btnlogin-popup");

    const closeBtn =
        document.querySelector(".icon-close");

    const backdrop =
        document.querySelector(".backdrop");

    const loginBtn =
        document.getElementById("loginBtn");

    const profileMenu =
        document.getElementById("profileMenu");

    const adminDashboardMenu =
        document.getElementById(
            "adminDashboardMenu"
        );

    const navProfileImage =
        document.getElementById(
            "navProfileImage"
        );

    const logout =
        document.getElementById("logout");

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    const bookingForm =
        document.getElementById(
            "bookingForm"
        );

    const fromInput =
        document.getElementById("from");

    const toInput =
        document.getElementById("to");

    const swapButton =
        document.getElementById(
            "swapBtn"
        );

    const dateInput =
        document.getElementById("date");


    // =====================================================
    // GET CURRENT USER
    // =====================================================

    function getCurrentUser() {

        try {

            const user =
                localStorage.getItem(
                    "currentUser"
                );

            return user
                ? JSON.parse(user)
                : null;

        }
        catch (error) {

            console.error(
                "Current User Parse Error:",
                error
            );

            return null;

        }

    }


    // =====================================================
    // GET PROFILE IMAGE URL
    // =====================================================

    function getProfileImageUrl(user) {

        if (!user) {

            return defaultProfileImage;

        }

        const profileImage =
            user.profile_image ||
            user.profileImage ||
            "";

        if (!profileImage) {

            return defaultProfileImage;

        }

        if (
            profileImage.startsWith(
                "http://"
            ) ||
            profileImage.startsWith(
                "https://"
            ) ||
            profileImage.startsWith(
                "data:"
            )
        ) {

            return profileImage;

        }

        if (
            profileImage.startsWith(
                "/uploads/"
            )
        ) {

            return (
                API_BASE +
                profileImage
            );

        }

        return profileImage;

    }


    // =====================================================
    // UPDATE NAVBAR
    // =====================================================

    function updateNavbar() {

        const token =
            localStorage.getItem(
                "token"
            );

        const currentUser =
            getCurrentUser();


        // =================================================
        // LOGGED IN
        // =================================================

        if (
            token &&
            currentUser
        ) {

            if (loginBtn) {

                loginBtn.style.display =
                    "none";

            }


            if (profileMenu) {

                profileMenu.style.display =
                    "";

            }


            // =================================================
            // ADMIN DASHBOARD MENU
            // =================================================

            if (adminDashboardMenu) {

                const role =
                    String(
                        currentUser.role ||
                        ""
                    ).toLowerCase();


                if (
                    role === "admin"
                ) {

                    adminDashboardMenu.style.display =
                        "";

                }
                else {

                    adminDashboardMenu.style.display =
                        "none";

                }

            }


            // =================================================
            // PROFILE IMAGE
            // =================================================

            if (navProfileImage) {

                navProfileImage.src =
                    getProfileImageUrl(
                        currentUser
                    );

                navProfileImage.onerror =
                    function () {

                        this.onerror =
                            null;

                        this.src =
                            defaultProfileImage;

                    };

            }


            localStorage.setItem(
                "isLoggedIn",
                "true"
            );

            return;

        }


        // =================================================
        // LOGGED OUT
        // =================================================

        if (loginBtn) {

            loginBtn.style.display =
                "";

        }


        if (profileMenu) {

            profileMenu.style.display =
                "none";

        }


        if (adminDashboardMenu) {

            adminDashboardMenu.style.display =
                "none";

        }


        if (navProfileImage) {

            navProfileImage.src =
                defaultProfileImage;

        }


        localStorage.removeItem(
            "isLoggedIn"
        );

    }


    // =====================================================
    // SHOW LOGIN FORM
    // =====================================================

    function showLoginForm() {

        if (!wrapper) {

            return;

        }

        if (loginFormBox) {

            loginFormBox.style.display =
                "block";

        }

        if (registerFormBox) {

            registerFormBox.style.display =
                "none";

        }

        wrapper.classList.add(
            "active-popup"
        );

        wrapper.classList.remove(
            "active"
        );

        if (backdrop) {

            backdrop.classList.add(
                "active"
            );

        }

    }


    // =====================================================
    // SHOW REGISTER FORM
    // =====================================================

    function showRegisterForm() {

        if (!wrapper) {

            return;

        }

        if (loginFormBox) {

            loginFormBox.style.display =
                "none";

        }

        if (registerFormBox) {

            registerFormBox.style.display =
                "block";

        }

        wrapper.classList.add(
            "active-popup"
        );

        wrapper.classList.add(
            "active"
        );

        if (backdrop) {

            backdrop.classList.add(
                "active"
            );

        }

    }


    // =====================================================
    // CLOSE POPUP
    // =====================================================

    function closePopup() {

        if (!wrapper) {

            return;

        }

        wrapper.classList.remove(
            "active-popup"
        );

        wrapper.classList.remove(
            "active"
        );

        if (backdrop) {

            backdrop.classList.remove(
                "active"
            );

        }

    }


    // =====================================================
    // INITIAL NAVBAR
    // =====================================================

    updateNavbar();


    // =====================================================
    // OPEN LOGIN POPUP
    // =====================================================

    if (loginPopupBtn) {

        loginPopupBtn.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                showLoginForm();

            }
        );

    }


    // =====================================================
    // REGISTER LINK
    // =====================================================

    if (registerLink) {

        registerLink.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                showRegisterForm();

            }
        );

    }


    // =====================================================
    // LOGIN LINK
    // =====================================================

    if (loginLink) {

        loginLink.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                showLoginForm();

            }
        );

    }


    // =====================================================
    // CLOSE BUTTON
    // =====================================================

    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closePopup
        );

    }


    // =====================================================
    // BACKDROP
    // =====================================================

    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closePopup
        );

    }


    // =====================================================
    // REGISTER
    // =====================================================

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const fullNameEl =
                    document.getElementById(
                        "regUsername"
                    );

                const emailEl =
                    document.getElementById(
                        "regEmail"
                    );

                const phoneEl =
                    document.getElementById(
                        "regPhone"
                    );

                const passwordEl =
                    document.getElementById(
                        "regPassword"
                    );

                const termsCheckbox =
                    document.getElementById(
                        "termsCheckbox"
                    );


                const full_name =
                    fullNameEl
                        ? fullNameEl.value.trim()
                        : "";

                const email =
                    emailEl
                        ? emailEl.value.trim()
                        : "";

                const phone =
                    phoneEl
                        ? phoneEl.value.trim()
                        : "";

                const password =
                    passwordEl
                        ? passwordEl.value
                        : "";


                if (
                    !full_name ||
                    !email ||
                    !phone ||
                    !password
                ) {

                    alert(
                        "Please fill all registration fields."
                    );

                    return;

                }


                if (
                    !/^[0-9]{10}$/.test(
                        phone
                    )
                ) {

                    alert(
                        "Phone number must contain exactly 10 digits."
                    );

                    return;

                }


                if (
                    password.length < 6
                ) {

                    alert(
                        "Password must be at least 6 characters."
                    );

                    return;

                }


                if (
                    termsCheckbox &&
                    !termsCheckbox.checked
                ) {

                    alert(
                        "Please agree to the terms & conditions."
                    );

                    return;

                }


                try {

                    const response =
                        await fetch(

                            `${API_BASE}/api/auth/register`,

                            {
                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify({

                                        full_name:
                                            full_name,

                                        email:
                                            email,

                                        phone:
                                            phone,

                                        password:
                                            password

                                    })

                            }

                        );


                    const data =
                        await response.json();


                    console.log(
                        "Register API Response:",
                        data
                    );


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        alert(
                            data.message ||
                            "Registration failed."
                        );

                        return;

                    }


                    alert(
                        "Registration Successful! Please login."
                    );


                    registerForm.reset();


                    showLoginForm();

                }
                catch (error) {

                    console.error(
                        "Register Error:",
                        error
                    );


                    alert(
                        "Unable to connect to the server."
                    );

                }

            }
        );

    }


    // =====================================================
    // LOGIN
    // =====================================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const emailElement =
                    document.getElementById(
                        "loginEmail"
                    );

                const passwordElement =
                    document.getElementById(
                        "loginPassword"
                    );


                const email =
                    emailElement
                        ? emailElement.value.trim()
                        : "";

                const password =
                    passwordElement
                        ? passwordElement.value
                        : "";


                if (
                    !email ||
                    !password
                ) {

                    alert(
                        "Please enter email and password."
                    );

                    return;

                }


                try {

                    const response =
                        await fetch(

                            `${API_BASE}/api/auth/login`,

                            {
                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify({

                                        email:
                                            email,

                                        password:
                                            password

                                    })

                            }

                        );


                    const data =
                        await response.json();


                    console.log(
                        "Login API Response:",
                        data
                    );


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        alert(
                            data.message ||
                            "Invalid Email or Password."
                        );

                        return;

                    }


                    if (
                        !data.token ||
                        !data.user
                    ) {

                        alert(
                            "Invalid login response from server."
                        );

                        return;

                    }


                    const loggedInUser = {

                        id:
                            data.user.id,

                        full_name:
                            data.user.full_name,

                        username:
                            data.user.full_name,

                        email:
                            data.user.email,

                        phone:
                            data.user.phone,

                        role:
                            data.user.role ||
                            "user",

                        profile_image:
                            data.user.profile_image ||
                            null

                    };


                    // =================================================
                    // SAVE LOGIN
                    // =================================================

                    localStorage.setItem(
                        "token",
                        data.token
                    );


                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(
                            loggedInUser
                        )
                    );


                    localStorage.setItem(
                        "isLoggedIn",
                        "true"
                    );


                    updateNavbar();


                    closePopup();


                    loginForm.reset();


                    alert(
                        "Login Successful!"
                    );


                    console.log(
                        "Logged In User:",
                        loggedInUser
                    );


                    // =================================================
                    // ADMIN REDIRECT
                    // =================================================

                    if (
                        String(
                            loggedInUser.role
                        ).toLowerCase() ===
                        "admin"
                    ) {

                        window.location.href =
                            "admin.html";

                        return;

                    }


                    // =================================================
                    // NORMAL USER
                    // =================================================

                    window.location.href =
                        "index.html";

                }
                catch (error) {

                    console.error(
                        "Login Error:",
                        error
                    );


                    alert(
                        "Unable to connect to the server."
                    );

                }

            }
        );

    }


    // =====================================================
    // LOGOUT
    // =====================================================

    if (logout) {

        logout.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmed) {

                    return;

                }


                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "currentUser"
                );

                localStorage.removeItem(
                    "isLoggedIn"
                );


                updateNavbar();


                window.location.href =
                    "index.html";

            }
        );

    }


    // =====================================================
    // FLATPICKR
    // =====================================================

    if (
        dateInput &&
        typeof flatpickr !==
        "undefined"
    ) {

        flatpickr(

            dateInput,

            {
                dateFormat:
                    "d/m/Y",

                minDate:
                    "today",

                defaultDate:
                    "today"
            }

        );

    }


    // =====================================================
    // SWAP FROM / TO
    // =====================================================

    if (
        swapButton &&
        fromInput &&
        toInput
    ) {

        swapButton.addEventListener(
            "click",
            function () {

                const temp =
                    fromInput.value;


                fromInput.value =
                    toInput.value;


                toInput.value =
                    temp;

            }
        );

    }


    // =====================================================
    // SEARCH TRAIN
    // =====================================================

    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const from =
                    fromInput
                        ? fromInput.value.trim()
                        : "";

                const to =
                    toInput
                        ? toInput.value.trim()
                        : "";

                const date =
                    dateInput
                        ? dateInput.value.trim()
                        : "";


                const classElement =
                    document.getElementById(
                        "all-classes"
                    );


                const trainClass =
                    classElement
                        ? classElement.value
                        : "ALL CLASSES";


                if (
                    !from ||
                    !to ||
                    !date
                ) {

                    alert(
                        "Please enter From, To and Journey Date."
                    );

                    return;

                }


                if (
                    from.toLowerCase() ===
                    to.toLowerCase()
                ) {

                    alert(
                        "From and To stations cannot be the same."
                    );

                    return;

                }


                window.location.href =

                    `search.html?from=${encodeURIComponent(from)}` +

                    `&to=${encodeURIComponent(to)}` +

                    `&date=${encodeURIComponent(date)}` +

                    `&class=${encodeURIComponent(trainClass)}`;

            }
        );

    }

});