const mongoose = require("mongoose");

const opdTokenSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        hospitalName: {
            type: String,
            required: true,
            trim: true,
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },

        department: {
            type: String,
            required: true,
            trim: true,
        },

        tokenNumber: {
            type: Number,
            required: true,
        },

        appointmentDate: {
            type: String,
            required: true,
        },

        estimatedTime: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "booked",
                "waiting",
                "called",
                "in-consultation",
                "completed",
                "cancelled",
                "no-show",
            ],
            default: "booked",
        },

        symptoms: {
            type: String,
            trim: true,
            default: "",
        },

        notes: {
            type: String,
            trim: true,
            default: "",
        },

        checkedInAt: {
            type: Date,
        },

        consultationStartedAt: {
            type: Date,
        },

        consultationCompletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const OPDToken = mongoose.model("OPDToken", opdTokenSchema);

module.exports = OPDToken;