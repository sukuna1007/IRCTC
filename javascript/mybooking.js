// ==========================================
// MY BOOKINGS PAGE SCRIPT
// ==========================================

let selectedCancelPNR = null;
let cancelModal = null;


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const modalElement =
            document.getElementById(
                "cancelBookingModal"
            );


        if (
            modalElement &&
            typeof bootstrap !== "undefined"
        ) {

            cancelModal =
                new bootstrap.Modal(
                    modalElement
                );

        }


        const confirmCancelBtn =
            document.getElementById(
                "confirmCancelBtn"
            );


        if (confirmCancelBtn) {

            confirmCancelBtn.addEventListener(
                "click",
                confirmCancelBooking
            );

        }


        loadBookings();

    }
);


// ==========================================
// LOAD LOGGED-IN USER BOOKINGS
// ==========================================

async function loadBookings() {

    const loading =
        document.getElementById("loading");

    const bookingList =
        document.getElementById("bookingList");

    const noBookings =
        document.getElementById("noBookings");


    try {

        // ==========================================
        // RESET PAGE
        // ==========================================

        if (loading) {
            loading.classList.remove("d-none");
        }

        if (bookingList) {
            bookingList.innerHTML = "";
        }

        if (noBookings) {
            noBookings.classList.add("d-none");
        }


        // ==========================================
        // GET JWT TOKEN
        // ==========================================

        const token =
            localStorage.getItem("token");


        console.log(
            "JWT Token Found:",
            !!token
        );


        // ==========================================
        // USER NOT LOGGED IN
        // ==========================================

        if (!token) {

            alert(
                "Please login to view your bookings."
            );

            window.location.href =
                "index.html";

            return;

        }


        // ==========================================
        // GET USER BOOKINGS
        // ==========================================

        const response =
            await fetch(

                "http://localhost:5000/api/bookings",

                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }

            );


        console.log(
            "Bookings API Status:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "Bookings API Response:",
            data
        );


        // ==========================================
        // TOKEN INVALID / EXPIRED
        // ==========================================

        if (
            response.status === 401
        ) {

            clearLoginSession();


            alert(
                data.message ||
                "Your session has expired. Please login again."
            );


            window.location.href =
                "index.html";


            return;

        }


        // ==========================================
        // API ERROR
        // ==========================================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load bookings"
            );

        }


        // ==========================================
        // GET BOOKINGS ARRAY
        // ==========================================

        const bookings =
            Array.isArray(data)
                ? data
                : data.bookings ||
                  data.data ||
                  [];


        // ==========================================
        // NO BOOKINGS
        // ==========================================

        if (
            bookings.length === 0
        ) {

            if (noBookings) {

                noBookings.classList.remove(
                    "d-none"
                );

            }

            return;

        }


        // ==========================================
        // DISPLAY BOOKINGS
        // ==========================================

        bookings.forEach(
            booking => {

                const item =
                    createBookingCard(
                        booking
                    );


                if (bookingList) {

                    bookingList.appendChild(
                        item
                    );

                }

            }
        );

    }
    catch (error) {

        console.error(
            "Booking Loading Error:",
            error
        );


        if (bookingList) {

            bookingList.innerHTML = `

                <div class="alert alert-danger">

                    <strong>
                        Unable to load bookings.
                    </strong>

                    <br>

                    ${escapeHtml(
                        error.message
                    )}

                </div>

            `;

        }

    }
    finally {

        if (loading) {

            loading.classList.add(
                "d-none"
            );

        }

    }

}


// ==========================================
// CREATE BOOKING CARD
// ==========================================

