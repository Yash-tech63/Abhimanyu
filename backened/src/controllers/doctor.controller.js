const Doctor = require('../models/doctor.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require("../config/cloudinary");

/**
 * Helper function to generate a secure JSON Web Token
 * @param {string} id - The MongoDB Doctor Document ID
 */
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET || 'your_fallback_secret_key_32_chars_long',
        { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
};

// ==========================================
// 1. AUTHENTICATION CONTROLLERS
// ==========================================

/**
 * @desc    Register a new doctor profile into the platform
 * @route   POST /api/v1/doctors/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            number,
            password,
            specialization,
            experienceYears,
            qualifications,
            medicalCouncilRegistration,
            consultationFee,
            consultationModes
        } = req.body;

        // 1. Enforce strict unique checks manually for better error messaging
        const existingDoctor = await Doctor.findOne({ $or: [{ email }, { phone }] });
        if (existingDoctor) {
            return res.status(400).json({
                status: 'fail',
                message: 'A doctor with this email or phone number is already registered.'
            });
        }

        // 2. Encrypt/Hash password safely
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );        // 3. Create active database document
        const newDoctor = await Doctor.create({
            name,
            email,
            phone,
            number,
            password: hashedPassword,
            specialization,
            experienceYears,
            qualifications,
            medicalCouncilRegistration,
            consultationFee,
            consultationModes
        });

        // 4. Generate system access token 
        const token = generateToken(newDoctor._id);

        // Hide password string explicitly from returning back to client

        return res.status(201).json({
            status: 'success',
            token,
            data: { doctor: newDoctor }
        });

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Registration failed.',
            error: err.message
        });
    }
};

/**
 * @desc    Authenticate registered doctor & return session token
 * @route   POST /api/v1/doctors/login
 * @access  Public
 */
/**
 * @desc    Authenticate registered doctor & return session token
 * @route   POST /api/v1/doctors/login
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide both email and password.'
            });
        }

        const doctor = await Doctor.findOne({ email }).select('+password');

        if (!doctor) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password.'
            });
        }

        if (!doctor.password) {
            return res.status(500).json({
                status: 'error',
                message: 'Database error: Password hash not found for this user. Please register again.'
            });
        }

        // 3. Validate password match
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password.'
            });
        }

        // 4. Check if profile is active in the system
        if (!doctor.isActive) {
            return res.status(403).json({
                status: 'fail',
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        // 5. Build dynamic session Token
        const token = generateToken(doctor._id);
        doctor.password = undefined; // Sanitize model instance

        return res.status(200).json({
            status: 'success',
            token,
            data: { doctor }
        });

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Login runtime failure.',
            error: err.message
        });
    }
};


// ==========================================
// 2. PROFILE & STATUS MANAGEMENT (DOCTOR ONLY)
// ==========================================

/**
 * @desc    Toggle instant video/audio consultation online switch
 * @route   PATCH /api/v1/doctors/toggle-online-status
 * @access  Private (Doctor Only)
 */
exports.toggleOnlineStatus = async (req, res) => {
    try {
        // req.user logic is populated upstream from an Authentication Middleware
        const doctor = await Doctor.findById(req.user.id);
        if (!doctor) {
            return res.status(404).json({ status: 'fail', message: 'Doctor profile not found.' });
        }

        // Flip true/false value
        doctor.isOnline = !doctor.isOnline;
        await doctor.save({ validateBeforeSave: false }); // Bypass re-validating missing password on update

        return res.status(200).json({
            status: 'success',
            message: `Status updated successfully. You are now ${doctor.isOnline ? 'ONLINE' : 'OFFLINE'}.`,
            isOnline: doctor.isOnline
        });

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Could not toggle presence status.',
            error: err.message
        });
    }
};

/**
 * @desc    Update profile info (Fees, Available slots, Profile pictures)
 * @route   PATCH /api/v1/doctors/update-profile
 * @access  Private (Doctor Only)
 */
exports.updateProfile = async (req, res) => {
    try {
        // Prevent updating sensitive parameters like verification statuses and passwords directly here
        const disallowedFields = ['password', 'medicalCouncilRegistration', 'isActive', 'email'];
        disallowedFields.forEach(field => delete req.body[field]);

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ status: 'fail', message: 'Doctor not found.' });
        }

        return res.status(200).json({
            status: 'success',
            data: { doctor: updatedDoctor }
        });

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Could not execute profile modifications.',
            error: err.message
        });
    }
};

// ==========================================
// 3. TELEHEALTH SEARCH ENGINE (PATIENT/PUBLIC VIEW)
// ==========================================

/**
 * @desc    Get listings with highly efficient query strings (Filters by Spec, Fee, Online Presence)
 * @route   GET /api/v1/doctors
 * @access  Public
 */
exports.getDoctorsList = async (req, res) => {
    try {
        // Core baseline rules matching Telemedicine Regulatory Guidelines
        const queryFilter = {
            'medicalCouncilRegistration.isVerified': true,
            isActive: true
        };

        // 1. Match specific medical categories if asked
        if (req.query.specialization) {
            queryFilter.specialization = req.query.specialization;
        }

        // 2. Query for real-time immediate consultation availability
        if (req.query.isOnline === 'true') {
            queryFilter.isOnline = true;
        }

        // 3. Filter doctors under a budget constraint
        if (req.query.maxFee) {
            queryFilter.consultationFee = { $lte: Number(req.query.maxFee) };
        }

        // Execute query with sorting based on highest ratings first
        const doctors = await Doctor.find().sort('-ratingAverage');

        return res.status(200).json({
            status: 'success',
            results: doctors.length,
            data: { doctors }
        });

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve directory listings.',
            error: err.message
        });
    }
};
exports.getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user.id);

        if (!doctor) {
            return res.status(404).json({
                status: "fail",
                message: "Doctor profile not found"
            });
        }

        return res.status(200).json({
            status: "success",
            data: {
                doctor
            }
        });

    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Failed to get doctor profile",
            error: err.message
        });
    }
};

exports.uploadProfilePicture = async (req, res) => {
    try {
        const doctorId =
            req.doctor?._id ||
            req.user?._id ||
            req.user?.id;

        if (!doctorId) {
            return res.status(401).json({
                success: false,
                message: "Doctor authentication required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image",
            });
        }

        const result = await new Promise(
            (resolve, reject) => {
                const stream =
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "abhimanyu/doctors",
                            resource_type: "image",
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );

                stream.end(req.file.buffer);
            }
        );

        console.log(
            "CLOUDINARY URL:",
            result.secure_url
        );

        const doctor =
            await Doctor.findByIdAndUpdate(
                doctorId,
                {
                    profilePicture:
                        result.secure_url,
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).select("-password");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Profile picture uploaded successfully",

            data: {
                doctor,
            },

            doctor,

            profilePicture:
                result.secure_url,
        });

    } catch (error) {
        console.error(
            "CLOUDINARY UPLOAD ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to upload profile picture",
            error: error.message,
        });
    }
};

