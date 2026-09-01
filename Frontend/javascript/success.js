// ==========================================
// SUCCESS PAGE SCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // GET DATA FROM LOCAL STORAGE
    // ==========================================

    const pnr =
        localStorage.getItem("pnr") || "-";


    const transactionId =
        localStorage.getItem("transactionId") || "-";


    const amount =
        localStorage.getItem("paymentAmount") ||
        localStorage.getItem("fare") ||
        "0";


    const paymentDate =
        localStorage.getItem("paymentDate");


    // ==========================================
    // DATE AND TIME
    // ==========================================

    let date;
    let time;


    if (paymentDate) {

        const paymentDateObject =
            new Date(paymentDate);


        date =
            paymentDateObject.toLocaleDateString(
                "en-IN"
            );


        time =
            paymentDateObject.toLocaleTimeString(
                "en-IN"
            );

    } else {

        const now = new Date();


        date =
            now.toLocaleDateString(
                "en-IN"
            );


        time =
            now.toLocaleTimeString(
                "en-IN"
            );

    }


    // ==========================================
    // GET HTML ELEMENTS
    // ==========================================

    const pnrEl =
        document.getElementById("pnr");


    const txnEl =
        document.getElementById("txnId");


    const amountEl =
        document.getElementById("amount");


    const dateEl =
        document.getElementById("date");


    const timeEl =
        document.getElementById("time");


    // ==========================================
    // SHOW PNR
    // ==========================================

    if (pnrEl) {

        pnrEl.textContent = pnr;

    }


    // ==========================================
    // SHOW TRANSACTION ID
    // ==========================================

    if (txnEl) {

        txnEl.textContent =
            transactionId;

    }


    // ==========================================
    // SHOW AMOUNT
    // ==========================================

    if (amountEl) {

        amountEl.textContent =
            "₹" + Number(amount).toFixed(2);

    }


    // ==========================================
    // SHOW DATE
    // ==========================================

    if (dateEl) {

        dateEl.textContent =
            date;

    }


    // ==========================================
    // SHOW TIME
    // ==========================================

    if (timeEl) {

        timeEl.textContent =
            time;

    }


    // ==========================================
    // DEBUG INFORMATION
    // ==========================================

    console.log(
        "===== SUCCESS PAGE DATA ====="
    );

    console.log(
        "PNR:",
        pnr
    );

    console.log(
        "Transaction ID:",
        transactionId
    );

    console.log(
        "Amount:",
        amount
    );

    console.log(
        "Date:",
        date
    );

    console.log(
        "Time:",
        time
    );

});


// ==========================================
// PRINT RECEIPT
// ==========================================

function printReceipt() {

    window.print();

}


// ==========================================
// GO HOME
// ==========================================

function goHome() {

    window.location.href =
        "index.html";

}


// ==========================================
// GO TO TICKET
// ==========================================

function goTicket() {

    window.location.href =
        "ticket.html";

}


// ==========================================
// MAKE FUNCTIONS GLOBAL
// ==========================================

window.printReceipt =
    printReceipt;

window.goHome =
    goHome;

window.goTicket =
    goTicket;