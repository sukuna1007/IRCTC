const db = require("../config/db");


// ==========================================
// BERTH PATTERN
// ==========================================

const berthPattern = [
    "Lower",
    "Middle",
    "Upper",
    "Lower",
    "Middle",
    "Upper",
    "Side Lower",
    "Side Upper"
];


// ==========================================
// ALLOCATE SEAT
// ==========================================

exports.allocateSeat = async (
    trainNo,
    journeyDate
) => {

    const seatsPerCoach =
        72;


    // ==========================================
    // GET ALL CURRENTLY ALLOCATED SEATS
    // ==========================================

    const result =
        await db.query(

            `SELECT
                coach,
                seat_number

             FROM bookings

             WHERE train_no = $1
             AND journey_date = $2
             AND LOWER(booking_status) = 'confirmed'
             AND coach IS NOT NULL
             AND seat_number IS NOT NULL`,

            [
                String(trainNo).trim(),
                journeyDate
            ]

        );


    const rows =
        result.rows;


    // ==========================================
    // FIND HIGHEST GLOBAL SEAT
    // ==========================================

    let highestGlobalSeat =
        0;


    rows.forEach(row => {

        const coach =
            String(
                row.coach || ""
            );


        const coachNumber =
            Number(
                coach.replace(
                    /\D/g,
                    ""
                )
            );


        const seatNumber =
            Number(
                row.seat_number
            );


        if (
            Number.isInteger(coachNumber) &&
            coachNumber > 0 &&
            Number.isInteger(seatNumber) &&
            seatNumber > 0 &&
            seatNumber <= seatsPerCoach
        ) {

            const globalSeat =
                ((coachNumber - 1) *
                    seatsPerCoach) +
                seatNumber;


            if (
                globalSeat >
                highestGlobalSeat
            ) {

                highestGlobalSeat =
                    globalSeat;

            }

        }

    });


    // ==========================================
    // NEXT SEAT
    // ==========================================

    const nextGlobalSeat =
        highestGlobalSeat + 1;


    // ==========================================
    // CALCULATE COACH
    // ==========================================

    const coachNumber =
        Math.floor(
            (nextGlobalSeat - 1) /
            seatsPerCoach
        ) + 1;


    // ==========================================
    // CALCULATE SEAT NUMBER
    // ==========================================

    const seatNumber =
        ((nextGlobalSeat - 1) %
            seatsPerCoach) + 1;


    const coach =
        `S${coachNumber}`;


    // ==========================================
    // BERTH TYPE
    // ==========================================

    const berthIndex =
        (seatNumber - 1) %
        berthPattern.length;


    const berthType =
        berthPattern[
            berthIndex
        ];


    // ==========================================
    // RETURN
    // ==========================================

    return {

        coach:
            coach,

        seatNumber:
            seatNumber,

        berthType:
            berthType

    };

};