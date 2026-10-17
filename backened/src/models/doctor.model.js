const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    // --- Personal & Basic Info ---
    name: {
        type: String,
        required: [true, 'Doctor name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true
    },
    number: {
        type: String,
        required: [true, 'National ID is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    profilePicture: {
        type: String, // URL to the image (S3 bucket, etc.)
        default: 'default-doctor.png'
    },

    // --- Professional Details & Verification ---
    specialization: {
        type: String,
        required: [true, 'Specialization is required'],
        index: true // Indexed for fast search filtering
    },
    experienceYears: {
        type: Number,
        required: [true, 'Years of experience is required']
    },
    qualifications: [{
        type: String, // e.g., ['MBBS', 'MD - Pediatrics']
        required: true
    }],
    medicalCouncilRegistration: {
        registrationNumber: { type: String, required: true, unique: true },
        councilName: { type: String, required: true }, // e.g., 'Medical Council of India'
        isVerified: { type: Boolean, default: false } // Crucial for telemedicine legal compliance
    },

    // --- Consultation Setup ---
    consultationFee: {
        type: Number,
        required: [true, 'Consultation fee is required']
    },
    consultationModes: {
        video: { type: Boolean, default: true },
        audio: { type: Boolean, default: true },
        chat: { type: Boolean, default: false }
    },

    // --- Availability & Slots ---
    // A structured way to store weekly working hours
    availability: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        slots: [{
            startTime: { type: String, required: true }, // e.g., "09:00"
            endTime: { type: String, required: true }   // e.g., "09:30"
        }]
    }],

    // --- Ratings & Reviews Summary ---
    ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // Rounds to 1 decimal place
    },
    totalReviews: {
        type: Number,
        default: 0
    },

    // --- System Status ---
    isActive: {
        type: Boolean,
        default: true
    },
    isOnline: {
        type: Boolean,
        default: false // Useful for instant "Consult Now" features
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Compile the schema into a Model
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
