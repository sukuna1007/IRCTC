document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // CONFIGURATION
    // =========================================================

    const API_BASE = window.location.origin;

    const defaultProfileImage =
        "../images/default-profile.png";


    // =========================================================
    // ELEMENTS
    // =========================================================

    const wrapper =
        document.querySelector(".wrapper");

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

    const classSelect =
        document.getElementById(
            "all-classes"
        );


    // =========================================================
    // GET CURRENT USER
    // =========================================================

    function getCurrentUser() {

        try {

            const user =
                localStorage.getItem(
                    "currentUser"
                );

            if (!user) {

                return null;

            }

            return JSON.parse(user);

        }
        catch (error) {

            console.error(
                "Invalid currentUser:",
                error
            );

            localStorage.removeItem(
                "currentUser"
            );

            return null;

        }

    }


    // =========================================================
    // GET PROFILE IMAGE
    // =========================================================

    function getProfileImageUrl(user) {

        if (!user) {

            return defaultProfileImage;

        }


        const profileImage =
            user.profile_image ||
            user.profileImage;


        if (!profileImage) {

            return defaultProfileImage;

        }


        // Full URL
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


        // Backend upload path
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


        // uploads/profile.jpg
        if (
            profileImage.startsWith(
                "uploads/"
            )
        ) {

            return (
                API_BASE +
                "/" +
                profileImage
            );

        }


        return profileImage;

    }


    // =========================================================
    // UPDATE NAVBAR
    // =========================================================

    function updateNavbar() {

        const token =
            localStorage.getItem(
                "token"
            );

        const currentUser =
            getCurrentUser();


        // =====================================================
        // LOGGED IN USER
        // =====================================================

        if (
            token &&
            currentUser
        ) {

            console.log(
                "Logged in user:",
                currentUser
            );


            // -----------------------------------------
            // HIDE LOGIN / REGISTER BUTTON
            // -----------------------------------------

            if (loginBtn) {

                loginBtn.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

            }


            // -----------------------------------------
            // SHOW PROFILE
            // -----------------------------------------

            if (profileMenu) {

                profileMenu.style.setProperty(
                    "display",
                    "flex",
                    "important"
                );

            }


            // -----------------------------------------
            // PROFILE IMAGE
            // -----------------------------------------

            if (navProfileImage) {

                navProfileImage.src =
                    getProfileImageUrl(
                        currentUser
                    );


                navProfileImage.onerror =
                    function () {

                        this.onerror = null;

                        this.src =
                            defaultProfileImage;

                    };

            }


            // -----------------------------------------
            // ADMIN DASHBOARD
            // -----------------------------------------

            if (adminDashboardMenu) {

                const role =
                    String(
                        currentUser.role ||
                        ""
                    ).toLowerCase();


                if (role === "admin") {

                    adminDashboardMenu
                        .style
                        .setProperty(
                            "display",
                            "block",
                            "important"
                        );

                }
                else {

                    adminDashboardMenu
                        .style
                        .setProperty(
                            "display",
                            "none",
                            "important"
                        );

                }

            }


            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            return;

        }


        // =====================================================
        // LOGGED OUT USER
        // =====================================================

        console.log(
            "User is logged out"
        );


        // Show Login/Register
        if (loginBtn) {

            loginBtn.style.setProperty(
                "display",
                "flex",
                "important"
            );

        }


        // Hide Profile
        if (profileMenu) {

            profileMenu.style.setProperty(
                "display",
                "none",
                "important"
            );

        }


        // Hide Admin Dashboard
        if (adminDashboardMenu) {

            adminDashboardMenu
                .style
                .setProperty(
                    "display",
                    "none",
                    "important"
                );

        }


        // Default profile image
        if (navProfileImage) {

            navProfileImage.src =
                defaultProfileImage;

        }


        localStorage.removeItem(
            "isLoggedIn"
        );

    }


    // =========================================================
    // RUN NAVBAR CHECK
    // =========================================================

    updateNavbar();


    // =========================================================
    // SHOW LOGIN FORM
    // =========================================================

    function showLoginForm() {

        if (!wrapper) return;


        wrapper.classList.remove(
            "active"
        );

        wrapper.classList.remove(
            "register-active"
        );


        wrapper.classList.add(
            "active-popup"
        );


        if (backdrop) {

            backdrop.classList.add(
                "active"
            );

        }

    }


    // =========================================================
    // SHOW REGISTER FORM
    // =========================================================

    function showRegisterForm() {

        if (!wrapper) return;


        wrapper.classList.add(
            "active"
        );

        wrapper.classList.add(
            "register-active"
        );

        wrapper.classList.add(
            "active-popup"
        );


        if (backdrop) {

            backdrop.classList.add(
                "active"
            );

        }

    }


    // =========================================================
    // CLOSE POPUP
    // =========================================================

    function closePopup() {

        if (wrapper) {

            wrapper.classList.remove(
                "active-popup"
            );

            wrapper.classList.remove(
                "active"
            );

            wrapper.classList.remove(
                "register-active"
            );

        }


        if (backdrop) {

            backdrop.classList.remove(
                "active"
            );

        }

    }


    // =========================================================
    // OPEN LOGIN
    // =========================================================

    if (loginPopupBtn) {

        loginPopupBtn.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                showLoginForm();

            }
        );

    }


    // =========================================================
    // LOGIN -> REGISTER
    // =========================================================

    if (registerLink) {

        registerLink.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                showRegisterForm();

            }
        );

    }


    // =========================================================
    // REGISTER -> LOGIN
    // =========================================================

    if (loginLink) {

        loginLink.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                showLoginForm();

            }
        );

    }


    // =========================================================
    // CLOSE BUTTON
    // =========================================================

    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closePopup
        );

    }


    // =========================================================
    // CLICK BACKDROP
    // =========================================================

    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closePopup
        );

    }


    // =========================================================
    // ESCAPE CLOSE POPUP
    // =========================================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closePopup();

            }

        }
    );


    // =========================================================
    // REGISTER
    // =========================================================

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const fullName =
                    document
                        .getElementById(
                            "regUsername"
                        )
                        ?.value
                        .trim();


                const email =
                    document
                        .getElementById(
                            "regEmail"
                        )
                        ?.value
                        .trim();


                const phone =
                    document
                        .getElementById(
                            "regPhone"
                        )
                        ?.value
                        .trim();


                const password =
                    document
                        .getElementById(
                            "regPassword"
                        )
                        ?.value;


                const terms =
                    document
                        .getElementById(
                            "termsCheckbox"
                        )
                        ?.checked;


                // -----------------------------------------
                // VALIDATION
                // -----------------------------------------

                if (
                    !fullName ||
                    !email ||
                    !phone ||
                    !password
                ) {

                    alert(
                        "Please fill all fields."
                    );

                    return;

                }


                if (
                    !/^\d{10}$/.test(
                        phone
                    )
                ) {

                    alert(
                        "Phone number must be 10 digits."
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


                if (!terms) {

                    alert(
                        "Please accept the terms and conditions."
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
                                    JSON.stringify(
                                        {
                                            full_name:
                                                fullName,

                                            email:
                                                email,

                                            phone:
                                                phone,

                                            password:
                                                password
                                        }
                                    )
                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "Register Response:",
                        data
                    );


                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Registration failed."
                        );

                        return;

                    }


                    alert(
                        data.message ||
                        "Registration successful. Please login."
                    );


                    registerForm.reset();


                    showLoginForm();

                }
                catch (error) {

                    console.error(
                        "Registration Error:",
                        error
                    );


                    alert(
                        "Unable to connect to server."
                    );

                }

            }
        );

    }


    // =========================================================
    // LOGIN
    // =========================================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const email =
                    document
                        .getElementById(
                            "loginEmail"
                        )
                        ?.value
                        .trim();


                const password =
                    document
                        .getElementById(
                            "loginPassword"
                        )
                        ?.value;


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
                                    JSON.stringify(
                                        {
                                            email:
                                                email,

                                            password:
                                                password
                                        }
                                    )
                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "Login Response:",
                        data
                    );


                    // -----------------------------------------
                    // LOGIN FAILED
                    // -----------------------------------------

                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Login failed."
                        );

                        return;

                    }


                    // -----------------------------------------
                    // CHECK TOKEN + USER
                    // -----------------------------------------

                    if (
                        !data.token ||
                        !data.user
                    ) {

                        console.error(
                            "Invalid login response:",
                            data
                        );


                        alert(
                            "Login response is missing token or user."
                        );

                        return;

                    }


                    // -----------------------------------------
                    // CREATE CURRENT USER
                    // -----------------------------------------

                    const loggedInUser = {

                        id:
                            data.user.id,

                        full_name:
                            data.user.full_name ||
                            data.user.fullName ||
                            data.user.username ||
                            "",

                        username:
                            data.user.username ||
                            data.user.full_name ||
                            "",

                        email:
                            data.user.email ||
                            email,

                        phone:
                            data.user.phone ||
                            "",

                        role:
                            data.user.role ||
                            "user",

                        profile_image:
                            data.user.profile_image ||
                            data.user.profileImage ||
                            null

                    };


                    // -----------------------------------------
                    // SAVE LOGIN
                    // -----------------------------------------

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


                    console.log(
                        "Token saved:",
                        localStorage.getItem(
                            "token"
                        )
                    );


                    console.log(
                        "Current User:",
                        getCurrentUser()
                    );


                    // -----------------------------------------
                    // UPDATE NAVBAR IMMEDIATELY
                    // -----------------------------------------

                    updateNavbar();


                    // -----------------------------------------
                    // CLOSE LOGIN
                    // -----------------------------------------

                    closePopup();


                    loginForm.reset();


                    alert(
                        "Login successful!"
                    );


                    // -----------------------------------------
                    // ADMIN
                    // -----------------------------------------

                    if (
                        String(
                            loggedInUser.role
                        ).toLowerCase()
                        === "admin"
                    ) {

                        window.location.href =
                            "admin.html";

                        return;

                    }


                    // -----------------------------------------
                    // NORMAL USER
                    // -----------------------------------------

                    window.location.href =
                        "index.html";

                }
                catch (error) {

                    console.error(
                        "Login Error:",
                        error
                    );


                    alert(
                        "Unable to connect to server."
                    );

                }

            }
        );

    }


    // =========================================================
    // LOGOUT
    // =========================================================

    if (logout) {

        logout.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


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


    // =========================================================
    // STATIONS
    // =========================================================

    const stations = [

        {
            name: "New Delhi",
            code: "NDLS"
        },

        {
            name: "Delhi Junction",
            code: "DLI"
        },

        {
            name: "Delhi Cantt",
            code: "DEC"
        },

        {
            name: "Mumbai Central",
            code: "MMCT"
        },

        {
            name: "Mumbai CSMT",
            code: "CSMT"
        },

        {
            name: "Bandra Terminus",
            code: "BDTS"
        },

        {
            name: "Ahmedabad Junction",
            code: "ADI"
        },

        {
            name: "Surat",
            code: "ST"
        },

        {
            name: "Vadodara Junction",
            code: "BRC"
        },

        {
            name: "Rajkot Junction",
            code: "RJT"
        },

        {
            name: "Veraval",
            code: "VRL"
        },

        {
            name: "Junagadh Junction",
            code: "JND"
        },

        {
            name: "Somnath",
            code: "SMNH"
        },

        {
            name: "Jaipur Junction",
            code: "JP"
        },

        {
            name: "Kota Junction",
            code: "KOTA"
        },

        {
            name: "Howrah Junction",
            code: "HWH"
        },

        {
            name: "Sealdah",
            code: "SDAH"
        },

        {
            name: "Chennai Central",
            code: "MAS"
        },

        {
            name: "Bengaluru City Junction",
            code: "SBC"
        },

        {
            name: "Hyderabad Deccan",
            code: "HYB"
        },

        {
            name: "Pune Junction",
            code: "PUNE"
        },

        {
            name: "Nagpur Junction",
            code: "NGP"
        },

        {
            name: "Lucknow",
            code: "LKO"
        },

        {
            name: "Kanpur Central",
            code: "CNB"
        },

        {
            name: "Varanasi Junction",
            code: "BSB"
        },

        {
            name: "Bhopal Junction",
            code: "BPL"
        },

        {
            name: "Indore Junction",
            code: "INDB"
        }

    ];


    // =========================================================
    // STATION AUTOCOMPLETE
    // =========================================================

    function setupStationSuggestions(
        input
    ) {

        if (!input) return;


        const parent =
            input.parentElement;


        if (!parent) return;


        parent.style.position =
            "relative";


        const suggestionBox =
            document.createElement(
                "div"
            );


        suggestionBox.className =
            "station-suggestions";


        parent.appendChild(
            suggestionBox
        );


        // =====================================================
        // CLOSE
        // =====================================================

        function closeSuggestions() {

            suggestionBox.style.display =
                "none";

        }


        // =====================================================
        // SELECT STATION
        // =====================================================

        function selectStation(
            station
        ) {

            input.value =
                `${station.name} (${station.code})`;


            input.dataset.stationName =
                station.name;


            input.dataset.stationCode =
                station.code;


            closeSuggestions();

        }


        // =====================================================
        // DISPLAY STATIONS
        // =====================================================

        function displayStations(
            searchValue = ""
        ) {

            const search =
                searchValue
                    .trim()
                    .toLowerCase();


            let filteredStations;


            if (!search) {

                filteredStations =
                    stations.slice(
                        0,
                        8
                    );

            }
            else {

                filteredStations =
                    stations.filter(
                        (station) => {

                            return (
                                station.name
                                    .toLowerCase()
                                    .includes(
                                        search
                                    ) ||

                                station.code
                                    .toLowerCase()
                                    .includes(
                                        search
                                    )
                            );

                        }
                    ).slice(
                        0,
                        8
                    );

            }


            suggestionBox.innerHTML =
                "";


            // -----------------------------------------
            // NO RESULT
            // -----------------------------------------

            if (
                filteredStations.length ===
                0
            ) {

                suggestionBox.innerHTML = `

                    <div class="station-no-result">

                        <i class="fa-solid fa-circle-exclamation"></i>

                        No station found

                    </div>

                `;


                suggestionBox.style.display =
                    "block";


                return;

            }


            // -----------------------------------------
            // TITLE
            // -----------------------------------------

            const title =
                document.createElement(
                    "div"
                );


            title.className =
                "station-suggestion-title";


            title.textContent =
                search
                    ?
                    "Station Suggestions"
                    :
                    "Popular Stations";


            suggestionBox.appendChild(
                title
            );


            // -----------------------------------------
            // ITEMS
            // -----------------------------------------

            filteredStations.forEach(
                (station) => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "station-suggestion-item";


                    item.innerHTML = `

                        <div class="station-icon">

                            <i class="fa-solid fa-train"></i>

                        </div>


                        <div class="station-details">

                            <div class="station-name">

                                ${station.name}

                            </div>


                            <div class="station-code">

                                ${station.code}

                            </div>

                        </div>

                    `;


                    item.addEventListener(
                        "mousedown",
                        (event) => {

                            event.preventDefault();

                            selectStation(
                                station
                            );

                        }
                    );


                    suggestionBox.appendChild(
                        item
                    );

                }
            );


            suggestionBox.style.display =
                "block";

        }


        // =====================================================
        // INPUT
        // =====================================================

        input.addEventListener(
            "input",
            () => {

                // User manually changed station
                delete input.dataset
                    .stationName;

                delete input.dataset
                    .stationCode;


                displayStations(
                    input.value
                );

            }
        );


        // =====================================================
        // FOCUS
        // =====================================================

        input.addEventListener(
            "focus",
            () => {

                displayStations(
                    input.value
                );

            }
        );


        // =====================================================
        // KEYBOARD
        // =====================================================

        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeSuggestions();

                }

            }
        );


        return {
            closeSuggestions
        };

    }


    // =========================================================
    // ENABLE STATION AUTOCOMPLETE
    // =========================================================

    const fromSuggestions =
        setupStationSuggestions(
            fromInput
        );


    const toSuggestions =
        setupStationSuggestions(
            toInput
        );


    // =========================================================
    // CLOSE STATION LIST
    // =========================================================

    document.addEventListener(
        "click",
        (event) => {

            if (
                fromInput &&
                !fromInput.parentElement.contains(
                    event.target
                )
            ) {

                fromSuggestions
                    ?.closeSuggestions();

            }


            if (
                toInput &&
                !toInput.parentElement.contains(
                    event.target
                )
            ) {

                toSuggestions
                    ?.closeSuggestions();

            }

        }
    );


    // =========================================================
    // FLATPICKR DATE
    // =========================================================

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
                    "today",

                allowInput:
                    true

            }
        );

    }


    // =========================================================
    // SWAP FROM / TO
    // =========================================================

    if (
        swapButton &&
        fromInput &&
        toInput
    ) {

        swapButton.addEventListener(
            "click",
            () => {

                // -----------------------------------------
                // VISIBLE VALUES
                // -----------------------------------------

                const fromValue =
                    fromInput.value;

                const toValue =
                    toInput.value;


                fromInput.value =
                    toValue;

                toInput.value =
                    fromValue;


                // -----------------------------------------
                // STATION NAMES
                // -----------------------------------------

                const fromStationName =
                    fromInput.dataset
                        .stationName ||
                    "";

                const toStationName =
                    toInput.dataset
                        .stationName ||
                    "";


                if (toStationName) {

                    fromInput.dataset
                        .stationName =
                        toStationName;

                }
                else {

                    delete fromInput
                        .dataset
                        .stationName;

                }


                if (fromStationName) {

                    toInput.dataset
                        .stationName =
                        fromStationName;

                }
                else {

                    delete toInput
                        .dataset
                        .stationName;

                }


                // -----------------------------------------
                // STATION CODES
                // -----------------------------------------

                const fromStationCode =
                    fromInput.dataset
                        .stationCode ||
                    "";

                const toStationCode =
                    toInput.dataset
                        .stationCode ||
                    "";


                if (toStationCode) {

                    fromInput.dataset
                        .stationCode =
                        toStationCode;

                }
                else {

                    delete fromInput
                        .dataset
                        .stationCode;

                }


                if (fromStationCode) {

                    toInput.dataset
                        .stationCode =
                        fromStationCode;

                }
                else {

                    delete toInput
                        .dataset
                        .stationCode;

                }

            }
        );

    }


    // =========================================================
    // SEARCH TRAIN
    // =========================================================

    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const from =
                    fromInput
                        ?
                        (
                            fromInput.dataset
                                .stationName ||
                            fromInput.value.trim()
                        )
                        :
                        "";


                const to =
                    toInput
                        ?
                        (
                            toInput.dataset
                                .stationName ||
                            toInput.value.trim()
                        )
                        :
                        "";


                const fromCode =
                    fromInput
                        ?
                        (
                            fromInput.dataset
                                .stationCode ||
                            ""
                        )
                        :
                        "";


                const toCode =
                    toInput
                        ?
                        (
                            toInput.dataset
                                .stationCode ||
                            ""
                        )
                        :
                        "";


                const date =
                    dateInput
                        ?
                        dateInput.value.trim()
                        :
                        "";


                const trainClass =
                    classSelect
                        ?
                        classSelect.value
                        :
                        "ALL CLASSES";


                // -----------------------------------------
                // VALIDATION
                // -----------------------------------------

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


                // -----------------------------------------
                // REDIRECT TO SEARCH PAGE
                // -----------------------------------------

                window.location.href =
                    `search.html?from=${encodeURIComponent(from)}` +
                    `&to=${encodeURIComponent(to)}` +
                    `&fromCode=${encodeURIComponent(fromCode)}` +
                    `&toCode=${encodeURIComponent(toCode)}` +
                    `&date=${encodeURIComponent(date)}` +
                    `&class=${encodeURIComponent(trainClass)}`;

            }
        );

    }


    // =========================================================
    // STORAGE CHANGE
    // =========================================================
    // Useful if login state changes from another browser tab.

    window.addEventListener(
        "storage",
        (event) => {

            if (
                event.key === "token" ||
                event.key ===
                    "currentUser" ||
                event.key ===
                    "isLoggedIn"
            ) {

                updateNavbar();

            }

        }
    );


});