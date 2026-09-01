document.addEventListener("DOMContentLoaded", async () => {

    // =====================================================
    // API BASE URL
    // =====================================================

    const API_BASE =
        "http://localhost:5000/api/admin";


    // =====================================================
    // ELEMENTS
    // =====================================================

    const adminName =
        document.getElementById("adminName");

    const adminEmail =
        document.getElementById("adminEmail");

    const adminLogoutBtn =
        document.getElementById("adminLogoutBtn");

    const totalUsersEl =
        document.getElementById("totalUsers");

    const totalTrainsEl =
        document.getElementById("totalTrains");

    const totalBookingsEl =
        document.getElementById("totalBookings");

    const totalRevenueEl =
        document.getElementById("totalRevenue");

    const confirmedBookingsEl =
        document.getElementById("confirmedBookings");

    const usersTableBody =
        document.getElementById("usersTableBody");

    const trainsTableBody =
        document.getElementById("trainsTableBody");

    const bookingsTableBody =
        document.getElementById("bookingsTableBody");

    const refreshUsersBtn =
        document.getElementById("refreshUsersBtn");

    const refreshBookingsBtn =
        document.getElementById("refreshBookingsBtn");

    const addTrainBtn =
        document.getElementById("addTrainBtn");

    const trainForm =
        document.getElementById("trainForm");

    const trainModalTitle =
        document.getElementById("trainModalTitle");

    const trainModalElement =
        document.getElementById("trainModal");


    // =====================================================
    // TRAIN FORM ELEMENTS
    // =====================================================

    const trainIdInput =
        document.getElementById("trainId");

    const trainNumberInput =
        document.getElementById("trainNumber");

    const trainNameInput =
        document.getElementById("trainName");

    const trainSourceInput =
        document.getElementById("trainSource");

    const trainDestinationInput =
        document.getElementById("trainDestination");

    const departureTimeInput =
        document.getElementById("departureTime");

    const arrivalTimeInput =
        document.getElementById("arrivalTime");

    const trainDurationInput =
        document.getElementById("trainDuration");

    const availableSeatsInput =
        document.getElementById("availableSeats");

    const trainFareInput =
        document.getElementById("trainFare");


    // =====================================================
    // TOKEN
    // =====================================================

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please login as an admin."
        );

        window.location.href =
            "index.html";

        return;
    }


    // =====================================================
    // CURRENT USER
    // =====================================================

    let currentUser = null;


    try {

        currentUser =
            JSON.parse(
                localStorage.getItem(
                    "currentUser"
                )
            );

    }
    catch (error) {

        currentUser = null;
    }


    // =====================================================
    // ADMIN DISPLAY
    // =====================================================

    if (currentUser) {

        if (adminName) {

            adminName.textContent =
                currentUser.full_name ||
                currentUser.username ||
                "Admin";

        }


        if (adminEmail) {

            adminEmail.textContent =
                currentUser.email ||
                "-";

        }

    }


    // =====================================================
    // CLEAR SESSION
    // =====================================================

    function clearSession() {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "currentUser"
        );

        localStorage.removeItem(
            "isLoggedIn"
        );

    }


    // =====================================================
    // COMMON API REQUEST
    // =====================================================

    async function apiRequest(
        url,
        options = {}
    ) {

        const requestOptions = {

            ...options,

            headers: {

                ...(options.headers || {}),

                "Authorization":
                    `Bearer ${token}`

            }

        };


        const response =
            await fetch(
                url,
                requestOptions
            );


        let data = {};


        try {

            data =
                await response.json();

        }
        catch (error) {

            data = {};
        }


        // =====================================================
        // UNAUTHORIZED
        // =====================================================

        if (
            response.status === 401
        ) {

            clearSession();


            alert(
                data.message ||
                "Session expired. Please login again."
            );


            window.location.href =
                "index.html";


            throw new Error(
                data.message ||
                "Unauthorized"
            );

        }


        // =====================================================
        // NOT ADMIN
        // =====================================================

        if (
            response.status === 403
        ) {

            alert(
                data.message ||
                "Admin access required."
            );


            window.location.href =
                "index.html";


            throw new Error(
                data.message ||
                "Forbidden"
            );

        }


        // =====================================================
        // API ERROR
        // =====================================================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "API request failed"
            );

        }


        return data;
    }


    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    async function loadDashboard() {

        try {

            const data =
                await apiRequest(
                    `${API_BASE}/dashboard`
                );


            const dashboard =
                data.dashboard || {};


            if (totalUsersEl) {

                totalUsersEl.textContent =
                    dashboard.totalUsers ?? 0;

            }


            if (totalTrainsEl) {

                totalTrainsEl.textContent =
                    dashboard.totalTrains ?? 0;

            }


            if (totalBookingsEl) {

                totalBookingsEl.textContent =
                    dashboard.totalBookings ?? 0;

            }


            if (confirmedBookingsEl) {

                confirmedBookingsEl.textContent =
                    dashboard.confirmedBookings ?? 0;

            }


            if (totalRevenueEl) {

                totalRevenueEl.textContent =
                    `₹${Number(
                        dashboard.totalRevenue || 0
                    ).toFixed(2)}`;

            }

        }
        catch (error) {

            console.error(
                "Load Dashboard Error:",
                error
            );

        }

    }


    // =====================================================
    // LOAD USERS
    // =====================================================

    async function loadUsers() {

        if (!usersTableBody) {

            return;
        }


        usersTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center">

                    Loading users...

                </td>

            </tr>

        `;


        try {

            const data =
                await apiRequest(
                    `${API_BASE}/users`
                );


            const users =
                Array.isArray(data.users)
                    ? data.users
                    : [];


            if (
                users.length === 0
            ) {

                usersTableBody.innerHTML = `

                    <tr>

                        <td
                            colspan="8"
                            class="text-center text-muted">

                            No users found.

                        </td>

                    </tr>

                `;

                return;
            }


            usersTableBody.innerHTML =
                "";


            users.forEach(user => {

                const role =
                    user.role ||
                    "user";


                const roleClass =
                    role === "admin"
                        ? "role-admin"
                        : "role-user";


                const isCurrentUser =
                    currentUser &&
                    Number(
                        currentUser.id
                    ) ===
                    Number(
                        user.id
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${escapeHtml(user.id)}
                    </td>


                    <td>
                        ${escapeHtml(
                            user.full_name ||
                            "-"
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            user.email ||
                            "-"
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            user.phone ||
                            "-"
                        )}
                    </td>


                    <td>

                        <span
                            class="role-badge ${roleClass}">

                            ${escapeHtml(role)}

                        </span>

                    </td>


                    <td>
                        ${escapeHtml(
                            user.address ||
                            "-"
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            formatDate(
                                user.dob
                            )
                        )}
                    </td>


                    <td>

                        <button
                            type="button"
                            class="btn btn-sm btn-warning change-role-btn me-1"
                            ${isCurrentUser ? "disabled" : ""}>

                            Role

                        </button>


                        <button
                            type="button"
                            class="btn btn-sm btn-danger delete-user-btn"
                            ${isCurrentUser ? "disabled" : ""}>

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                `;


                // =====================================================
                // CHANGE USER ROLE
                // =====================================================

                const changeRoleBtn =
                    row.querySelector(
                        ".change-role-btn"
                    );


                if (
                    changeRoleBtn &&
                    !isCurrentUser
                ) {

                    changeRoleBtn.addEventListener(
                        "click",
                        async () => {

                            const newRole =
                                role === "admin"
                                    ? "user"
                                    : "admin";


                            const confirmed =
                                confirm(
                                    `Change ${user.full_name} role from ${role} to ${newRole}?`
                                );


                            if (!confirmed) {

                                return;
                            }


                            try {

                                changeRoleBtn.disabled =
                                    true;


                                await apiRequest(

                                    `${API_BASE}/users/${encodeURIComponent(user.id)}/role`,

                                    {

                                        method:
                                            "PUT",

                                        headers: {

                                            "Content-Type":
                                                "application/json"

                                        },

                                        body:
                                            JSON.stringify({

                                                role:
                                                    newRole

                                            })

                                    }

                                );


                                alert(
                                    "User role updated successfully!"
                                );


                                await Promise.all([

                                    loadUsers(),

                                    loadDashboard()

                                ]);

                            }
                            catch (error) {

                                console.error(
                                    "Change Role Error:",
                                    error
                                );


                                alert(
                                    error.message ||
                                    "Unable to update user role."
                                );


                                changeRoleBtn.disabled =
                                    false;

                            }

                        }
                    );

                }


                // =====================================================
                // DELETE USER
                // =====================================================

                const deleteUserBtn =
                    row.querySelector(
                        ".delete-user-btn"
                    );


                if (
                    deleteUserBtn &&
                    !isCurrentUser
                ) {

                    deleteUserBtn.addEventListener(
                        "click",
                        async () => {

                            const confirmed =
                                confirm(
                                    `Delete user ${user.full_name} (${user.email})?`
                                );


                            if (!confirmed) {

                                return;
                            }


                            try {

                                deleteUserBtn.disabled =
                                    true;


                                await apiRequest(

                                    `${API_BASE}/users/${encodeURIComponent(user.id)}`,

                                    {
                                        method:
                                            "DELETE"
                                    }

                                );


                                alert(
                                    "User deleted successfully!"
                                );


                                await Promise.all([

                                    loadUsers(),

                                    loadDashboard()

                                ]);

                            }
                            catch (error) {

                                console.error(
                                    "Delete User Error:",
                                    error
                                );


                                alert(
                                    error.message ||
                                    "Unable to delete user."
                                );


                                deleteUserBtn.disabled =
                                    false;

                            }

                        }
                    );

                }


                usersTableBody.appendChild(
                    row
                );

            });

        }
        catch (error) {

            console.error(
                "Load Users Error:",
                error
            );


            usersTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        class="text-center text-danger">

                        ${escapeHtml(
                            error.message
                        )}

                    </td>

                </tr>

            `;

        }

    }


    // =====================================================
    // LOAD TRAINS
    // =====================================================

    async function loadTrains() {

        if (!trainsTableBody) {

            return;
        }


        trainsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    class="text-center">

                    Loading trains...

                </td>

            </tr>

        `;


        try {

            const data =
                await apiRequest(
                    `${API_BASE}/trains`
                );


            const trains =
                Array.isArray(data.trains)
                    ? data.trains
                    : [];


            if (
                trains.length === 0
            ) {

                trainsTableBody.innerHTML = `

                    <tr>

                        <td
                            colspan="10"
                            class="text-center text-muted">

                            No trains found.

                        </td>

                    </tr>

                `;

                return;
            }


            trainsTableBody.innerHTML =
                "";


            trains.forEach(train => {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${escapeHtml(train.id)}
                    </td>


                    <td>

                        <strong>

                            ${escapeHtml(
                                train.train_number ||
                                "-"
                            )}

                        </strong>

                    </td>


                    <td>
                        ${escapeHtml(
                            train.train_name ||
                            "-"
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            train.source ||
                            "-"
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            train.destination ||
                            "-"
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            normalizeDisplayTime(
                                train.departure_time
                            )
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            normalizeDisplayTime(
                                train.arrival_time
                            )
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            train.available_seats ?? 0
                        )}
                    </td>


                    <td>

                        ₹${Number(
                            train.fare || 0
                        ).toFixed(2)}

                    </td>


                    <td>

                        <button
                            type="button"
                            class="btn btn-sm btn-warning edit-train-btn me-1">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="btn btn-sm btn-danger delete-train-btn">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                `;


                // =====================================================
                // EDIT TRAIN
                // =====================================================

                const editButton =
                    row.querySelector(
                        ".edit-train-btn"
                    );


                if (editButton) {

                    editButton.addEventListener(
                        "click",
                        () => {

                            openEditTrainModal(
                                train
                            );

                        }
                    );

                }


                // =====================================================
                // DELETE TRAIN
                // =====================================================

                const deleteButton =
                    row.querySelector(
                        ".delete-train-btn"
                    );


                if (deleteButton) {

                    deleteButton.addEventListener(
                        "click",
                        () => {

                            deleteTrain(
                                train,
                                deleteButton
                            );

                        }
                    );

                }


                trainsTableBody.appendChild(
                    row
                );

            });

        }
        catch (error) {

            console.error(
                "Load Trains Error:",
                error
            );


            trainsTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="10"
                        class="text-center text-danger">

                        ${escapeHtml(
                            error.message
                        )}

                    </td>

                </tr>

            `;

        }

    }


    // =====================================================
    // RESET TRAIN FORM
    // =====================================================

    function resetTrainForm() {

        if (trainForm) {

            trainForm.reset();

        }


        if (trainIdInput) {

            trainIdInput.value =
                "";

        }


        if (trainModalTitle) {

            trainModalTitle.textContent =
                "Add Train";

        }

    }


    // =====================================================
    // ADD TRAIN BUTTON
    // =====================================================

    if (addTrainBtn) {

        addTrainBtn.addEventListener(
            "click",
            () => {

                resetTrainForm();

            }
        );

    }


    // =====================================================
    // OPEN EDIT TRAIN MODAL
    // =====================================================

    function openEditTrainModal(
        train
    ) {

        if (trainModalTitle) {

            trainModalTitle.textContent =
                "Edit Train";

        }


        if (trainIdInput) {

            trainIdInput.value =
                train.id ?? "";

        }


        if (trainNumberInput) {

            trainNumberInput.value =
                train.train_number ||
                "";

        }


        if (trainNameInput) {

            trainNameInput.value =
                train.train_name ||
                "";

        }


        if (trainSourceInput) {

            trainSourceInput.value =
                train.source ||
                "";

        }


        if (trainDestinationInput) {

            trainDestinationInput.value =
                train.destination ||
                "";

        }


        if (departureTimeInput) {

            departureTimeInput.value =
                normalizeTime(
                    train.departure_time
                );

        }


        if (arrivalTimeInput) {

            arrivalTimeInput.value =
                normalizeTime(
                    train.arrival_time
                );

        }


        if (trainDurationInput) {

            trainDurationInput.value =
                train.duration ||
                "";

        }


        if (availableSeatsInput) {

            availableSeatsInput.value =
                train.available_seats ?? 0;

        }


        if (trainFareInput) {

            trainFareInput.value =
                train.fare ?? 0;

        }


        if (
            trainModalElement &&
            typeof bootstrap !==
            "undefined"
        ) {

            const modal =
                bootstrap.Modal
                    .getOrCreateInstance(
                        trainModalElement
                    );


            modal.show();

        }

    }


    // =====================================================
    // SAVE TRAIN
    // =====================================================

    if (trainForm) {

        trainForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const trainId =
                    trainIdInput
                        ? trainIdInput.value.trim()
                        : "";


                // =====================================================
                // FORM VALIDATION
                // =====================================================

                if (
                    !trainNumberInput ||
                    !trainNameInput ||
                    !trainSourceInput ||
                    !trainDestinationInput ||
                    !departureTimeInput ||
                    !arrivalTimeInput ||
                    !trainDurationInput ||
                    !availableSeatsInput ||
                    !trainFareInput
                ) {

                    alert(
                        "Train form fields are missing."
                    );

                    return;
                }


                const payload = {

                    train_number:
                        trainNumberInput.value.trim(),

                    train_name:
                        trainNameInput.value.trim(),

                    source:
                        trainSourceInput.value.trim(),

                    destination:
                        trainDestinationInput.value.trim(),

                    departure_time:
                        departureTimeInput.value,

                    arrival_time:
                        arrivalTimeInput.value,

                    duration:
                        trainDurationInput.value.trim(),

                    available_seats:
                        Number(
                            availableSeatsInput.value
                        ),

                    fare:
                        Number(
                            trainFareInput.value
                        )

                };


                if (
                    !payload.train_number ||
                    !payload.train_name ||
                    !payload.source ||
                    !payload.destination ||
                    !payload.departure_time ||
                    !payload.arrival_time ||
                    !payload.duration
                ) {

                    alert(
                        "Please fill all train fields."
                    );

                    return;
                }


                if (
                    payload.source.toLowerCase() ===
                    payload.destination.toLowerCase()
                ) {

                    alert(
                        "Source and destination cannot be the same."
                    );

                    return;
                }


                if (
                    !Number.isFinite(
                        payload.available_seats
                    ) ||
                    payload.available_seats < 0
                ) {

                    alert(
                        "Available seats must be a valid number."
                    );

                    return;
                }


                if (
                    !Number.isFinite(
                        payload.fare
                    ) ||
                    payload.fare <= 0
                ) {

                    alert(
                        "Fare must be greater than 0."
                    );

                    return;
                }


                const saveTrainBtn =
                    document.getElementById(
                        "saveTrainBtn"
                    );


                if (saveTrainBtn) {

                    saveTrainBtn.disabled =
                        true;

                    saveTrainBtn.textContent =
                        "Saving...";

                }


                try {

                    // =====================================================
                    // UPDATE TRAIN
                    // =====================================================

                    if (trainId) {

                        await apiRequest(

                            `${API_BASE}/trains/${encodeURIComponent(trainId)}`,

                            {

                                method:
                                    "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        payload
                                    )

                            }

                        );


                        alert(
                            "Train updated successfully!"
                        );

                    }

                    // =====================================================
                    // ADD TRAIN
                    // =====================================================

                    else {

                        await apiRequest(

                            `${API_BASE}/trains`,

                            {

                                method:
                                    "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify(
                                        payload
                                    )

                            }

                        );


                        alert(
                            "Train added successfully!"
                        );

                    }


                    // =====================================================
                    // CLOSE MODAL
                    // =====================================================

                    if (
                        trainModalElement &&
                        typeof bootstrap !==
                        "undefined"
                    ) {

                        const modal =
                            bootstrap.Modal
                                .getOrCreateInstance(
                                    trainModalElement
                                );


                        modal.hide();

                    }


                    resetTrainForm();


                    await Promise.all([

                        loadTrains(),

                        loadDashboard()

                    ]);

                }
                catch (error) {

                    console.error(
                        "Save Train Error:",
                        error
                    );


                    alert(
                        error.message ||
                        "Unable to save train."
                    );

                }
                finally {

                    if (saveTrainBtn) {

                        saveTrainBtn.disabled =
                            false;

                        saveTrainBtn.textContent =
                            "Save Train";

                    }

                }

            }
        );

    }


    // =====================================================
    // DELETE TRAIN
    // =====================================================

    async function deleteTrain(
        train,
        button
    ) {

        const confirmed =
            confirm(
                `Delete train ${train.train_number} - ${train.train_name}?`
            );


        if (!confirmed) {

            return;
        }


        try {

            if (button) {

                button.disabled =
                    true;

            }


            await apiRequest(

                `${API_BASE}/trains/${encodeURIComponent(train.id)}`,

                {
                    method:
                        "DELETE"
                }

            );


            alert(
                "Train deleted successfully!"
            );


            await Promise.all([

                loadTrains(),

                loadDashboard()

            ]);

        }
        catch (error) {

            console.error(
                "Delete Train Error:",
                error
            );


            alert(
                error.message ||
                "Unable to delete train."
            );


            if (button) {

                button.disabled =
                    false;

            }

        }

    }


    // =====================================================
    // LOAD BOOKINGS
    // =====================================================

    async function loadBookings() {

        if (!bookingsTableBody) {

            return;
        }


        bookingsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    class="text-center">

                    Loading bookings...

                </td>

            </tr>

        `;


        try {

            const data =
                await apiRequest(
                    `${API_BASE}/bookings`
                );


            const bookings =
                Array.isArray(data.bookings)
                    ? data.bookings
                    : [];


            if (
                bookings.length === 0
            ) {

                bookingsTableBody.innerHTML = `

                    <tr>

                        <td
                            colspan="10"
                            class="text-center text-muted">

                            No bookings found.

                        </td>

                    </tr>

                `;

                return;
            }


            bookingsTableBody.innerHTML =
                "";


            bookings.forEach(booking => {

                const bookingStatus =
                    booking.booking_status ||
                    "Confirmed";


                const isCancelled =
                    String(
                        bookingStatus
                    ).toLowerCase() ===
                    "cancelled";


                const statusClass =
                    isCancelled
                        ? "bg-danger text-white"
                        : "status-confirmed";


                const actionText =
                    isCancelled
                        ? "Confirm"
                        : "Cancel";


                const actionClass =
                    isCancelled
                        ? "btn-success"
                        : "btn-danger";


                const actionIcon =
                    isCancelled
                        ? "fa-check"
                        : "fa-ban";


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${escapeHtml(
                            booking.id
                        )}
                    </td>


                    <td>

                        <strong>

                            ${escapeHtml(
                                booking.user_name ||
                                "-"
                            )}

                        </strong>

                        <br>

                        <small
                            class="text-muted">

                            ${escapeHtml(
                                booking.user_email ||
                                "-"
                            )}

                        </small>

                    </td>


                    <td>

                        ${escapeHtml(
                            booking.pnr ||
                            "-"
                        )}

                    </td>


                    <td>

                        ${escapeHtml(
                            booking.train_no ||
                            "-"
                        )}

                        <br>

                        <small>

                            ${escapeHtml(
                                booking.train_name ||
                                "-"
                            )}

                        </small>

                    </td>


                    <td>

                        ${escapeHtml(
                            booking.source ||
                            "-"
                        )}

                        →

                        ${escapeHtml(
                            booking.destination ||
                            "-"
                        )}

                    </td>


                    <td>

                        ${escapeHtml(
                            booking.passenger_name ||
                            "-"
                        )}

                    </td>


                    <td>

                        ₹${Number(
                            booking.fare || 0
                        ).toFixed(2)}

                    </td>


                    <td>

                        <span
                            class="status-badge status-paid">

                            ${escapeHtml(
                                booking.payment_status ||
                                "-"
                            )}

                        </span>

                    </td>


                    <td>

                        <span
                            class="status-badge ${statusClass}">

                            ${escapeHtml(
                                bookingStatus
                            )}

                        </span>

                    </td>


                    <td>

                        <button
                            type="button"
                            class="btn btn-sm ${actionClass} booking-status-btn">

                            <i
                                class="fa-solid ${actionIcon}">
                            </i>

                            ${actionText}

                        </button>

                    </td>

                `;


                // =====================================================
                // CHANGE BOOKING STATUS
                // =====================================================

                const statusButton =
                    row.querySelector(
                        ".booking-status-btn"
                    );


                if (statusButton) {

                    statusButton.addEventListener(
                        "click",
                        async () => {

                            const newStatus =
                                isCancelled
                                    ? "Confirmed"
                                    : "Cancelled";


                            const confirmed =
                                confirm(
                                    `Change booking ${booking.pnr} from ${bookingStatus} to ${newStatus}?`
                                );


                            if (!confirmed) {

                                return;
                            }


                            try {

                                statusButton.disabled =
                                    true;


                                await apiRequest(

                                    `${API_BASE}/bookings/${encodeURIComponent(booking.id)}/status`,

                                    {

                                        method:
                                            "PUT",

                                        headers: {

                                            "Content-Type":
                                                "application/json"

                                        },

                                        body:
                                            JSON.stringify({

                                                booking_status:
                                                    newStatus

                                            })

                                    }

                                );


                                alert(
                                    `Booking ${newStatus} successfully!`
                                );


                                await Promise.all([

                                    loadBookings(),

                                    loadDashboard()

                                ]);

                            }
                            catch (error) {

                                console.error(
                                    "Booking Status Error:",
                                    error
                                );


                                alert(
                                    error.message ||
                                    "Unable to update booking status."
                                );


                                statusButton.disabled =
                                    false;

                            }

                        }
                    );

                }


                bookingsTableBody.appendChild(
                    row
                );

            });

        }
        catch (error) {

            console.error(
                "Load Bookings Error:",
                error
            );


            bookingsTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="10"
                        class="text-center text-danger">

                        ${escapeHtml(
                            error.message
                        )}

                    </td>

                </tr>

            `;

        }

    }


    // =====================================================
    // REFRESH USERS
    // =====================================================

    if (refreshUsersBtn) {

        refreshUsersBtn.addEventListener(
            "click",
            async () => {

                await Promise.all([

                    loadUsers(),

                    loadDashboard()

                ]);

            }
        );

    }


    // =====================================================
    // REFRESH BOOKINGS
    // =====================================================

    if (refreshBookingsBtn) {

        refreshBookingsBtn.addEventListener(
            "click",
            async () => {

                await Promise.all([

                    loadBookings(),

                    loadDashboard()

                ]);

            }
        );

    }


    // =====================================================
    // LOGOUT
    // =====================================================

    if (adminLogoutBtn) {

        adminLogoutBtn.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmed) {

                    return;
                }


                clearSession();


                window.location.href =
                    "index.html";

            }
        );

    }


    // =====================================================
    // FORMAT DATE
    // =====================================================

    function formatDate(value) {

        if (!value) {

            return "-";
        }


        const date =
            new Date(value);


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return String(
                value
            );

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


    // =====================================================
    // NORMALIZE MYSQL TIME FOR INPUT
    // =====================================================

    function normalizeTime(value) {

        if (!value) {

            return "";
        }


        const time =
            String(
                value
            ).trim();


        const match =
            time.match(
                /^(\d{2}):(\d{2})(?::(\d{2}))?/
            );


        if (!match) {

            return "";
        }


        return `${match[1]}:${match[2]}:${match[3] || "00"}`;
    }


    // =====================================================
    // NORMALIZE TIME FOR TABLE
    // =====================================================

    function normalizeDisplayTime(value) {

        if (!value) {

            return "-";
        }


        const time =
            String(
                value
            );


        const match =
            time.match(
                /^(\d{2}):(\d{2})/
            );


        if (!match) {

            return time;
        }


        return `${match[1]}:${match[2]}`;
    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHtml(value) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    try {

        await Promise.all([

            loadDashboard(),

            loadUsers(),

            loadTrains(),

            loadBookings()

        ]);

    }
    catch (error) {

        console.error(
            "Admin Initial Load Error:",
            error
        );

    }

});