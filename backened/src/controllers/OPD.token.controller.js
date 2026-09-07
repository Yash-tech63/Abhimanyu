const OPDToken = require("../models/OPD.token.model");


// =====================================================
// BOOK / CREATE OPD TOKEN
// POST /api/tokens/book
// =====================================================

const bookToken = async (req, res) => {
    try {
        const {
            hospitalId,
            hospitalName,
            department,
            doctorId,
            doctorName,
            appointmentDate,
            estimatedTime,
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !hospitalName ||
            !department ||
            !appointmentDate
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Hospital name, department and appointment date are required.",
            });
        }


        // =================================================
        // DATE
        // =================================================

        const bookingDate = new Date(
            appointmentDate
        );

        if (
            Number.isNaN(
                bookingDate.getTime()
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid appointment date.",
            });
        }


        // =================================================
        // CHECK DUPLICATE BOOKING
        // Same user same doctor same date
        // =================================================

        const existingBooking =
            await OPDToken.findOne({
                patient: req.user.id,

                hospitalName,

                department,

                doctorName:
                    doctorName || "",

                appointmentDate: {
                    $gte: new Date(
                        bookingDate.setHours(
                            0,
                            0,
                            0,
                            0
                        )
                    ),

                    $lte: new Date(
                        bookingDate.setHours(
                            23,
                            59,
                            59,
                            999
                        )
                    ),
                },

                status: {
                    $in: [
                        "waiting",
                        "confirmed",
                    ],
                },
            });


        if (existingBooking) {
            return res.status(409).json({
                success: false,
                message:
                    "You already have an active token for this appointment.",
                token: existingBooking,
            });
        }


        // =================================================
        // FIND LAST TOKEN
        // =================================================

        const startOfDay = new Date(
            bookingDate
        );

        startOfDay.setHours(
            0,
            0,
            0,
            0
        );


        const endOfDay = new Date(
            bookingDate
        );

        endOfDay.setHours(
            23,
            59,
            59,
            999
        );


        const lastToken =
            await OPDToken.findOne({
                hospitalName,

                department,

                appointmentDate: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            })
                .sort({
                    tokenNumber: -1,
                })
                .select("tokenNumber");


        // =================================================
        // GENERATE NEXT TOKEN
        // =================================================

        const tokenNumber =
            lastToken
                ? lastToken.tokenNumber + 1
                : 1;


        // =================================================
        // DEFAULT ESTIMATED TIME
        // =================================================

        let finalEstimatedTime =
            estimatedTime;


        if (!finalEstimatedTime) {

            // Default OPD starts at 9:00 AM
            // Every patient = 10 minutes

            const startHour = 9;

            const startMinute = 0;

            const minutesPerPatient =
                10;


            const totalMinutes =
                startHour * 60 +
                startMinute +
                (
                    (tokenNumber - 1) *
                    minutesPerPatient
                );


            const hour =
                Math.floor(
                    totalMinutes / 60
                ) % 24;


            const minute =
                totalMinutes % 60;


            const dateForTime =
                new Date();

            dateForTime.setHours(
                hour,
                minute,
                0,
                0
            );


            finalEstimatedTime =
                dateForTime.toLocaleTimeString(
                    "en-IN",
                    {
                        hour:
                            "2-digit",

                        minute:
                            "2-digit",

                        hour12:
                            true,
                    }
                );
        }


        // =================================================
        // CREATE TOKEN
        // =================================================

        const token =
            await OPDToken.create({
                patient:
                    req.user.id,

                tokenNumber,

                hospitalId:
                    hospitalId || null,

                hospitalName,

                department,

                doctorId:
                    doctorId || null,

                doctorName:
                    doctorName || "",

                appointmentDate:
                    bookingDate,

                estimatedTime:
                    finalEstimatedTime,

                status:
                    "waiting",
            });


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(201).json({
            success: true,

            message:
                "OPD token booked successfully.",

            token,
        });


    } catch (error) {

        console.error(
            "BOOK TOKEN ERROR:",
            error
        );


        // Duplicate token error

        if (
            error.code === 11000
        ) {

            return res.status(409).json({
                success: false,

                message:
                    "Token already exists. Please try again.",
            });

        }


        return res.status(500).json({
            success: false,

            message:
                "Unable to book OPD token.",

            error:
                process.env.NODE_ENV ===
                    "development"
                    ? error.message
                    : undefined,
        });

    }
};


// =====================================================
// GET LOGGED-IN USER TOKENS
// GET /api/tokens/my
// =====================================================

const getMyTokens =
    async (req, res) => {

        try {

            const tokens =
                await OPDToken.find({
                    patient:
                        req.user.id,
                })
                    .sort({
                        appointmentDate: 1,
                        tokenNumber: 1,
                    });


            return res.status(200).json({
                success: true,

                count:
                    tokens.length,

                tokens,
            });


        } catch (error) {

            console.error(
                "GET MY TOKENS ERROR:",
                error
            );


            return res.status(500).json({
                success: false,

                message:
                    "Unable to load OPD tokens.",
            });

        }

    };


// =====================================================
// GET SINGLE TOKEN
// GET /api/tokens/:id
// =====================================================

const getTokenById =
    async (req, res) => {

        try {

            const token =
                await OPDToken.findOne({
                    _id:
                        req.params.id,

                    patient:
                        req.user.id,
                });


            if (!token) {

                return res.status(404).json({
                    success: false,

                    message:
                        "OPD token not found.",
                });

            }


            return res.status(200).json({
                success: true,

                token,
            });


        } catch (error) {

            console.error(
                "GET TOKEN ERROR:",
                error
            );


            return res.status(500).json({
                success: false,

                message:
                    "Unable to load OPD token.",
            });

        }

    };


// =====================================================
// CANCEL TOKEN
// PUT /api/tokens/:id/cancel
// =====================================================

const cancelToken =
    async (req, res) => {

        try {

            const token =
                await OPDToken.findOne({
                    _id:
                        req.params.id,

                    patient:
                        req.user.id,
                });


            if (!token) {

                return res.status(404).json({
                    success: false,

                    message:
                        "OPD token not found.",
                });

            }


            if (
                token.status ===
                "completed"
            ) {

                return res.status(400).json({
                    success: false,

                    message:
                        "Completed token cannot be cancelled.",
                });

            }


            token.status =
                "cancelled";


            await token.save();


            return res.status(200).json({
                success: true,

                message:
                    "OPD token cancelled successfully.",

                token,
            });


        } catch (error) {

            console.error(
                "CANCEL TOKEN ERROR:",
                error
            );


            return res.status(500).json({
                success: false,

                message:
                    "Unable to cancel OPD token.",
            });

        }

    };


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    bookToken,
    getMyTokens,
    getTokenById,
    cancelToken,
};