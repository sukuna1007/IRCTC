document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // URL PARAMETERS
    // ==========================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    // ==========================================
    // ELEMENTS
    // ==========================================

    const fromInput =
        document.getElementById("from");

    const toInput =
        document.getElementById("to");

    const dateInput =
        document.getElementById("date");

    const form =
        document.getElementById("bookingForm");

    const resultsBox =
        document.getElementById("trainResults");

    const swapBtn =
        document.getElementById("swapBtn");


    // ==========================================
    // NORMALIZE DATE FOR <input type="date">
    // ==========================================

    function normalizeDateForInput(value) {

        if (!value) {
            return "";
        }


        const dateValue =
            String(value).trim();


        // ======================================
        // ALREADY YYYY-MM-DD
        // ======================================

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                dateValue
            )
        ) {

            return dateValue;
        }


        // ======================================
        // CONVERT DD/MM/YYYY TO YYYY-MM-DD
        // ======================================

        const match =
            dateValue.match(
                /^(\d{2})\/(\d{2})\/(\d{4})$/
            );


        if (match) {

            const day =
                match[1];

            const month =
                match[2];

            const year =
                match[3];


            return `${year}-${month}-${day}`;
        }


        return "";
    }


    // ==========================================
    // GET VALUES FROM INDEX PAGE URL
    // ==========================================

    const fromParam =
        params.get("from");

    const toParam =
        params.get("to");

    const dateParam =
        params.get("date");


    // ==========================================
    // FILL FROM
    // ==========================================

    if (
        fromInput &&
        fromParam
    ) {

        fromInput.value =
            fromParam;

    }


    // ==========================================
    // FILL TO
    // ==========================================

    if (
        toInput &&
        toParam
    ) {

        toInput.value =
            toParam;

    }


    // ==========================================
    // FILL DATE
    // ==========================================

    if (
        dateInput &&
        dateParam
    ) {

        dateInput.value =
            normalizeDateForInput(
                dateParam
            );

    }


    // ==========================================
    // SET MINIMUM DATE TO TODAY
    // ==========================================

    if (dateInput) {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                today.getDate()
            ).padStart(
                2,
                "0"
            );


        dateInput.min =
            `${year}-${month}-${day}`;

    }


    // ==========================================
    // SWAP FROM / TO
    // ==========================================

    if (
        swapBtn &&
        fromInput &&
        toInput
    ) {

        swapBtn.addEventListener(
            "click",
            () => {

                const temp =
                    fromInput.value;


                fromInput.value =
                    toInput.value;


                toInput.value =
                    temp;

            }
        );

    }


    // ==========================================
    // SEARCH TRAINS
    // ==========================================

    if (form) {

        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                // ======================================
                // GET SEARCH VALUES
                // ======================================

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
                        ? dateInput.value
                        : "";


                // ======================================
                // VALIDATION
                // ======================================

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


                // ======================================
                // SAME STATION VALIDATION
                // ======================================

                if (
                    from.toLowerCase() ===
                    to.toLowerCase()
                ) {

                    alert(
                        "From and To stations cannot be the same."
                    );

                    return;
                }


                // ======================================
                // SHOW LOADING
                // ======================================

                if (resultsBox) {

                    resultsBox.innerHTML = `

                        <div class="text-center my-4">

                            <div
                                class="spinner-border text-primary">
                            </div>

                            <h5 class="mt-2">
                                Searching trains...
                            </h5>

                        </div>

                    `;

                }


                try {

                    // ==================================
                    // CALL BACKEND TRAIN API
                    // ==================================

                    const response =
                        await fetch(

                            `http://localhost:5000/api/trains/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`

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
                        "Train Search API Response:",
                        data
                    );


                    // ==================================
                    // HTTP ERROR
                    // ==================================

                    if (!response.ok) {

                        throw new Error(

                            data.message ||
                            `Server error: ${response.status}`

                        );

                    }


                    // ==================================
                    // API ERROR
                    // ==================================

                    if (!data.success) {

                        throw new Error(

                            data.message ||
                            "Unable to search trains"

                        );

                    }


                    // ==================================
                    // GET TRAINS
                    // ==================================

                    const trains =
                        Array.isArray(
                            data.trains
                        )
                            ? data.trains
                            : [];


                    // ==================================
                    // DISPLAY RESULTS
                    // ==================================

                    displayTrains(
                        trains,
                        date
                    );


                    // ==================================
                    // UPDATE URL
                    // ==================================

                    const newUrl =

                        `search.html?from=${encodeURIComponent(from)}` +
                        `&to=${encodeURIComponent(to)}` +
                        `&date=${encodeURIComponent(date)}`;


                    window.history.replaceState(
                        {},
                        "",
                        newUrl
                    );

                }
                catch (error) {

                    console.error(
                        "Search Error:",
                        error
                    );


                    if (resultsBox) {

                        resultsBox.innerHTML = `

                            <div class="alert alert-danger">

                                <strong>
                                    Error:
                                </strong>

                                ${escapeHtml(
                                    error.message
                                )}

                            </div>

                        `;

                    }

                }

            }
        );

    }


    // ==========================================
    // DISPLAY TRAINS
    // ==========================================

    function displayTrains(
        trains,
        journeyDate
    ) {

        if (!resultsBox) {
            return;
        }


        console.log(
            "Journey Date:",
            journeyDate
        );


        // ======================================
        // NO TRAINS
        // ======================================

        if (
            !trains ||
            trains.length === 0
        ) {

            resultsBox.innerHTML = `

                <div class="alert alert-warning">

                    <i
                        class="fa-solid fa-circle-info">
                    </i>

                    No trains found from

                    <strong>
                        ${escapeHtml(
                            fromInput.value
                        )}
                    </strong>

                    to

                    <strong>
                        ${escapeHtml(
                            toInput.value
                        )}
                    </strong>.

                </div>

            `;


            return;
        }


        resultsBox.innerHTML =
            "";


        // ======================================
        // EACH TRAIN
        // ======================================

        trains.forEach(train => {

            const trainNo =
                train.train_number ||
                "-";


            const trainName =
                train.train_name ||
                "-";


            const fromStation =
                train.source ||
                "-";


            const toStation =
                train.destination ||
                "-";


            const departure =
                train.departure_time ||
                "-";


            const arrival =
                train.arrival_time ||
                "-";


            const duration =
                train.duration ||
                "-";


            const seats =
                Number(
                    train.available_seats || 0
                );


            const fare =
                Number(
                    train.fare || 0
                );


            // ==================================
            // CREATE CARD
            // ==================================

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card shadow-sm border-0 rounded-4 mb-4";


            card.innerHTML = `

                <div class="card-body p-4">

                    <div
                        class="d-flex justify-content-between align-items-center">

                        <div>

                            <h4
                                class="text-primary fw-bold mb-1">

                                <i class="fa-solid fa-train"></i>

                                ${escapeHtml(
                                    trainName
                                )}

                            </h4>

                            <small
                                class="text-muted">

                                Train No:
                                ${escapeHtml(
                                    trainNo
                                )}

                            </small>

                        </div>


                        <div class="text-end">

                            <h4
                                class="text-success fw-bold">

                                ₹${fare.toFixed(2)}

                            </h4>

                            <small
                                class="text-muted">

                                per passenger

                            </small>

                        </div>

                    </div>


                    <hr>


                    <div class="row text-center">


                        <div class="col-md-3">

                            <small class="text-muted">
                                From
                            </small>

                            <h5 class="fw-bold">

                                ${escapeHtml(
                                    fromStation
                                )}

                            </h5>

                            <strong>

                                ${escapeHtml(
                                    departure
                                )}

                            </strong>

                        </div>


                        <div class="col-md-3">

                            <small class="text-muted">
                                Duration
                            </small>

                            <h5>

                                ${escapeHtml(
                                    duration
                                )}

                            </h5>

                        </div>


                        <div class="col-md-3">

                            <small class="text-muted">
                                To
                            </small>

                            <h5 class="fw-bold">

                                ${escapeHtml(
                                    toStation
                                )}

                            </h5>

                            <strong>

                                ${escapeHtml(
                                    arrival
                                )}

                            </strong>

                        </div>


                        <div class="col-md-3">

                            <small class="text-muted">
                                Available Seats
                            </small>

                            <h5
                                class="${
                                    seats > 0
                                        ? "text-success"
                                        : "text-danger"
                                } fw-bold">

                                ${escapeHtml(
                                    seats
                                )}

                            </h5>

                        </div>


                    </div>


                    <hr>


                    <div
                        class="d-flex justify-content-between align-items-center">

                        <div>

                            <i
                                class="fa-solid fa-calendar-days text-primary">
                            </i>

                            <strong>
                                Journey Date:
                            </strong>

                            ${escapeHtml(
                                formatDateForDisplay(
                                    journeyDate
                                )
                            )}

                        </div>


                        <button
                            type="button"
                            class="btn btn-success px-4 book-btn"
                            ${
                                seats <= 0
                                    ? "disabled"
                                    : ""
                            }>

                            <i class="fa-solid fa-ticket"></i>

                            ${
                                seats <= 0
                                    ? "Sold Out"
                                    : "Book Now"
                            }

                        </button>

                    </div>


                </div>

            `;


            // ==================================
            // BOOK NOW BUTTON
            // ==================================

            const bookButton =
                card.querySelector(
                    ".book-btn"
                );


            if (
                bookButton &&
                seats > 0
            ) {

                bookButton.addEventListener(
                    "click",
                    () => {

                        bookTrain(

                            trainNo,
                            trainName,
                            fromStation,
                            toStation,
                            journeyDate,
                            fare

                        );

                    }
                );

            }


            resultsBox.appendChild(
                card
            );

        });

    }


    // ==========================================
    // AUTO SEARCH FROM INDEX PAGE
    // ==========================================

    if (
        fromInput &&
        toInput &&
        dateInput &&
        form &&
        fromInput.value &&
        toInput.value &&
        dateInput.value
    ) {

        console.log(
            "Auto searching trains..."
        );


        form.requestSubmit();

    }

});


