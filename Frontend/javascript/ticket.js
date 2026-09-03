// ==========================================
// TICKET PAGE SCRIPT
// ==========================================

const API_BASE = window.location.origin;


document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // GET SELECTED PNR
    // ==========================================

    const selectedPNR =
        localStorage.getItem("selectedPNR") ||
        localStorage.getItem("pnr");


    // ==========================================
    // CHECK PNR
    // ==========================================

    if (!selectedPNR) {

        alert("No ticket selected.");

        window.location.href =
            "mybooking.html";

        return;
    }


    console.log(
        "Selected PNR:",
        selectedPNR
    );


    // ==========================================
    // LOAD BOOKING FROM DATABASE
    // ==========================================

    loadTicket(selectedPNR);

});


// ==========================================
// LOAD TICKET FROM BACKEND
// ==========================================

async function loadTicket(pnr) {

    try {

        const token =
            localStorage.getItem("token");


        console.log(
            "JWT Token Found:",
            !!token
        );


        if (!token) {

            alert(
                "Please login to view your ticket."
            );

            window.location.href =
                "index.html";

            return;
        }


        const response =
            await fetch(
                `${API_BASE}/api/bookings/pnr/${encodeURIComponent(pnr)}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        console.log(
            "Ticket API Status:",
            response.status
        );


        let data = {};


        try {

            data =
                await response.json();

        }
        catch (error) {

            data = {};

        }


        console.log(
            "Ticket API Response:",
            data
        );


        if (response.status === 401) {

            clearLoginSession();

            alert(
                data.message ||
                "Your session has expired. Please login again."
            );

            window.location.href =
                "index.html";

            return;
        }


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Booking not found"
            );

        }


        const booking =
            data.booking;


        if (!booking) {

            throw new Error(
                "Booking data not received"
            );

        }


        saveBookingToLocalStorage(
            booking
        );


        displayTicket(
            booking
        );

    }
    catch (error) {

        console.error(
            "Load Ticket Error:",
            error
        );


        alert(
            error.message ||
            "Unable to load ticket."
        );


        window.location.href =
            "mybooking.html";

    }

}


// ==========================================
// SAVE BOOKING TO LOCAL STORAGE
// ==========================================

function saveBookingToLocalStorage(
    booking
) {

    // ==========================================
    // PNR
    // ==========================================

    localStorage.setItem(
        "pnr",
        booking.pnr || ""
    );


    // ==========================================
    // TRAIN DETAILS
    // ==========================================

    localStorage.setItem(
        "trainNo",
        booking.train_no || ""
    );


    localStorage.setItem(
        "trainName",
        booking.train_name || ""
    );


    localStorage.setItem(
        "from",
        booking.source || ""
    );


    localStorage.setItem(
        "to",
        booking.destination || ""
    );


    localStorage.setItem(
        "date",
        booking.journey_date || ""
    );


    // ==========================================
    // PASSENGER DETAILS
    // ==========================================

    localStorage.setItem(
        "name",
        booking.passenger_name || ""
    );


    localStorage.setItem(
        "age",
        booking.passenger_age ?? ""
    );


    localStorage.setItem(
        "gender",
        booking.passenger_gender || ""
    );


    // ==========================================
    // SEAT DETAILS
    // ==========================================

    localStorage.setItem(
        "coach",
        booking.coach || ""
    );


    localStorage.setItem(
        "seatNumber",
        booking.seat_number ?? ""
    );


    localStorage.setItem(
        "berthType",
        booking.berth_type || ""
    );


    // ==========================================
    // FARE
    // ==========================================

    localStorage.setItem(
        "fare",
        booking.fare ?? ""
    );


    // ==========================================
    // PAYMENT DETAILS
    // ==========================================

    localStorage.setItem(
        "transactionId",
        booking.payment_id || ""
    );


    localStorage.setItem(
        "paymentStatus",
        booking.payment_status || ""
    );


    localStorage.setItem(
        "paymentMethod",
        "Razorpay"
    );


    // ==========================================
    // BOOKING STATUS
    // ==========================================

    localStorage.setItem(
        "bookingStatus",
        booking.booking_status || ""
    );


    // ==========================================
    // REFUND DETAILS
    // ==========================================

    localStorage.setItem(
        "refundId",
        booking.refund_id || ""
    );


    localStorage.setItem(
        "refundAmount",
        booking.refund_amount ?? ""
    );


    localStorage.setItem(
        "refundStatus",
        booking.refund_status || ""
    );


    localStorage.setItem(
        "refundedAt",
        booking.refunded_at || ""
    );

}


// ==========================================
// DISPLAY TICKET
// ==========================================

function displayTicket(booking) {

    // ==========================================
    // PNR
    // ==========================================

    setText(
        "pnr",
        booking.pnr || "-"
    );


    // ==========================================
    // TRAIN DETAILS
    // ==========================================

    setText(
        "trainNo",
        booking.train_no || "-"
    );


    setText(
        "trainName",
        booking.train_name || "-"
    );


    setText(
        "from",
        booking.source || "-"
    );


    setText(
        "to",
        booking.destination || "-"
    );


    setText(
        "date",
        formatDate(
            booking.journey_date
        )
    );


    setText(
        "fare",
        Number(
            booking.fare || 0
        ).toFixed(2)
    );


    // ==========================================
    // ROUTE
    // ==========================================

    setText(
        "routeFrom",
        booking.source || "-"
    );


    setText(
        "routeTo",
        booking.destination || "-"
    );


    // ==========================================
    // PASSENGER DETAILS
    // ==========================================

    setText(
        "name",
        booking.passenger_name || "-"
    );


    setText(
        "age",
        booking.passenger_age ?? "-"
    );


    setText(
        "gender",
        booking.passenger_gender || "-"
    );


    // ==========================================
    // SEAT DETAILS
    // ==========================================

    setText(
        "coach",
        booking.coach || "-"
    );


    setText(
        "seatNumber",
        booking.seat_number ?? "-"
    );


    setText(
        "berthType",
        booking.berth_type || "-"
    );


    // ==========================================
    // PAYMENT DETAILS
    // ==========================================

    setText(
        "paymentMethod",
        "Razorpay"
    );


    setText(
        "paymentStatus",
        booking.payment_status || "-"
    );


    setText(
        "transactionId",
        booking.payment_id || "-"
    );


    // ==========================================
    // BOOKING STATUS
    // ==========================================

    updateBookingStatus(
        booking.booking_status
    );


    // ==========================================
    // REFUND DETAILS
    // ==========================================

    updateRefundDetails(
        booking
    );


    // ==========================================
    // DEBUG
    // ==========================================

    console.log(
        "========== TICKET DATA =========="
    );


    console.log(
        "PNR:",
        booking.pnr
    );


    console.log(
        "Train:",
        booking.train_no,
        booking.train_name
    );


    console.log(
        "Route:",
        booking.source,
        "→",
        booking.destination
    );


    console.log(
        "Passenger:",
        booking.passenger_name
    );


    console.log(
        "Age:",
        booking.passenger_age
    );


    console.log(
        "Gender:",
        booking.passenger_gender
    );


    console.log(
        "Coach:",
        booking.coach
    );


    console.log(
        "Seat Number:",
        booking.seat_number
    );


    console.log(
        "Berth Type:",
        booking.berth_type
    );


    console.log(
        "Payment Status:",
        booking.payment_status
    );


    console.log(
        "Booking Status:",
        booking.booking_status
    );


    console.log(
        "Refund Status:",
        booking.refund_status
    );


    console.log(
        "Refund Amount:",
        booking.refund_amount
    );


    console.log(
        "Refund ID:",
        booking.refund_id
    );


    console.log(
        "Refunded At:",
        booking.refunded_at
    );


    console.log(
        "Transaction ID:",
        booking.payment_id
    );


    console.log(
        "================================="
    );

}


// ==========================================
// UPDATE BOOKING STATUS UI
// ==========================================

function updateBookingStatus(status) {

    const bookingStatus =
        String(
            status || "Confirmed"
        ).trim();


    const isCancelled =
        bookingStatus.toLowerCase() ===
        "cancelled";


    const statusTitle =
        document.getElementById(
            "bookingStatusTitle"
        );


    const statusText =
        document.getElementById(
            "bookingStatusText"
        );


    const statusIcon =
        document.getElementById(
            "bookingStatusIcon"
        );


    const ticketHeader =
        document.getElementById(
            "ticketHeader"
        );


    const ticketCard =
        document.getElementById(
            "ticketCard"
        );


    const cancelledMessage =
        document.getElementById(
            "cancelledMessage"
        );


    // ==========================================
    // CANCELLED BOOKING
    // ==========================================

    if (isCancelled) {

        if (statusTitle) {

            statusTitle.classList.remove(
                "confirmed"
            );

            statusTitle.classList.add(
                "cancelled"
            );

        }


        if (statusText) {

            statusText.textContent =
                "Booking Cancelled";

        }


        if (statusIcon) {

            statusIcon.className =
                "fa-solid fa-circle-xmark";

        }


        if (ticketHeader) {

            ticketHeader.classList.add(
                "cancelled"
            );

        }


        if (ticketCard) {

            ticketCard.classList.add(
                "cancelled-ticket"
            );

        }


        if (cancelledMessage) {

            cancelledMessage.classList.remove(
                "d-none"
            );

        }


        return;

    }


    // ==========================================
    // CONFIRMED BOOKING
    // ==========================================

    if (statusTitle) {

        statusTitle.classList.remove(
            "cancelled"
        );

        statusTitle.classList.add(
            "confirmed"
        );

    }


    if (statusText) {

        statusText.textContent =
            "Booking Confirmed";

    }


    if (statusIcon) {

        statusIcon.className =
            "fa-solid fa-circle-check";

    }


    if (ticketHeader) {

        ticketHeader.classList.remove(
            "cancelled"
        );

    }


    if (ticketCard) {

        ticketCard.classList.remove(
            "cancelled-ticket"
        );

    }


    if (cancelledMessage) {

        cancelledMessage.classList.add(
            "d-none"
        );

    }

}


// ==========================================
// UPDATE REFUND DETAILS
// ==========================================

function updateRefundDetails(booking) {

    const refundSection =
        document.getElementById(
            "refundSection"
        );


    if (!refundSection) {

        return;

    }


    const refundStatus =
        String(
            booking.refund_status ||
            "Not Requested"
        ).trim();


    const refundId =
        booking.refund_id || "-";


    const refundAmount =
        Number(
            booking.refund_amount || 0
        ).toFixed(2);


    const refundedAt =
        booking.refunded_at
            ? formatDateTime(
                booking.refunded_at
            )
            : "-";


    const isNotRequested =
        refundStatus.toLowerCase() ===
        "not requested";


    // ==========================================
    // HIDE IF NO REFUND EXISTS
    // ==========================================

    if (
        isNotRequested &&
        !booking.refund_id &&
        Number(
            booking.refund_amount || 0
        ) === 0
    ) {

        refundSection.classList.add(
            "d-none"
        );

        return;

    }


    // ==========================================
    // SHOW REFUND SECTION
    // ==========================================

    refundSection.classList.remove(
        "d-none"
    );


    setText(
        "refundStatus",
        refundStatus
    );


    setText(
        "refundAmount",
        refundAmount
    );


    setText(
        "refundId",
        refundId
    );


    setText(
        "refundedAt",
        refundedAt
    );


    // ==========================================
    // REFUND STATUS COLOR
    // ==========================================

    const refundStatusElement =
        document.getElementById(
            "refundStatus"
        );


    if (refundStatusElement) {

        refundStatusElement.classList.remove(
            "refunded",
            "processing",
            "failed"
        );


        const status =
            refundStatus.toLowerCase();


        if (status === "refunded") {

            refundStatusElement.classList.add(
                "refunded"
            );

        }
        else if (
            status === "processing"
        ) {

            refundStatusElement.classList.add(
                "processing"
            );

        }
        else if (
            status === "failed"
        ) {

            refundStatusElement.classList.add(
                "failed"
            );

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
// FORMAT DATE
// ==========================================

function formatDate(dateValue) {

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
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }

    );

}


// ==========================================
// FORMAT DATE + TIME
// ==========================================

function formatDateTime(dateValue) {

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
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }

    );

}


// ==========================================
// SET TEXT SAFELY
// ==========================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "-";

    }

}