function createBookingCard(
    booking
) {

    const div =
        document.createElement(
            "div"
        );


    // ==========================================
    // BOOKING VALUES
    // ==========================================

    const pnr =
        String(
            booking.pnr ||
            "-"
        );


    const trainNo =
        booking.train_no ||
        booking.trainNo ||
        "-";


    const trainName =
        booking.train_name ||
        booking.trainName ||
        "-";


    const source =
        booking.source ||
        booking.from ||
        "-";


    const destination =
        booking.destination ||
        booking.to ||
        "-";


    const journeyDate =
        formatDate(

            booking.journey_date ||
            booking.date

        );


    const passengerName =
        booking.passenger_name ||
        booking.name ||
        "-";


    const passengerAge =
        booking.passenger_age ??
        booking.age ??
        "-";


    const passengerGender =
        booking.passenger_gender ||
        booking.gender ||
        "-";


    const fare =
        Number(
            booking.fare ||
            0
        ).toFixed(
            2
        );


    const bookingStatus =
        booking.booking_status ||
        booking.status ||
        "Confirmed";


    const paymentStatus =
        booking.payment_status ||
        "-";


    // ==========================================
    // REFUND VALUES
    // ==========================================

    const refundStatus =
        booking.refund_status ||
        "Not Requested";


    const refundId =
        booking.refund_id ||
        "-";


    const refundAmount =
        Number(
            booking.refund_amount ||
            0
        ).toFixed(
            2
        );


    const refundedAt =
        booking.refunded_at
            ? formatDateTime(
                booking.refunded_at
            )
            : "-";


    // ==========================================
    // STATUS CHECKS
    // ==========================================

    const isCancelled =
        String(
            bookingStatus
        ).toLowerCase() ===
        "cancelled";


    const isRefunded =
        String(
            refundStatus
        ).toLowerCase() ===
        "refunded";


    const isRefundProcessing =
        String(
            refundStatus
        ).toLowerCase() ===
        "processing";


    const isRefundFailed =
        String(
            refundStatus
        ).toLowerCase() ===
        "failed";


    // ==========================================
    // CARD CLASS
    // ==========================================

    div.className =
        isCancelled
            ? "booking-item cancelled-booking"
            : "booking-item";


    // ==========================================
    // BOOKING STATUS CLASS
    // ==========================================

    const statusClass =
        isCancelled
            ? "status cancelled"
            : "status";


    // ==========================================
    // REFUND STATUS CLASS
    // ==========================================

    let refundStatusClass =
        "text-muted";


    if (isRefunded) {

        refundStatusClass =
            "text-success";

    }
    else if (
        isRefundProcessing
    ) {

        refundStatusClass =
            "text-warning";

    }
    else if (
        isRefundFailed
    ) {

        refundStatusClass =
            "text-danger";

    }


    // ==========================================
    // CANCEL BUTTON
    // ==========================================

    const cancelButtonHtml =
        isCancelled
            ? `

                <button
                    type="button"
                    class="btn btn-secondary cancel-ticket-btn"
                    disabled>

                    <i class="fa-solid fa-ban"></i>

                    Cancelled

                </button>

            `
            : `

                <button
                    type="button"
                    class="btn btn-danger cancel-ticket-btn">

                    <i class="fa-solid fa-ban"></i>

                    Cancel Ticket

                </button>

            `;


    // ==========================================
    // REFUND DETAILS
    // ==========================================

    let refundHtml =
        "";


    if (isCancelled) {

        refundHtml = `

            <div class="mt-3 p-3 bg-light rounded">

                <div>

                    <i class="fa-solid fa-rotate-left me-1"></i>

                    <strong>
                        Refund Status:
                    </strong>

                    <span class="${refundStatusClass} fw-bold">

                        ${escapeHtml(
                            refundStatus
                        )}

                    </span>

                </div>

        `;


        if (isRefunded) {

            refundHtml += `

                <div class="mt-1">

                    <strong>
                        Refund Amount:
                    </strong>

                    ₹${escapeHtml(
                        refundAmount
                    )}

                </div>


                <div class="mt-1 text-break">

                    <strong>
                        Refund ID:
                    </strong>

                    ${escapeHtml(
                        refundId
                    )}

                </div>


                <div class="mt-1">

                    <strong>
                        Refunded On:
                    </strong>

                    ${escapeHtml(
                        refundedAt
                    )}

                </div>

            `;

        }


        refundHtml +=
            `</div>`;

    }


    // ==========================================
    // BOOKING CARD HTML
    // ==========================================

    div.innerHTML = `

        <div class="row align-items-center">

            <div class="col-md-8">

                <div class="mb-2">

                    <span class="pnr">

                        PNR:
                        ${escapeHtml(
                            pnr
                        )}

                    </span>


                    <span class="${statusClass} ms-3">

                        ${escapeHtml(
                            bookingStatus
                        )}

                    </span>

                </div>


                <div class="route mb-2">

                    ${escapeHtml(
                        source
                    )}

                    <i
                        class="fa-solid fa-arrow-right mx-2 text-primary">
                    </i>

                    ${escapeHtml(
                        destination
                    )}

                </div>


                <div class="text-muted">

                    <i class="fa-solid fa-train me-1"></i>

                    <strong>

                        ${escapeHtml(
                            trainNo
                        )}

                    </strong>

                    -

                    ${escapeHtml(
                        trainName
                    )}

                </div>


                <div class="mt-2">

                    <i class="fa-solid fa-calendar-days me-1"></i>

                    ${escapeHtml(
                        journeyDate
                    )}

                </div>


                <div class="mt-1">

                    <i class="fa-solid fa-user me-1"></i>

                    ${escapeHtml(
                        passengerName
                    )}

                </div>


                <div class="mt-1 text-muted">

                    Age:
                    ${escapeHtml(
                        passengerAge
                    )}

                    |

                    Gender:
                    ${escapeHtml(
                        passengerGender
                    )}

                </div>


                <div class="mt-2">

                    <strong>

                        Fare:
                        ₹${escapeHtml(
                            fare
                        )}

                    </strong>

                </div>


                <div class="mt-1 text-muted">

                    Payment Status:

                    <strong>

                        ${escapeHtml(
                            paymentStatus
                        )}

                    </strong>

                </div>


                ${refundHtml}

            </div>


            <div
                class="col-md-4 text-md-end mt-3 mt-md-0">

                <div
                    class="booking-actions justify-content-md-end">


                    <button
                        type="button"
                        class="btn btn-primary view-ticket-btn">

                        <i class="fa-solid fa-ticket"></i>

                        View Ticket

                    </button>


                    ${cancelButtonHtml}


                </div>

            </div>

        </div>

    `;


    // ==========================================
    // VIEW TICKET EVENT
    // ==========================================

    const viewButton =
        div.querySelector(
            ".view-ticket-btn"
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            () => {

                viewTicket(
                    pnr
                );

            }
        );

    }


    // ==========================================
    // CANCEL EVENT
    // ==========================================

    if (!isCancelled) {

        const cancelButton =
            div.querySelector(
                ".cancel-ticket-btn"
            );


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                () => {

                    openCancelModal(
                        pnr
                    );

                }
            );

        }

    }


    return div;

}


