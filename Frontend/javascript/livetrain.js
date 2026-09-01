document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // URL PARAMETERS
    // =========================================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const trainNo =
        params.get("trainNo") || "-";

    const trainName =
        params.get("trainName") || "Train";

    const source =
        params.get("from") || "Source";

    const destination =
        params.get("to") || "Destination";

    const journeyDate =
        params.get("date") || "-";

    const departure =
        params.get("departure") || "-";

    const arrival =
        params.get("arrival") || "-";


    // =========================================================
    // DATABASE COORDINATES
    // =========================================================

    const sourceCode =
        params.get("sourceCode") || "";

    const sourceLatitude =
        Number(
            params.get("sourceLat")
        );

    const sourceLongitude =
        Number(
            params.get("sourceLng")
        );

    const destinationCode =
        params.get("destinationCode") || "";

    const destinationLatitude =
        Number(
            params.get("destinationLat")
        );

    const destinationLongitude =
        Number(
            params.get("destinationLng")
        );


    // =========================================================
    // ELEMENTS
    // =========================================================

    const trainNoEl =
        document.getElementById("trainNo");

    const trainNameEl =
        document.getElementById("trainName");

    const sourceStationEl =
        document.getElementById(
            "sourceStation"
        );

    const destinationStationEl =
        document.getElementById(
            "destinationStation"
        );

    const currentStationEl =
        document.getElementById(
            "currentStation"
        );

    const nextStationEl =
        document.getElementById(
            "nextStation"
        );

    const trainSpeedEl =
        document.getElementById(
            "trainSpeed"
        );

    const delayStatusEl =
        document.getElementById(
            "delayStatus"
        );

    const nextStationETAEl =
        document.getElementById(
            "nextStationETA"
        );

    const distanceRemainingEl =
        document.getElementById(
            "distanceRemaining"
        );

    const lastUpdatedEl =
        document.getElementById(
            "lastUpdated"
        );

    const journeyPercentageEl =
        document.getElementById(
            "journeyPercentage"
        );

    const journeyProgressBar =
        document.getElementById(
            "journeyProgressBar"
        );

    const stationTimeline =
        document.getElementById(
            "stationTimeline"
        );

    const journeyDateEl =
        document.getElementById(
            "journeyDate"
        );

    const departureTimeEl =
        document.getElementById(
            "departureTime"
        );

    const arrivalTimeEl =
        document.getElementById(
            "arrivalTime"
        );

    const platformNumberEl =
        document.getElementById(
            "platformNumber"
        );

    const mapLoading =
        document.getElementById(
            "mapLoading"
        );

    const backBtn =
        document.getElementById(
            "backBtn"
        );

    const runningStatusEl =
        document.getElementById(
            "runningStatus"
        );


    // =========================================================
    // VALIDATE COORDINATES
    // =========================================================

    const hasValidCoordinates =
        Number.isFinite(sourceLatitude) &&
        Number.isFinite(sourceLongitude) &&
        Number.isFinite(destinationLatitude) &&
        Number.isFinite(destinationLongitude);


    // =========================================================
    // BASIC INFORMATION
    // =========================================================

    if (trainNoEl) {

        trainNoEl.textContent =
            trainNo;

    }


    if (trainNameEl) {

        trainNameEl.textContent =
            trainName;

    }


    if (sourceStationEl) {

        sourceStationEl.textContent =
            sourceCode
                ? `${source} (${sourceCode})`
                : source;

    }


    if (destinationStationEl) {

        destinationStationEl.textContent =
            destinationCode
                ? `${destination} (${destinationCode})`
                : destination;

    }


    if (journeyDateEl) {

        journeyDateEl.textContent =
            formatDate(
                journeyDate
            );

    }


    if (departureTimeEl) {

        departureTimeEl.textContent =
            formatTime(
                departure
            );

    }


    if (arrivalTimeEl) {

        arrivalTimeEl.textContent =
            formatTime(
                arrival
            );

    }


    if (runningStatusEl) {

        runningStatusEl.textContent =
            "Running";

    }


    // =========================================================
    // BACK BUTTON
    // =========================================================

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            () => {

                if (
                    window.history.length > 1
                ) {

                    window.history.back();

                }
                else {

                    window.location.href =
                        "search.html";

                }

            }
        );

    }


    // =========================================================
    // INVALID LOCATION
    // =========================================================

    if (!hasValidCoordinates) {

        console.error(
            "Invalid coordinates:",
            {
                sourceLatitude,
                sourceLongitude,
                destinationLatitude,
                destinationLongitude
            }
        );


        if (mapLoading) {

            mapLoading.innerHTML = `

                <div class="text-center p-4">

                    <i
                        class="fa-solid fa-triangle-exclamation fa-2x mb-3">
                    </i>

                    <h5>
                        Location unavailable
                    </h5>

                    <p>
                        Coordinates are not available
                        for this train.
                    </p>

                </div>

            `;

        }


        if (runningStatusEl) {

            runningStatusEl.textContent =
                "Location Unavailable";

        }


        return;

    }


    // =========================================================
    // ROUTE DATA
    // =========================================================

    const routeStations = [

        {
            name: source,
            code: sourceCode || "SRC",
            lat: sourceLatitude,
            lng: sourceLongitude,
            time: formatTime(departure)
        },

        {
            name: destination,
            code: destinationCode || "DST",
            lat: destinationLatitude,
            lng: destinationLongitude,
            time: formatTime(arrival)
        }

    ];


    // =========================================================
    // SIMULATION
    // =========================================================

    let journeyProgress =
        0.20;

    let speed =
        78;

    let delayMinutes =
        5;

    let map =
        null;

    let trainMarker =
        null;

    let routeLine =
        null;

    let animationTimer =
        null;


    // =========================================================
    // MAP
    // =========================================================

    function initializeMap() {

        if (
            typeof L === "undefined"
        ) {

            console.error(
                "Leaflet library is not loaded."
            );


            showMapError(
                "Leaflet map library could not be loaded."
            );


            return;

        }


        const mapElement =
            document.getElementById(
                "map"
            );


        if (!mapElement) {

            console.error(
                "Map element not found."
            );

            return;

        }


        // =====================================================
        // CREATE LEAFLET MAP
        // =====================================================

        map =
            L.map(
                "map",
                {
                    zoomControl: true
                }
            );


        // =====================================================
        // MAP PROVIDERS
        // =====================================================

        const osmLayer =
            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    maxZoom: 19,

                    attribution:
                        "&copy; OpenStreetMap contributors"
                }
            );


        const cartoLayer =
            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                {
                    maxZoom: 20,

                    attribution:
                        "&copy; OpenStreetMap contributors &copy; CARTO"
                }
            );


        const esriLayer =
            L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
                {
                    maxZoom: 19,

                    attribution:
                        "Tiles &copy; Esri"
                }
            );


        // =====================================================
        // TILE FALLBACK
        // =====================================================

        const mapProviders = [

            {
                name: "OpenStreetMap",
                layer: osmLayer
            },

            {
                name: "CARTO",
                layer: cartoLayer
            },

            {
                name: "Esri",
                layer: esriLayer
            }

        ];


        let providerIndex =
            0;

        let activeLayer =
            null;

        let providerChanging =
            false;


        function loadProvider(index) {

            if (
                index >=
                mapProviders.length
            ) {

                console.error(
                    "All map providers failed."
                );


                showMapError(
                    "Unable to load map tiles. Check your internet connection or browser network settings."
                );


                return;

            }


            providerIndex =
                index;


            const provider =
                mapProviders[
                    providerIndex
                ];


            console.log(
                "Loading map provider:",
                provider.name
            );


            if (
                activeLayer &&
                map.hasLayer(
                    activeLayer
                )
            ) {

                map.removeLayer(
                    activeLayer
                );

            }


            activeLayer =
                provider.layer;


            providerChanging =
                false;


            activeLayer.addTo(
                map
            );


            activeLayer.once(
                "tileload",
                () => {

                    console.log(
                        "Map provider loaded:",
                        provider.name
                    );


                    providerChanging =
                        false;


                    if (mapLoading) {

                        mapLoading.style.display =
                            "none";

                    }

                }
            );


            activeLayer.once(
                "tileerror",
                () => {

                    if (
                        providerChanging
                    ) {

                        return;

                    }


                    providerChanging =
                        true;


                    console.warn(
                        `${provider.name} tiles failed. Trying another provider...`
                    );


                    setTimeout(
                        () => {

                            loadProvider(
                                providerIndex + 1
                            );

                        },
                        500
                    );

                }
            );

        }


        // =====================================================
        // START MAP PROVIDER
        // =====================================================

        loadProvider(
            0
        );


        // =====================================================
        // ROUTE
        // =====================================================

        const routeCoordinates =
            routeStations.map(
                station => [

                    station.lat,

                    station.lng

                ]
            );


        // =====================================================
        // ROUTE LINE
        // =====================================================

        routeLine =
            L.polyline(
                routeCoordinates,
                {
                    weight: 5,
                    opacity: 0.9
                }
            ).addTo(
                map
            );


        // =====================================================
        // STATION MARKERS
        // =====================================================

        createStationMarker(
            routeStations[0],
            "Source Station"
        );


        createStationMarker(
            routeStations[1],
            "Destination Station"
        );


        // =====================================================
        // TRAIN ICON
        // =====================================================

        const trainIcon =
            L.divIcon(
                {

                    className:
                        "",

                    html: `

                        <div class="live-train-marker">

                            <i
                                class="fa-solid fa-train">
                            </i>

                        </div>

                    `,

                    iconSize: [
                        44,
                        44
                    ],

                    iconAnchor: [
                        22,
                        22
                    ]

                }
            );


        // =====================================================
        // TRAIN POSITION
        // =====================================================

        trainMarker =
            L.marker(
                calculateTrainPosition(),
                {
                    icon: trainIcon
                }
            ).addTo(
                map
            );


        trainMarker.bindPopup(
            `

                <strong>
                    ${escapeHtml(trainName)}
                </strong>

                <br>

                Train No:
                ${escapeHtml(trainNo)}

                <br>

                ${escapeHtml(source)}
                →

                ${escapeHtml(destination)}

                <br>

                <small>
                    Demo simulated live location
                </small>

            `
        );


        // =====================================================
        // MAP BOUNDS
        // =====================================================

        const bounds =
            L.latLngBounds(
                routeCoordinates
            );


        map.fitBounds(
            bounds,
            {
                padding: [
                    60,
                    60
                ]
            }
        );


        // =====================================================
        // MAP RESIZE FIX
        // =====================================================

        setTimeout(
            () => {

                if (map) {

                    map.invalidateSize();


                    map.fitBounds(
                        bounds,
                        {
                            padding: [
                                60,
                                60
                            ]
                        }
                    );

                }

            },
            500
        );

    }


    // =========================================================
    // MAP ERROR
    // =========================================================

    function showMapError(
        message
    ) {

        if (!mapLoading) {
            return;
        }


        mapLoading.style.display =
            "flex";


        mapLoading.innerHTML = `

            <div class="text-center p-4">

                <i
                    class="fa-solid fa-map-location-dot fa-2x mb-3">
                </i>

                <h5>
                    Map unavailable
                </h5>

                <p>
                    ${escapeHtml(message)}
                </p>

            </div>

        `;

    }


    // =========================================================
    // STATION MARKER
    // =========================================================

    function createStationMarker(
        station,
        type
    ) {

        if (!map) {
            return;
        }


        const marker =
            L.circleMarker(
                [
                    station.lat,
                    station.lng
                ],
                {
                    radius: 9,
                    weight: 3,
                    fillOpacity: 1
                }
            ).addTo(
                map
            );


        marker.bindPopup(
            `

                <strong>
                    ${escapeHtml(
                        station.name
                    )}
                </strong>

                <br>

                ${escapeHtml(type)}

                <br>

                Station Code:
                ${escapeHtml(
                    station.code
                )}

                <br>

                Scheduled:
                ${escapeHtml(
                    station.time
                )}

            `
        );


        marker.bindTooltip(
            station.name,
            {
                direction: "top",

                offset: [
                    0,
                    -10
                ]
            }
        );

    }


    // =========================================================
    // TRAIN POSITION
    // =========================================================

    function calculateTrainPosition() {

        const start =
            routeStations[0];

        const end =
            routeStations[1];


        const latitude =
            start.lat +
            (
                end.lat -
                start.lat
            ) *
            journeyProgress;


        const longitude =
            start.lng +
            (
                end.lng -
                start.lng
            ) *
            journeyProgress;


        return [
            latitude,
            longitude
        ];

    }


    // =========================================================
    // DISTANCE
    // =========================================================

    function calculateDistance(
        lat1,
        lng1,
        lat2,
        lng2
    ) {

        const earthRadius =
            6371;


        const dLat =
            degreesToRadians(
                lat2 -
                lat1
            );


        const dLng =
            degreesToRadians(
                lng2 -
                lng1
            );


        const firstLatitude =
            degreesToRadians(
                lat1
            );


        const secondLatitude =
            degreesToRadians(
                lat2
            );


        const a =
            Math.sin(
                dLat / 2
            ) ** 2

            +

            Math.cos(
                firstLatitude
            )

            *

            Math.cos(
                secondLatitude
            )

            *

            Math.sin(
                dLng / 2
            ) ** 2;


        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(
                    1 -
                    a
                )
            );


        return (
            earthRadius *
            c
        );

    }


    function degreesToRadians(
        degrees
    ) {

        return (
            degrees *
            Math.PI /
            180
        );

    }


    function getTotalDistance() {

        return calculateDistance(

            sourceLatitude,

            sourceLongitude,

            destinationLatitude,

            destinationLongitude

        );

    }


    function getRemainingDistance() {

        return Math.max(
            0,
            getTotalDistance() *
            (
                1 -
                journeyProgress
            )
        );

    }


    // =========================================================
    // ETA
    // =========================================================

    function calculateETA(
        distance
    ) {

        if (
            speed <= 0
        ) {

            return "Arrived";

        }


        const travelHours =
            distance /
            speed;


        const milliseconds =
            travelHours *
            60 *
            60 *
            1000;


        const eta =
            new Date(
                Date.now() +
                milliseconds
            );


        return eta.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    // =========================================================
    // DASHBOARD
    // =========================================================

    function updateDashboard() {

        const percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    Math.round(
                        journeyProgress *
                        100
                    )
                )
            );


        const remainingDistance =
            getRemainingDistance();


        // CURRENT LOCATION

        if (currentStationEl) {

            if (
                percentage >=
                100
            ) {

                currentStationEl.textContent =
                    destination;

            }
            else {

                currentStationEl.textContent =
                    `Between ${source} and ${destination}`;

            }

        }


        // NEXT STATION

        if (nextStationEl) {

            nextStationEl.textContent =
                percentage >= 100
                    ? "Destination Reached"
                    : destination;

        }


        // SPEED

        if (trainSpeedEl) {

            trainSpeedEl.textContent =
                Math.round(
                    speed
                );

        }


        // DELAY

        if (delayStatusEl) {

            if (
                percentage >=
                100
            ) {

                delayStatusEl.textContent =
                    "Arrived";

            }
            else if (
                delayMinutes <= 0
            ) {

                delayStatusEl.textContent =
                    "On Time";

            }
            else {

                delayStatusEl.textContent =
                    `${delayMinutes} min`;

            }

        }


        // ETA

        if (nextStationETAEl) {

            nextStationETAEl.textContent =
                percentage >= 100
                    ? "Arrived"
                    : calculateETA(
                        remainingDistance
                    );

        }


        // DISTANCE

        if (distanceRemainingEl) {

            distanceRemainingEl.textContent =
                Math.round(
                    remainingDistance
                );

        }


        // PROGRESS

        if (journeyPercentageEl) {

            journeyPercentageEl.textContent =
                `${percentage}%`;

        }


        if (journeyProgressBar) {

            journeyProgressBar.style.width =
                `${percentage}%`;

        }


        // PLATFORM

        if (platformNumberEl) {

            platformNumberEl.textContent =
                "-";

        }


        // STATUS

        if (runningStatusEl) {

            runningStatusEl.textContent =
                percentage >= 100
                    ? "Arrived"
                    : "Running";

        }


        // UPDATED TIME

        if (lastUpdatedEl) {

            lastUpdatedEl.textContent =
                new Date()
                    .toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                        }
                    );

        }


        renderTimeline();

    }


    // =========================================================
    // TIMELINE
    // =========================================================

    function renderTimeline() {

        if (!stationTimeline) {
            return;
        }


        stationTimeline.innerHTML =
            "";


        routeStations.forEach(
            (
                station,
                index
            ) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.classList.add(
                    "timeline-item"
                );


                let statusText =
                    "Upcoming";


                if (
                    index === 0
                ) {

                    item.classList.add(
                        "completed"
                    );


                    statusText =
                        "Departed";

                }


                if (
                    index === 1
                ) {

                    if (
                        journeyProgress >=
                        1
                    ) {

                        item.classList.add(
                            "completed"
                        );

                        item.classList.add(
                            "current"
                        );


                        statusText =
                            "Destination Reached";

                    }
                    else {

                        statusText =
                            "Final Destination";

                    }

                }


                item.innerHTML = `

                    <div
                        class="timeline-dot">
                    </div>

                    <div
                        class="timeline-info">

                        <h4>
                            ${escapeHtml(
                                station.name
                            )}
                        </h4>

                        <span>

                            ${escapeHtml(
                                station.code
                            )}

                            •

                            ${escapeHtml(
                                statusText
                            )}

                        </span>

                    </div>

                    <div
                        class="timeline-time">

                        <strong>
                            ${escapeHtml(
                                station.time
                            )}
                        </strong>

                    </div>

                `;


                stationTimeline.appendChild(
                    item
                );

            }
        );

    }


    // =========================================================
    // MOVE TRAIN
    // =========================================================

    function moveTrain() {

        if (
            journeyProgress >=
            1
        ) {

            finishJourney();

            return;

        }


        // 1% every 3 seconds

        journeyProgress +=
            0.01;


        if (
            journeyProgress >=
            1
        ) {

            journeyProgress =
                1;

        }


        // Demo speed

        speed =
            65 +
            Math.random() *
            30;


        const position =
            calculateTrainPosition();


        if (trainMarker) {

            trainMarker.setLatLng(
                position
            );


            trainMarker.setPopupContent(
                `

                    <strong>
                        ${escapeHtml(trainName)}
                    </strong>

                    <br>

                    Train No:
                    ${escapeHtml(trainNo)}

                    <br>

                    Speed:
                    ${Math.round(speed)}
                    km/h

                    <br>

                    Journey:
                    ${Math.round(
                        journeyProgress *
                        100
                    )}%

                    <br>

                    <small>
                        Demo simulated location
                    </small>

                `
            );

        }


        updateDashboard();


        if (
            journeyProgress >=
            1
        ) {

            finishJourney();

        }

    }


    // =========================================================
    // FINISH
    // =========================================================

    function finishJourney() {

        journeyProgress =
            1;


        speed =
            0;


        if (trainMarker) {

            trainMarker.setLatLng(
                [
                    destinationLatitude,
                    destinationLongitude
                ]
            );

        }


        updateDashboard();

        stopSimulation();

    }


    // =========================================================
    // START SIMULATION
    // =========================================================

    function startSimulation() {

        stopSimulation();


        if (
            journeyProgress >=
            1
        ) {

            return;

        }


        animationTimer =
            setInterval(
                moveTrain,
                3000
            );

    }


    // =========================================================
    // STOP SIMULATION
    // =========================================================

    function stopSimulation() {

        if (animationTimer) {

            clearInterval(
                animationTimer
            );


            animationTimer =
                null;

        }

    }


    // =========================================================
    // PAGE VISIBILITY
    // =========================================================

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                stopSimulation();

            }
            else if (
                journeyProgress <
                1
            ) {

                startSimulation();

            }

        }
    );


    // =========================================================
    // FORMAT TIME
    // =========================================================

    function formatTime(
        value
    ) {

        if (
            !value ||
            value === "-"
        ) {

            return "-";

        }


        const text =
            String(value);


        const match =
            text.match(
                /^(\d{2}):(\d{2})/
            );


        if (!match) {

            return text;

        }


        return (
            `${match[1]}:${match[2]}`
        );

    }


    // =========================================================
    // FORMAT DATE
    // =========================================================

    function formatDate(
        value
    ) {

        if (
            !value ||
            value === "-"
        ) {

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


    // =========================================================
    // ESCAPE HTML
    // =========================================================

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


    // =========================================================
    // INITIALIZE
    // =========================================================

    initializeMap();

    updateDashboard();

    startSimulation();


    // =========================================================
    // CLEANUP
    // =========================================================

    window.addEventListener(
        "beforeunload",
        () => {

            stopSimulation();

        }
    );

});