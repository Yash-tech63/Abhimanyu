const mongoose = require("mongoose");

const opdTokenSchema = new mongoose.Schema(
    {
        // Logged-in patient/user
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Token number
        tokenNumber: {
            type: Number,
            required: true,
        },

        // Hospital details
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
            default: null,
        },

        hospitalName: {
            type: String,
            required: true,
            trim: true,
        },

        // Department
        department: {
            type: String,
            required: true,
            trim: true,
        },

        // Doctor
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            default: null,
        },

        doctorName: {
            type: String,
            default: "",
            trim: true,
        },

        // Appointment date
        appointmentDate: {
            type: Date,
            required: true,
            index: true,
        },

        // Estimated appointment time
        estimatedTime: {
            type: String,
            required: true,
        },

        // Booking status
        status: {
            type: String,
            enum: [
                "waiting",
                "confirmed",
                "completed",
                "cancelled",
            ],
            default: "waiting",
        },
    },
    {
        timestamps: true,
    }
);

// Same token number duplicate na ho
// hospital + date + department combination me

opdTokenSchema.index(
    {
        hospitalName: 1,
        department: 1,
        appointmentDate: 1,
        tokenNumber: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model(
    "OPDToken",
    opdTokenSchema
);