// ==========================================
// VIEW TICKET
// ==========================================

function viewTicket(
    pnr
) {

    if (
        !pnr ||
        pnr === "-"
    ) {

        alert(
            "Invalid PNR."
        );

        return;

    }


    localStorage.setItem(
        "selectedPNR",
        pnr
    );


    window.location.href =
        "ticket.html";

}


// ==========================================
// OPEN CANCEL MODAL
// ==========================================

function openCancelModal(
    pnr
) {

    if (
        !pnr ||
        pnr === "-"
    ) {

        alert(
            "Invalid PNR."
        );

        return;

    }


    selectedCancelPNR =
        pnr;


    const cancelPNR =
        document.getElementById(
            "cancelPNR"
        );


    if (cancelPNR) {

        cancelPNR.textContent =
            pnr;

    }


    if (cancelModal) {

        cancelModal.show();

    }
    else {

        const confirmed =
            confirm(
                `Are you sure you want to cancel PNR ${pnr}?`
            );


        if (confirmed) {

            confirmCancelBooking();

        }

    }

}


// ==========================================
// CONFIRM CANCEL BOOKING
// ==========================================

async function confirmCancelBooking() {

    if (!selectedCancelPNR) {

        alert(
            "No booking selected."
        );

        return;

    }


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        clearLoginSession();


        alert(
            "Please login again."
        );


        window.location.href =
            "index.html";


        return;

    }


    const confirmButton =
        document.getElementById(
            "confirmCancelBtn"
        );


    const originalButtonHtml =
        confirmButton
            ? confirmButton.innerHTML
            : "";


    try {

        // ==========================================
        // DISABLE BUTTON
        // ==========================================

        if (confirmButton) {

            confirmButton.disabled =
                true;


            confirmButton.innerHTML = `

                <span
                    class="spinner-border spinner-border-sm me-1">
                </span>

                Cancelling...

            `;

        }


        // ==========================================
        // CANCEL BOOKING + REFUND API
        // ==========================================

        const response =
            await fetch(

                `http://localhost:5000/api/bookings/cancel/${encodeURIComponent(selectedCancelPNR)}`,

                {
                    method:
                        "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }

            );


        const data =
            await response.json();


        console.log(
            "Cancel Booking Status:",
            response.status
        );


        console.log(
            "Cancel Booking Response:",
            data
        );


        // ==========================================
        // INVALID TOKEN
        // ==========================================

        if (
            response.status === 401
        ) {

            clearLoginSession();


            alert(
                data.message ||
                "Your session has expired."
            );


            window.location.href =
                "index.html";


            return;

        }


        // ==========================================
        // CANCEL ERROR
        // ==========================================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to cancel booking"
            );

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        if (cancelModal) {

            cancelModal.hide();

        }


        let successMessage =
            data.message ||
            "Booking cancelled successfully.";


        if (
            data.refund &&
            data.refund.id
        ) {

            successMessage +=
                `\nRefund ID: ${data.refund.id}`;

        }


        alert(
            successMessage
        );


        selectedCancelPNR =
            null;


        // ==========================================
        // REFRESH BOOKINGS
        // ==========================================

        await loadBookings();

    }
    catch (error) {

        console.error(
            "Cancel Booking Error:",
            error
        );


        alert(
            error.message ||
            "Unable to cancel booking."
        );

    }
    finally {

        if (confirmButton) {

            confirmButton.disabled =
                false;


            confirmButton.innerHTML =
                originalButtonHtml;

        }

    }

}


// ==========================================
// CLEAR LOGIN SESSION
// ==========================================

function clearLoginSession() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "isLoggedIn"
    );

    localStorage.removeItem(
        "currentUser"
    );

}


// ==========================================
// FORMAT JOURNEY DATE
// ==========================================

function formatDate(
    dateValue
) {

    if (!dateValue) {

        return "-";

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

        return String(
            dateValue
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


// ==========================================
// FORMAT REFUND DATE + TIME
// ==========================================

function formatDateTime(
    dateValue
) {

    if (!dateValue) {

        return "-";

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

        return String(
            dateValue
        );

    }


    return date.toLocaleString(

        "en-IN",

        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }

    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(
    value
) {

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