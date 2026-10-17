const OPDToken = require("../models/OPDtoken.model");
const sendOPDEmail = require("../../utils/sendOPDEmail");
const patientModel = require("../models/Patient.model")
// ==========================================
// CREATE OPD TOKEN
// ==========================================
const createOPDToken = async (req, res) => {
    try {
        const {
            patientId,
            hospitalName,
            doctorId,
            department,
            appointmentDate,
            estimatedTime,
            symptoms,
        } = req.body;

        // Required fields
        if (
            !patientId ||
            !hospitalName ||
            !doctorId ||
            !department ||
            !appointmentDate ||
            !estimatedTime
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields are required",
            });
        }

        // Find patient
        const patient = await patientModel.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        // Check existing active token
        const existingToken = await OPDToken.findOne({
            patientId,
            doctorId,
            appointmentDate,
            status: {
                $nin: ["cancelled", "completed", "no-show"],
            },
        });

        if (existingToken) {
            return res.status(400).json({
                success: false,
                message: "You already have an active token for this doctor",
                token: existingToken,
            });
        }

        // Find last token
        const lastToken = await OPDToken.findOne({
            hospitalName,
            doctorId,
            department,
            appointmentDate,
        }).sort({ tokenNumber: -1 });

        const tokenNumber = lastToken
            ? lastToken.tokenNumber + 1
            : 1;

        // Calculate queue position
        const queuePosition =
            await OPDToken.countDocuments({
                hospitalName,
                doctorId,
                department,
                appointmentDate,
                status: {
                    $in: ["booked", "waiting", "called"],
                },
            }) + 1;

        // Create OPD token
        const token = await OPDToken.create({
            patientId,
            hospitalName,
            doctorId,
            department,
            tokenNumber,
            appointmentDate,
            estimatedTime,
            symptoms,
            queuePosition,
            status: "booked",
        });
        // Update patient profile with appointment
        const updatedPatient = await patientModel.findByIdAndUpdate(
            patientId,
            {
                $push: {
                    appointments: {
                        tokenId: token._id,
                        doctorId,
                        appointmentDate,
                        department,
                        tokenNumber,
                        estimatedTime,
                        status: "booked",
                    },
                },
            },
            { new: true }
        );

        console.log("UPDATED PATIENT:", updatedPatient);

        // Send email
        await sendOPDEmail({
            email: patient.email,
            name: patient.name,
            tokenNumber,
            department,
            appointmentDate,
            estimatedTime,
            queuePosition,
            status: token.status,
        });

        // Success response
        return res.status(201).json({
            success: true,
            message: "OPD token generated successfully",
            token,
        });

    } catch (error) {

        console.error("Create OPD Token Error:", error);
        console.error("ERROR MESSAGE:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to generate OPD token",
            error: error.message,
        });
    }
};


// ==========================================
// GET PATIENT TOKENS
// ==========================================
const getPatientTokens = async (req, res) => {
    try {
        const { patientId } = req.params;

        const tokens = await OPDToken.find({
            patientId,
        })
            .populate("hospitalName", "name address")
            .populate("doctorId", "name specialization")
            .sort({ appointmentDate: -1 });

        return res.status(200).json({
            success: true,
            count: tokens.length,
            tokens,
        });
    } catch (error) {
        console.error("Get Patient Tokens Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch patient tokens",
            error: error.message,
        });
    }
};


// ==========================================
// GET TODAY'S QUEUE
// ==========================================
const getTodayQueue = async (req, res) => {
    try {
        const {
            hospitalName,
            doctorId,
            department,
        } = req.query;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const filter = {
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay,
            },

            status: {
                $in: [
                    "booked",
                    "waiting",
                    "called",
                    "in-consultation",
                ],
            },
        };

        if (hospitalName) {
            filter.hospitalName = hospitalName;
        }

        if (doctorId) {
            filter.doctorId = doctorId;
        }

        if (department) {
            filter.department = department;
        }

        const queue = await OPDToken.find(filter)
            .populate("patientId", "name email phone")
            .populate("doctorId", "name specialization")
            .sort({ tokenNumber: 1 });

        return res.status(200).json({
            success: true,
            count: queue.length,
            queue,
        });
    } catch (error) {
        console.error("Get Queue Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch queue",
            error: error.message,
        });
    }
};


// ==========================================
// GET SINGLE TOKEN
// ==========================================
const getOPDToken = async (req, res) => {
    try {
        const { tokenId } = req.params;

        const token = await OPDToken.findById(tokenId)
            .populate("patientId", "name email phone")
            .populate("hospitalName", "name address")
            .populate("doctorId", "name specialization");

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "OPD token not found",
            });
        }

        return res.status(200).json({
            success: true,
            token,
        });
    } catch (error) {
        console.error("Get Token Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch token",
            error: error.message,
        });
    }
};


// ==========================================
// UPDATE TOKEN STATUS
// ==========================================
const updateTokenStatus = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const { status } = req.body;

        const allowedStatus = [
            "booked",
            "waiting",
            "called",
            "in-consultation",
            "completed",
            "cancelled",
            "no-show",
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid token status",
            });
        }

        const token = await OPDToken.findByIdAndUpdate(
            tokenId,
            { status },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "OPD token not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Token status updated successfully",
            token,
        });
    } catch (error) {
        console.error("Update Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update token status",
            error: error.message,
        });
    }
};


// ==========================================
// CANCEL TOKEN
// ==========================================
const cancelOPDToken = async (req, res) => {
    try {
        const { tokenId } = req.params;

        const token = await OPDToken.findByIdAndUpdate(
            tokenId,
            {
                status: "cancelled",
            },
            {
                new: true,
            }
        );

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "OPD token not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "OPD token cancelled successfully",
            token,
        });
    } catch (error) {
        console.error("Cancel Token Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to cancel token",
            error: error.message,
        });
    }
};
const getDoctorTokens = async (req, res) => {
    try {
        const { doctorId } = req.params;

        console.log("================================");
        console.log("DOCTOR TOKEN REQUEST");
        console.log("DOCTOR ID RECEIVED:", doctorId);
        console.log("================================");

        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID is required",
            });
        }

        const tokens = await OPDToken.find({
            doctorId: doctorId,
            status: {
                $nin: ["cancelled"],
            },
        })
            .populate("patientId", "name email phone")
            .populate(
                "doctorId",
                "name email specialization profilePicture"
            )
            .sort({
                appointmentDate: -1,
                tokenNumber: 1,
            });

        console.log("FOUND TOKENS:", tokens.length);
        console.log("TOKENS:", tokens);

        return res.status(200).json({
            success: true,
            count: tokens.length,
            tokens,
        });

    } catch (error) {
        console.error("GET DOCTOR TOKENS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch doctor tokens",
            error: error.message,
        });
    }
};
module.exports = { createOPDToken, getOPDToken, getTodayQueue, getPatientTokens, updateTokenStatus, cancelOPDToken, getDoctorTokens }