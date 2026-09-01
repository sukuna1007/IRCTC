document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIG
    // ==========================================

    const API_BASE =
        "http://localhost:5000";


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

    const classSelect =
        document.getElementById("all-classes");

    const form =
        document.getElementById("bookingForm");

    const resultsBox =
        document.getElementById("trainResults");

    const swapBtn =
        document.getElementById("swapBtn");


    // ==========================================
    // STATIONS
    // ==========================================
    // name = station shown to user
    // code = railway station code
    // city = value used in trains table
    // ==========================================

    const stations = [

        {
            name: "New Delhi",
            code: "NDLS",
            city: "Delhi"
        },

        {
            name: "Delhi Junction",
            code: "DLI",
            city: "Delhi"
        },

        {
            name: "Delhi Cantt",
            code: "DEC",
            city: "Delhi"
        },

        {
            name: "Mumbai Central",
            code: "MMCT",
            city: "Mumbai"
        },

        {
            name: "Mumbai CSMT",
            code: "CSMT",
            city: "Mumbai"
        },

        {
            name: "Bandra Terminus",
            code: "BDTS",
            city: "Mumbai"
        },

        {
            name: "Ahmedabad Junction",
            code: "ADI",
            city: "Ahmedabad"
        },

        {
            name: "Surat",
            code: "ST",
            city: "Surat"
        },

        {
            name: "Vadodara Junction",
            code: "BRC",
            city: "Vadodara"
        },

        {
            name: "Rajkot Junction",
            code: "RJT",
            city: "Rajkot"
        },

        {
            name: "Veraval",
            code: "VRL",
            city: "Veraval"
        },

        {
            name: "Junagadh Junction",
            code: "JND",
            city: "Junagadh"
        },

        {
            name: "Somnath",
            code: "SMNH",
            city: "Somnath"
        },

        {
            name: "Jaipur Junction",
            code: "JP",
            city: "Jaipur"
        },

        {
            name: "Kota Junction",
            code: "KOTA",
            city: "Kota"
        },

        {
            name: "Howrah Junction",
            code: "HWH",
            city: "Kolkata"
        },

        {
            name: "Sealdah",
            code: "SDAH",
            city: "Kolkata"
        },

        {
            name: "Chennai Central",
            code: "MAS",
            city: "Chennai"
        },

        {
            name: "Bengaluru City Junction",
            code: "SBC",
            city: "Bengaluru"
        },

        {
            name: "Hyderabad Deccan",
            code: "HYB",
            city: "Hyderabad"
        },

        {
            name: "Pune Junction",
            code: "PUNE",
            city: "Pune"
        },

        {
            name: "Nagpur Junction",
            code: "NGP",
            city: "Nagpur"
        },

        {
            name: "Lucknow",
            code: "LKO",
            city: "Lucknow"
        },

        {
            name: "Kanpur Central",
            code: "CNB",
            city: "Kanpur"
        },

        {
            name: "Varanasi Junction",
            code: "BSB",
            city: "Varanasi"
        },

        {
            name: "Bhopal Junction",
            code: "BPL",
            city: "Bhopal"
        },

        {
            name: "Indore Junction",
            code: "INDB",
            city: "Indore"
        }

    ];


    // ==========================================
    // FIND STATION
    // ==========================================

    function findStation(
        name,
        code
    ) {

        const cleanName =
            String(
                name || ""
            )
                .trim()
                .toLowerCase();

        const cleanCode =
            String(
                code || ""
            )
                .trim()
                .toLowerCase();


        return stations.find(
            station => {

                const stationName =
                    station.name
                        .toLowerCase();

                const stationCode =
                    station.code
                        .toLowerCase();

                return (
                    (
                        cleanCode &&
                        stationCode === cleanCode
                    )

                    ||

                    (
                        cleanName &&
                        stationName === cleanName
                    )
                );

            }
        ) || null;

    }


    // ==========================================
    // NORMALIZE DATE
    // ==========================================

    function normalizeDateForInput(value) {

        if (!value) {
            return "";
        }


        const dateValue =
            String(value).trim();


        // YYYY-MM-DD

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                dateValue
            )
        ) {

            return dateValue;

        }


        // DD/MM/YYYY

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


        // DD-MM-YYYY

        const dashMatch =
            dateValue.match(
                /^(\d{2})-(\d{2})-(\d{4})$/
            );


        if (dashMatch) {

            return (
                `${dashMatch[3]}-` +
                `${dashMatch[2]}-` +
                `${dashMatch[1]}`
            );

        }


        return "";

    }


    // ==========================================
    // URL VALUES
    // ==========================================

    const fromParam =
        params.get("from");

    const toParam =
        params.get("to");

    const fromCodeParam =
        params.get("fromCode");

    const toCodeParam =
        params.get("toCode");

    const fromCityParam =
        params.get("fromCity");

    const toCityParam =
        params.get("toCity");

    const dateParam =
        params.get("date");

    const classParam =
        params.get("class");


    // ==========================================
    // FILL FROM
    // ==========================================

    if (
        fromInput &&
        fromParam
    ) {

        fromInput.value =
            fromParam;

        fromInput.dataset.stationName =
            fromParam;


        if (fromCodeParam) {

            fromInput.dataset.stationCode =
                fromCodeParam;

        }


        if (fromCityParam) {

            fromInput.dataset.stationCity =
                fromCityParam;

        }
        else {

            const station =
                findStation(
                    fromParam,
                    fromCodeParam
                );


            if (station) {

                fromInput.dataset.stationCity =
                    station.city;

            }

        }

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

        toInput.dataset.stationName =
            toParam;


        if (toCodeParam) {

            toInput.dataset.stationCode =
                toCodeParam;

        }


        if (toCityParam) {

            toInput.dataset.stationCity =
                toCityParam;

        }
        else {

            const station =
                findStation(
                    toParam,
                    toCodeParam
                );


            if (station) {

                toInput.dataset.stationCity =
                    station.city;

            }

        }

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
    // FILL CLASS
    // ==========================================

    if (
        classSelect &&
        classParam
    ) {

        const exists =
            Array.from(
                classSelect.options
            ).some(
                option =>
                    option.value ===
                    classParam
            );


        if (exists) {

            classSelect.value =
                classParam;

        }

    }


    // ==========================================
    // MINIMUM DATE
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
    // STATION AUTOCOMPLETE
    // ==========================================

    function setupStationAutocomplete(input) {

        if (!input) {
            return;
        }


        const wrapper =
            input.parentElement;


        if (!wrapper) {
            return;
        }


        wrapper.style.position =
            "relative";


        const dropdown =
            document.createElement(
                "div"
            );


        dropdown.className =
            "station-suggestions";


        Object.assign(
            dropdown.style,
            {
                position: "absolute",
                top: "100%",
                left: "0",
                right: "0",
                zIndex: "9999",
                background: "#ffffff",
                border: "1px solid #ddd",
                borderRadius: "10px",
                marginTop: "5px",
                maxHeight: "260px",
                overflowY: "auto",
                boxShadow:
                    "0 10px 30px rgba(0,0,0,0.15)",
                display: "none"
            }
        );


        wrapper.appendChild(
            dropdown
        );


        // ======================================
        // SHOW STATIONS
        // ======================================

        function showStations(list) {

            dropdown.innerHTML =
                "";


            if (
                !list ||
                list.length === 0
            ) {

                dropdown.innerHTML = `

                    <div
                        style="
                            padding:15px;
                            color:#777;
                            font-size:13px;
                        ">

                        No station found

                    </div>

                `;


                dropdown.style.display =
                    "block";


                return;

            }


            list.forEach(
                station => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    Object.assign(
                        item.style,
                        {
                            padding: "12px 15px",
                            cursor: "pointer",
                            borderBottom:
                                "1px solid #eee",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                        }
                    );


                    item.innerHTML = `

                        <i
                            class="fa-solid fa-train"
                            style="
                                color:#ff7300;
                                width:20px;
                            ">
                        </i>

                        <div>

                            <div
                                style="
                                    font-weight:700;
                                    color:#222;
                                ">

                                ${escapeHtml(
                                    station.name
                                )}

                            </div>

                            <small
                                style="
                                    color:#777;
                                ">

                                ${escapeHtml(
                                    station.code
                                )}
                                •
                                ${escapeHtml(
                                    station.city
                                )}

                            </small>

                        </div>

                    `;


                    item.addEventListener(
                        "mouseenter",
                        () => {

                            item.style.background =
                                "#fff3e8";

                        }
                    );


                    item.addEventListener(
                        "mouseleave",
                        () => {

                            item.style.background =
                                "#ffffff";

                        }
                    );


                    item.addEventListener(
                        "mousedown",
                        event => {

                            event.preventDefault();


                            input.value =
                                station.name;


                            input.dataset.stationName =
                                station.name;


                            input.dataset.stationCode =
                                station.code;


                            input.dataset.stationCity =
                                station.city;


                            dropdown.style.display =
                                "none";

                        }
                    );


                    dropdown.appendChild(
                        item
                    );

                }
            );


            dropdown.style.display =
                "block";

        }


        // ======================================
        // FILTER STATIONS
        // ======================================

        function filterStations() {

            const search =
                input.value
                    .trim()
                    .toLowerCase();


            if (!search) {

                showStations(
                    stations.slice(
                        0,
                        8
                    )
                );

                return;

            }


            const matches =
                stations
                    .filter(
                        station => {

                            return (
                                station.name
                                    .toLowerCase()
                                    .includes(search)

                                ||

                                station.code
                                    .toLowerCase()
                                    .includes(search)

                                ||

                                station.city
                                    .toLowerCase()
                                    .includes(search)
                            );

                        }
                    )
                    .slice(
                        0,
                        8
                    );


            showStations(
                matches
            );

        }


        // ======================================
        // INPUT
        // ======================================

        input.addEventListener(
            "input",
            () => {

                delete input.dataset.stationName;
                delete input.dataset.stationCode;
                delete input.dataset.stationCity;


                filterStations();

            }
        );


        // ======================================
        // FOCUS
        // ======================================

        input.addEventListener(
            "focus",
            () => {

                filterStations();

            }
        );


        // ======================================
        // ESCAPE
        // ======================================

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    dropdown.style.display =
                        "none";

                }

            }
        );


        // ======================================
        // CLICK OUTSIDE
        // ======================================

        document.addEventListener(
            "click",
            event => {

                if (
                    !wrapper.contains(
                        event.target
                    )
                ) {

                    dropdown.style.display =
                        "none";

                }

            }
        );

    }


    // ==========================================
    // ENABLE AUTOCOMPLETE
    // ==========================================

    setupStationAutocomplete(
        fromInput
    );

    setupStationAutocomplete(
        toInput
    );


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

                const fromData = {

                    value:
                        fromInput.value,

                    name:
                        fromInput.dataset.stationName || "",

                    code:
                        fromInput.dataset.stationCode || "",

                    city:
                        fromInput.dataset.stationCity || ""

                };


                const toData = {

                    value:
                        toInput.value,

                    name:
                        toInput.dataset.stationName || "",

                    code:
                        toInput.dataset.stationCode || "",

                    city:
                        toInput.dataset.stationCity || ""

                };


                // Visible values

                fromInput.value =
                    toData.value;

                toInput.value =
                    fromData.value;


                // From metadata

                setDatasetValue(
                    fromInput,
                    "stationName",
                    toData.name
                );

                setDatasetValue(
                    fromInput,
                    "stationCode",
                    toData.code
                );

                setDatasetValue(
                    fromInput,
                    "stationCity",
                    toData.city
                );


                // To metadata

                setDatasetValue(
                    toInput,
                    "stationName",
                    fromData.name
                );

                setDatasetValue(
                    toInput,
                    "stationCode",
                    fromData.code
                );

                setDatasetValue(
                    toInput,
                    "stationCity",
                    fromData.city
                );

            }
        );

    }


    // ==========================================
    // SEARCH TRAINS
    // ==========================================

    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                // ==================================
                // DISPLAY VALUES
                // ==================================

                const fromDisplay =
                    fromInput
                        ?
                        (
                            fromInput.dataset.stationName ||
                            fromInput.value.trim()
                        )
                        :
                        "";


                const toDisplay =
                    toInput
                        ?
                        (
                            toInput.dataset.stationName ||
                            toInput.value.trim()
                        )
                        :
                        "";


                // ==================================
                // DATABASE SEARCH VALUES
                // ==================================
                // trains table contains:
                // Delhi, Mumbai, Bhopal, Ahmedabad...
                // ==================================

                const fromSearch =
                    getSearchCity(
                        fromInput
                    );


                const toSearch =
                    getSearchCity(
                        toInput
                    );


                const fromCode =
                    fromInput
                        ?
                        (
                            fromInput.dataset.stationCode ||
                            ""
                        )
                        :
                        "";


                const toCode =
                    toInput
                        ?
                        (
                            toInput.dataset.stationCode ||
                            ""
                        )
                        :
                        "";


                const date =
                    dateInput
                        ?
                        dateInput.value
                        :
                        "";


                const trainClass =
                    classSelect
                        ?
                        classSelect.value
                        :
                        "ALL CLASSES";


                // ==================================
                // VALIDATION
                // ==================================

                if (
                    !fromSearch ||
                    !toSearch ||
                    !date
                ) {

                    alert(
                        "Please enter From, To and Journey Date."
                    );

                    return;

                }


                if (
                    fromSearch.toLowerCase() ===
                    toSearch.toLowerCase()
                ) {

                    alert(
                        "From and To stations cannot be the same."
                    );

                    return;

                }


                // ==================================
                // LOADING
                // ==================================

                if (resultsBox) {

                    resultsBox.innerHTML = `

                        <div class="text-center my-4">

                            <div
                                class="spinner-border text-primary"
                                role="status">
                            </div>

                            <h5 class="mt-3">
                                Searching trains...
                            </h5>

                        </div>

                    `;

                }


                try {

                    // ==================================
                    // API URL
                    // ==================================

                    const url =
                        `${API_BASE}/api/trains/search` +
                        `?from=${encodeURIComponent(fromSearch)}` +
                        `&to=${encodeURIComponent(toSearch)}`;


                    console.log(
                        "Searching URL:",
                        url
                    );


                    console.log(
                        "Display Route:",
                        fromDisplay,
                        "→",
                        toDisplay
                    );


                    console.log(
                        "Database Route:",
                        fromSearch,
                        "→",
                        toSearch
                    );


                    const response =
                        await fetch(
                            url
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
                            "Unable to search trains."
                        );

                    }


                    // ==================================
                    // TRAINS
                    // ==================================

                    const trains =
                        Array.isArray(
                            data.trains
                        )
                            ?
                            data.trains
                            :
                            [];


                    // ==================================
                    // DISPLAY
                    // ==================================

                    displayTrains(
                        trains,
                        date
                    );


                    // ==================================
                    // UPDATE BROWSER URL
                    // ==================================

                    const newUrl =
                        `search.html?from=${encodeURIComponent(fromDisplay)}` +
                        `&to=${encodeURIComponent(toDisplay)}` +
                        `&fromCode=${encodeURIComponent(fromCode)}` +
                        `&toCode=${encodeURIComponent(toCode)}` +
                        `&fromCity=${encodeURIComponent(fromSearch)}` +
                        `&toCity=${encodeURIComponent(toSearch)}` +
                        `&date=${encodeURIComponent(date)}` +
                        `&class=${encodeURIComponent(trainClass)}`;


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
    // GET SEARCH CITY
    // ==========================================

    function getSearchCity(input) {

        if (!input) {
            return "";
        }


        if (
            input.dataset.stationCity
        ) {

            return input.dataset.stationCity.trim();

        }


        const value =
            input.value.trim();


        const station =
            stations.find(
                item =>
                    item.name.toLowerCase() ===
                    value.toLowerCase()
            );


        if (station) {

            return station.city;

        }


        // User may type Delhi/Mumbai directly

        return value;

    }


    // ==========================================
    // DATASET HELPER
    // ==========================================

    function setDatasetValue(
        element,
        key,
        value
    ) {

        if (!element) {
            return;
        }


        if (value) {

            element.dataset[key] =
                value;

        }
        else {

            delete element.dataset[key];

        }

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
                            fromInput?.value || ""
                        )}
                    </strong>

                    to

                    <strong>
                        ${escapeHtml(
                            toInput?.value || ""
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

        trains.forEach(
            train => {

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
                        train.available_seats ||
                        0
                    );


                const fare =
                    Number(
                        train.fare ||
                        0
                    );


                // ==================================
                // NEW DATABASE LOCATION DATA
                // ==================================

                const sourceCode =
                    train.source_code ||
                    "";


                const sourceLatitude =
                    train.source_latitude;


                const sourceLongitude =
                    train.source_longitude;


                const destinationCode =
                    train.destination_code ||
                    "";


                const destinationLatitude =
                    train.destination_latitude;


                const destinationLongitude =
                    train.destination_longitude;


                // ==================================
                // CARD
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
                            class="d-flex justify-content-between align-items-start flex-wrap gap-3">

                            <div>

                                <h4
                                    class="text-primary fw-bold mb-1">

                                    <i
                                        class="fa-solid fa-train">
                                    </i>

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
                                    class="text-success fw-bold mb-0">

                                    ₹${fare.toFixed(2)}

                                </h4>

                                <small class="text-muted">
                                    per passenger
                                </small>

                            </div>

                        </div>

                        <hr>

                        <div class="row text-center g-3">

                            <div class="col-md-3">

                                <small class="text-muted">
                                    From
                                </small>

                                <h5 class="fw-bold">

                                    ${escapeHtml(
                                        fromStation
                                    )}

                                    ${
                                        sourceCode
                                            ?
                                            `<small class="text-muted">
                                                (${escapeHtml(sourceCode)})
                                            </small>`
                                            :
                                            ""
                                    }

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

                                    ${
                                        destinationCode
                                            ?
                                            `<small class="text-muted">
                                                (${escapeHtml(destinationCode)})
                                            </small>`
                                            :
                                            ""
                                    }

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
                                            ?
                                            "text-success"
                                            :
                                            "text-danger"
                                    } fw-bold">

                                    ${escapeHtml(
                                        seats
                                    )}

                                </h5>

                            </div>

                        </div>

                        <hr>

                        <div
                            class="d-flex justify-content-between align-items-center flex-wrap gap-3">

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

                            <div
                                class="d-flex gap-2 flex-wrap">

                                <button
                                    type="button"
                                    class="btn btn-outline-primary px-4 live-location-btn">

                                    <i
                                        class="fa-solid fa-location-dot">
                                    </i>

                                    Live Location

                                </button>

                                <button
                                    type="button"
                                    class="btn btn-success px-4 book-btn"
                                    ${
                                        seats <= 0
                                            ?
                                            "disabled"
                                            :
                                            ""
                                    }>

                                    <i
                                        class="fa-solid fa-ticket">
                                    </i>

                                    ${
                                        seats <= 0
                                            ?
                                            "Sold Out"
                                            :
                                            "Book Now"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                `;


                // ==================================
                // BOOK BUTTON
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


                // ==================================
                // LIVE LOCATION BUTTON
                // ==================================

                const liveLocationButton =
                    card.querySelector(
                        ".live-location-btn"
                    );


                if (liveLocationButton) {

                    liveLocationButton.addEventListener(
                        "click",
                        () => {

                            openLiveLocation(
                                trainNo,
                                trainName,
                                fromStation,
                                toStation,
                                journeyDate,
                                departure,
                                arrival,

                                sourceCode,
                                sourceLatitude,
                                sourceLongitude,

                                destinationCode,
                                destinationLatitude,
                                destinationLongitude
                            );

                        }
                    );

                }


                resultsBox.appendChild(
                    card
                );

            }
        );

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
// OPEN LIVE LOCATION
// ==========================================

function openLiveLocation(
    trainNo,
    trainName,
    from,
    to,
    date,
    departure,
    arrival,

    sourceCode,
    sourceLatitude,
    sourceLongitude,

    destinationCode,
    destinationLatitude,
    destinationLongitude
) {

    // ==========================================
    // VALIDATE DATABASE COORDINATES
    // ==========================================

    const sourceLat =
        Number(
            sourceLatitude
        );

    const sourceLng =
        Number(
            sourceLongitude
        );

    const destinationLat =
        Number(
            destinationLatitude
        );

    const destinationLng =
        Number(
            destinationLongitude
        );


    if (
        !Number.isFinite(sourceLat) ||
        !Number.isFinite(sourceLng) ||
        !Number.isFinite(destinationLat) ||
        !Number.isFinite(destinationLng)
    ) {

        alert(
            "Location coordinates are not available for this train."
        );

        return;

    }


    // ==========================================
    // LIVE TRAIN URL
    // ==========================================

    const url =
        `live-train.html?` +

        `trainNo=${encodeURIComponent(trainNo)}` +

        `&trainName=${encodeURIComponent(trainName)}` +

        `&from=${encodeURIComponent(from)}` +

        `&to=${encodeURIComponent(to)}` +

        `&date=${encodeURIComponent(date)}` +

        `&departure=${encodeURIComponent(departure)}` +

        `&arrival=${encodeURIComponent(arrival)}` +

        `&sourceCode=${encodeURIComponent(sourceCode || "")}` +

        `&sourceLat=${encodeURIComponent(sourceLat)}` +

        `&sourceLng=${encodeURIComponent(sourceLng)}` +

        `&destinationCode=${encodeURIComponent(destinationCode || "")}` +

        `&destinationLat=${encodeURIComponent(destinationLat)}` +

        `&destinationLng=${encodeURIComponent(destinationLng)}`;


    console.log(
        "Live Train URL:",
        url
    );


    window.location.href =
        url;

}


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
    // BOOKING URL
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


    window.location.href =
        url;

}


// ==========================================
// FORMAT DATE
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
        `${match[3]}/` +
        `${match[2]}/` +
        `${match[1]}`
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