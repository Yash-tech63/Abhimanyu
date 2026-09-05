const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },


        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: function () {
                return this.authProvider === "local";
            },
        },

        phone: {
            type: String,
            default: "",
        },

        bloodGroup: {
            type: String,
            enum: [
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
                "",
            ],
            default: "",
        },

        // Production me Aadhaar encrypt karke store karein
        aadhaarNumber: {
            type: String,
            default: "",
            select: false,
        },

        location: {
            address: {
                type: String,
                default: "",
            },

            city: {
                type: String,
                default: "",
            },

            state: {
                type: String,
                default: "",
            },

            country: {
                type: String,
                default: "India",
            },

            pincode: {
                type: String,
                default: "",
            },
        },

        gender: {
            type: String,
            enum: [
                "Male",
                "Female",
                "Other",
                "",
            ],
            default: "",
        },

        dateOfBirth: {
            type: Date,
            default: null,
        },

        height: {
            type: Number,
            default: null,
        },

        weight: {
            type: Number,
            default: null,
        },



        profilePicture: {
            type: String,
            default: "",
        },

        googleId: {
            type: String,
            default: null,
        },

        authProvider: {
            type: String,
            default: "local",
        },

        role: {
            type: String,
            default: "patient",
        },


    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Patient",
    PatientSchema
);
