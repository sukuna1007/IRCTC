const trainService =
    require("../services/trainservice");


// ==========================================
// SEARCH TRAINS
// ==========================================
// GET /api/trains/search?from=Delhi&to=Mumbai
// ==========================================

exports.searchTrains = async (req, res) => {

    try {

        // ==========================================
        // GET SEARCH VALUES
        // ==========================================

        let {
            from,
            to
        } = req.query;


        // ==========================================
        // VALIDATE VALUES
        // ==========================================

        if (!from || !to) {

            return res.status(400).json({

                success: false,

                message:
                    "From and To are required"

            });

        }


        // ==========================================
        // CLEAN VALUES
        // ==========================================

        from =
            String(from).trim();

        to =
            String(to).trim();


        if (!from || !to) {

            return res.status(400).json({

                success: false,

                message:
                    "From and To are required"

            });

        }


        // ==========================================
        // SAME SOURCE AND DESTINATION
        // ==========================================

        if (
            from.toLowerCase() ===
            to.toLowerCase()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Source and destination cannot be the same"

            });

        }


        console.log(
            "=========================================="
        );

        console.log(
            "Searching Trains"
        );

        console.log(
            "From:",
            from
        );

        console.log(
            "To:",
            to
        );

        console.log(
            "=========================================="
        );


        // ==========================================
        // SEARCH USING TRAIN SERVICE
        // ==========================================

        const trains =
            await trainService.searchTrains(
                from,
                to
            );


        // ==========================================
        // DEBUG
        // ==========================================

        console.log(
            "Trains Found:",
            trains.length
        );


        // ==========================================
        // SEND RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            count:
                trains.length,

            trains:
                trains

        });

    }
    catch (error) {

        console.error(
            "Train Search Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to search trains",

            error:
                process.env.NODE_ENV ===
                "development"
                    ? error.message
                    : undefined

        });

    }

};