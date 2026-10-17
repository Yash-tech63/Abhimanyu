const express = require('express');
const doctorController = require('../controllers/doctor.controller');

// Import your custom authorization middleware 
// This middleware extracts the JWT from the headers, verifies it, and attaches the doctor to req.user
const { protect } = require("../middleware/doctor.middleware")
const router = express.Router();


// ==========================================
// 1. PUBLIC ROUTES
// ==========================================
// Accessible by anyone (e.g., Doctors signing up/logging in, Patients searching for providers)

/**
 * @route   POST /api/v1/doctors/signup
 * @desc    Create a new doctor account
 */
router.post('/signup', doctorController.signup);

/**
 * @route   POST /api/v1/doctors/login
 * @desc    Authenticate credentials and return a JWT token
 */
router.post('/login', doctorController.login);

/**
 * @route   GET /api/v1/doctors
 * @desc    Fetch medical providers filtered by specialization, online status, or price constraints
 */
router.get('/get-doctors', doctorController.getDoctorsList);
const uploadDoctorProfile = require("../middleware/upload");



// ==========================================
// 2. PROTECTED ROUTES (AUTHENTICATION REQUIRED)
// ==========================================
// All routes declared below this line will sequentially pass through the 'protect' middleware first.


/**
 * @route   PATCH /api/v1/doctors/toggle-online-status
 * @desc    Allows a logged-in doctor to toggle their live instant-consult availability status
 */
router.patch('/toggle-online-status', protect, doctorController.toggleOnlineStatus);

/**
 * @route   PATCH /api/v1/doctors/update-profile
 * @desc    Allows a logged-in doctor to update their schedule slots, consultation fees, and details
 */
router.patch('/update-profile', protect, doctorController.updateProfile);
router.post(
    "/upload-profile-picture",
    protect,
    uploadDoctorProfile.single("profilePicture"),
    doctorController.uploadProfilePicture
);
router.get(
    '/get-profile',
    protect,
    doctorController.getDoctorProfile);

module.exports = router;
