document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // GET TRAIN DETAILS FROM URL
    // ==========================================

    const params =
        new URLSearchParams(window.location.search);

    const trainNo =
        params.get("trainNo") || "-";

    const trainName =
        params.get("trainName") || "-";

    const from =
        params.get("from") || "-";

    const to =
        params.get("to") || "-";

    const date =
        params.get("date") || "-";

    const fare =
        params.get("fare") || "0";


    // ==========================================
    // SHOW TRAIN DETAILS
    // ==========================================

    const trainNoEl =
        document.getElementById("trainNo");

    const trainNameEl =
        document.getElementById("trainName");

    const fromEl =
        document.getElementById("from");

    const toEl =
        document.getElementById("to");

    const dateEl =
        document.getElementById("date");

    const fareEl =
        document.getElementById("fare");


    if (trainNoEl) {
        trainNoEl.textContent = trainNo;
    }

    if (trainNameEl) {
        trainNameEl.textContent = trainName;
    }

    if (fromEl) {
        fromEl.textContent = from;
    }

    if (toEl) {
        toEl.textContent = to;
    }

    if (dateEl) {
        dateEl.textContent = date;
    }

    if (fareEl) {
        fareEl.textContent = fare;
    }


    // ==========================================
    // PAYMENT BUTTON
    // ==========================================

    const paymentBtn =
        document.getElementById("paymentBtn");


    if (!paymentBtn) {

        console.error(
            "Payment button not found."
        );

        return;
    }


    // ==========================================
    // RESET PAYMENT BUTTON
    // ==========================================

    function resetPaymentButton() {

        paymentBtn.disabled = false;

        paymentBtn.innerHTML =
            '<i class="fa-solid fa-credit-card"></i> Proceed to Payment';

    }


    // ==========================================
    // PAYMENT BUTTON CLICK
    // ==========================================

    paymentBtn.addEventListener(
        "click",
        async () => {

            // ==========================================
            // GET JWT TOKEN
            // ==========================================

            const token =
                localStorage.getItem("token");


            if (!token) {

                alert(
                    "Please login before booking a ticket."
                );

                window.location.href =
                    "index.html";

                return;
            }


            // ==========================================
            // VALIDATE TRAIN NUMBER
            // ==========================================

            if (
                !trainNo ||
                trainNo === "-"
            ) {

                alert(
                    "Invalid train number."
                );

                return;
            }


            // ==========================================
            // GET PASSENGER DETAILS
            // ==========================================

            const nameInput =
                document.getElementById("name");

            const ageInput =
                document.getElementById("age");


            if (
                !nameInput ||
                !ageInput
            ) {

                console.error(
                    "Passenger input fields not found."
                );

                alert(
                    "Passenger form fields are missing."
                );

                return;
            }


            const name =
                nameInput.value.trim();

            const age =
                ageInput.value.trim();


            const gender =
                document.querySelector(
                    'input[name="gender"]:checked'
                )?.value;


            // ==========================================
            // VALIDATE PASSENGER
            // ==========================================

            if (
                !name ||
                !age ||
                !gender
            ) {

                alert(
                    "Please fill all passenger details."
                );

                return;
            }


            // ==========================================
            // VALIDATE AGE
            // ==========================================

            const passengerAge =
                Number(age);


            if (
                !Number.isInteger(
                    passengerAge
                ) ||
                passengerAge <= 0 ||
                passengerAge > 120
            ) {

                alert(
                    "Please enter a valid age."
                );

                return;
            }


            // ==========================================
            // CHECK RAZORPAY SDK
            // ==========================================

            if (
                typeof Razorpay === "undefined"
            ) {

                alert(
                    "Razorpay Checkout could not be loaded."
                );

                console.error(
                    "Razorpay SDK is missing."
                );

                return;
            }


            // ==========================================
            // SAVE BOOKING DETAILS
            // ==========================================

            localStorage.setItem(
                "name",
                name
            );

            localStorage.setItem(
                "age",
                passengerAge
            );

            localStorage.setItem(
                "gender",
                gender
            );

            localStorage.setItem(
                "trainNo",
                trainNo
            );

            localStorage.setItem(
                "trainName",
                trainName
            );

            localStorage.setItem(
                "from",
                from
            );

            localStorage.setItem(
                "to",
                to
            );

            localStorage.setItem(
                "date",
                date
            );


            // ==========================================
            // DISABLE PAYMENT BUTTON
            // ==========================================

            paymentBtn.disabled = true;

            paymentBtn.innerHTML =
                "Creating Payment...";


            try {

                // ==========================================
                // CREATE RAZORPAY ORDER
                // ==========================================

                const response =
                    await fetch(

                        "http://localhost:5000/api/payment/create-order",

                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    trainNo:
                                        trainNo

                                })

                        }

                    );


                // ==========================================
                // READ SERVER RESPONSE
                // ==========================================

                const data =
                    await response.json();


                console.log(
                    "Create Order Response:",
                    data
                );


                // ==========================================
                // TOKEN ERROR
                // ==========================================

                if (
                    response.status === 401
                ) {

                    clearLoginSession();


                    alert(
                        data.message ||
                        "Please login again."
                    );


                    window.location.href =
                        "index.html";

                    return;
                }


                // ==========================================
                // CHECK SERVER RESPONSE
                // ==========================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(

                        data.message ||
                        "Unable to create payment order"

                    );

                }


                // ==========================================
                // GET DATABASE TRAIN DATA
                // ==========================================

                const serverTrain =
                    data.train || {};


                const actualTrainNo =
                    serverTrain.trainNo ||
                    trainNo;


                const actualTrainName =
                    serverTrain.trainName ||
                    trainName;


                const actualFrom =
                    serverTrain.from ||
                    from;


                const actualTo =
                    serverTrain.to ||
                    to;


                const actualFare =
                    Number(
                        serverTrain.fare
                    );


                if (
                    !Number.isFinite(
                        actualFare
                    ) ||
                    actualFare <= 0
                ) {

                    throw new Error(
                        "Invalid fare received from server."
                    );

                }


                // ==========================================
                // UPDATE DISPLAY USING BACKEND DATA
                // ==========================================

                if (trainNoEl) {
                    trainNoEl.textContent =
                        actualTrainNo;
                }

                if (trainNameEl) {
                    trainNameEl.textContent =
                        actualTrainName;
                }

                if (fromEl) {
                    fromEl.textContent =
                        actualFrom;
                }

                if (toEl) {
                    toEl.textContent =
                        actualTo;
                }

                if (fareEl) {
                    fareEl.textContent =
                        actualFare.toFixed(2);
                }


                // ==========================================
                // SAVE AUTHORITATIVE TRAIN DATA
                // ==========================================

                localStorage.setItem(
                    "trainNo",
                    actualTrainNo
                );

                localStorage.setItem(
                    "trainName",
                    actualTrainName
                );

                localStorage.setItem(
                    "from",
                    actualFrom
                );

                localStorage.setItem(
                    "to",
                    actualTo
                );

                localStorage.setItem(
                    "fare",
                    actualFare
                );

                localStorage.setItem(
                    "paymentAmount",
                    actualFare
                );


                // ==========================================
                // GET RAZORPAY ORDER
                // ==========================================

                const order =
                    data.order;


                if (
                    !order ||
                    !order.id
                ) {

                    throw new Error(
                        "Razorpay Order ID was not received."
                    );

                }


                // ==========================================
                // GET RAZORPAY KEY
                // ==========================================

                const razorpayKey =
                    data.key_id;


                if (!razorpayKey) {

                    throw new Error(
                        "Razorpay key was not received from server."
                    );

                }


                // ==========================================
                // GET LOGGED-IN USER
                // ==========================================

                let currentUser = {};


                try {

                    currentUser =
                        JSON.parse(
                            localStorage.getItem(
                                "currentUser"
                            )
                        ) || {};

                }
                catch (error) {

                    currentUser = {};

                }


                // ==========================================
                // RAZORPAY OPTIONS
                // ==========================================

                const options = {

                    key:
                        razorpayKey,


                    amount:
                        order.amount,

                    currency:
                        order.currency,

                    name:
                        "IRCTC Clone",

                    description:
                        `${actualTrainName} - Train Ticket`,

                    order_id:
                        order.id,


                    // ==========================================
                    // PREFILL CUSTOMER
                    // ==========================================

                    prefill: {

                        name:
                            currentUser.full_name ||
                            currentUser.username ||
                            name,

                        email:
                            currentUser.email ||
                            "",

                        contact:
                            currentUser.phone ||
                            ""

                    },


                    // ==========================================
                    // THEME
                    // ==========================================

                    theme: {

                        color:
                            "#0d6efd"

                    },


                    // ==========================================
                    // PAYMENT SUCCESS
                    // ==========================================

                    handler:
                        async function (
                            paymentResponse
                        ) {

                            console.log(
                                "Razorpay Payment Response:",
                                paymentResponse
                            );


                            if (
                                !paymentResponse ||
                                !paymentResponse
                                    .razorpay_order_id ||
                                !paymentResponse
                                    .razorpay_payment_id ||
                                !paymentResponse
                                    .razorpay_signature
                            ) {

                                alert(
                                    "Payment information is incomplete."
                                );

                                resetPaymentButton();

                                return;
                            }


                            paymentBtn.disabled =
                                true;

                            paymentBtn.innerHTML =
                                "Verifying Payment...";


                            try {

                                // ==========================================
                                // VERIFY PAYMENT
                                // ==========================================

                                const verifyResponse =
                                    await fetch(

                                        "http://localhost:5000/api/payment/verify",

                                        {
                                            method:
                                                "POST",

                                            headers: {

                                                "Content-Type":
                                                    "application/json",

                                                "Authorization":
                                                    `Bearer ${token}`

                                            },

                                            body:
                                                JSON.stringify({

                                                    razorpay_order_id:
                                                        paymentResponse
                                                            .razorpay_order_id,

                                                    razorpay_payment_id:
                                                        paymentResponse
                                                            .razorpay_payment_id,

                                                    razorpay_signature:
                                                        paymentResponse
                                                            .razorpay_signature,

                                                    trainNo:
                                                        actualTrainNo,

                                                    date:
                                                        date,

                                                    name:
                                                        name,

                                                    age:
                                                        passengerAge,

                                                    gender:
                                                        gender

                                                })

                                        }

                                    );


                                // ==========================================
                                // READ VERIFICATION RESPONSE
                                // ==========================================

                                const verifyData =
                                    await verifyResponse
                                        .json();


                                console.log(
                                    "Payment Verify Response:",
                                    verifyData
                                );


                                // ==========================================
                                // TOKEN ERROR
                                // ==========================================

                                if (
                                    verifyResponse.status ===
                                    401
                                ) {

                                    clearLoginSession();


                                    alert(
                                        verifyData.message ||
                                        "Session expired. Please login again."
                                    );


                                    window.location.href =
                                        "index.html";

                                    return;
                                }


                                // ==========================================
                                // CHECK VERIFICATION
                                // ==========================================

                                if (
                                    !verifyResponse.ok ||
                                    !verifyData.success
                                ) {

                                    alert(
                                        verifyData.message ||
                                        "Payment verification failed."
                                    );

                                    resetPaymentButton();

                                    return;
                                }


                                // ==========================================
                                // GET PNR
                                // ==========================================

                                const pnr =
                                    verifyData.pnr;


                                if (!pnr) {

                                    alert(
                                        "Payment successful, but PNR was not generated."
                                    );

                                    resetPaymentButton();

                                    return;
                                }


                                // ==========================================
                                // SAVE PNR
                                // ==========================================

                                localStorage.setItem(
                                    "pnr",
                                    pnr
                                );

                                localStorage.setItem(
                                    "selectedPNR",
                                    pnr
                                );


                                // ==========================================
                                // SAVE PAYMENT INFORMATION
                                // ==========================================

                                localStorage.setItem(
                                    "paymentMethod",
                                    "Razorpay"
                                );

                                localStorage.setItem(
                                    "paymentStatus",
                                    "Paid"
                                );

                                localStorage.setItem(
                                    "transactionId",
                                    paymentResponse
                                        .razorpay_payment_id
                                );

                                localStorage.setItem(
                                    "razorpayOrderId",
                                    paymentResponse
                                        .razorpay_order_id
                                );

                                localStorage.setItem(
                                    "paymentAmount",
                                    actualFare
                                );

                                localStorage.setItem(
                                    "paymentDate",
                                    new Date()
                                        .toISOString()
                                );


                                if (
                                    verifyData.bookingId
                                ) {

                                    localStorage.setItem(
                                        "bookingId",
                                        verifyData.bookingId
                                    );

                                }


                                if (
                                    verifyData.userId
                                ) {

                                    localStorage.setItem(
                                        "bookingUserId",
                                        verifyData.userId
                                    );

                                }


                                // ==========================================
                                // PAYMENT SUCCESS
                                // ==========================================

                                alert(
                                    "Payment Successful!\n\n" +
                                    "PNR: " +
                                    pnr
                                );


                                window.location.href =
                                    "success.html";

                            }
                            catch (error) {

                                console.error(
                                    "Verification Error:",
                                    error
                                );


                                alert(
                                    error.message ||
                                    "Payment verification failed."
                                );


                                resetPaymentButton();

                            }

                        },


                    // ==========================================
                    // PAYMENT MODAL CLOSED
                    // ==========================================

                    modal: {

                        ondismiss:
                            function () {

                                console.log(
                                    "Razorpay checkout closed."
                                );

                                resetPaymentButton();

                            }

                    }

                };


                // ==========================================
                // CREATE RAZORPAY INSTANCE
                // ==========================================

                const razorpay =
                    new Razorpay(
                        options
                    );


                // ==========================================
                // PAYMENT FAILED
                // ==========================================

                razorpay.on(

                    "payment.failed",

                    function (response) {

                        console.error(
                            "Razorpay Payment Failed:",
                            response.error
                        );


                        alert(

                            "Payment Failed\n\n" +

                            "Code: " +
                            response.error.code +

                            "\n\n" +

                            "Description: " +
                            response.error.description

                        );


                        resetPaymentButton();

                    }

                );


                // ==========================================
                // OPEN RAZORPAY
                // ==========================================

                razorpay.open();

            }
            catch (error) {

                console.error(
                    "Payment Error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to create payment order"
                );


                resetPaymentButton();

            }

        }
    );


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

});