// ==========================================
// BOOK TRAIN
// ==========================================

function bookTrain(
    trainNo,
    trainName,
    from,
    to,
    date,
    fare
) {

    console.log(
        "Booking Train:",
        {
            trainNo,
            trainName,
            from,
            to,
            date,
            fare
        }
    );


    // ==========================================
    // VALIDATE DATE
    // ==========================================

    if (!date) {

        alert(
            "Invalid journey date."
        );

        return;
    }


    // ==========================================
    // VALIDATE FARE
    // ==========================================

    if (
        !Number.isFinite(
            Number(fare)
        ) ||
        Number(fare) <= 0
    ) {

        alert(
            "Invalid train fare."
        );

        return;
    }


    // ==========================================
    // BOOKING PAGE URL
    // ==========================================

    const url =

        `booking.html?` +

        `trainNo=${encodeURIComponent(trainNo)}` +

        `&trainName=${encodeURIComponent(trainName)}` +

        `&from=${encodeURIComponent(from)}` +

        `&to=${encodeURIComponent(to)}` +

        `&date=${encodeURIComponent(date)}` +

        `&fare=${encodeURIComponent(fare)}`;


    console.log(
        "Booking URL:",
        url
    );


    // ==========================================
    // GO TO BOOKING PAGE
    // ==========================================

    window.location.href =
        url;

}


// ==========================================
// FORMAT DATE FOR DISPLAY
// ==========================================

function formatDateForDisplay(value) {

    if (!value) {

        return "-";
    }


    const match =
        String(value).match(
            /^(\d{4})-(\d{2})-(\d{2})$/
        );


    if (!match) {

        return String(value);
    }


    return (
        `${match[3]}/${match[2]}/${match[1]}`
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

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