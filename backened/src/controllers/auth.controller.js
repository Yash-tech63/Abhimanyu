const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Patient = require("../models/Patient.model");
const generateJWT = require("../../utils/generateJWT");

// ==========================================
// PATIENT REGISTER
// ==========================================

const registerPatient = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            gender,
            dateOfBirth,
            bloodGroup,
            aadhaarNumber,
            city,
        } = req.body;

        // ==========================================
        // REQUIRED FIELD VALIDATION
        // ==========================================

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email, phone and password are required",
            });
        }

        // ==========================================
        // EMAIL VALIDATION
        // ==========================================

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        // ==========================================
        // PHONE VALIDATION
        // ==========================================

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid 10 digit phone number",
            });
        }

        // ==========================================
        // PASSWORD VALIDATION
        // ==========================================

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 6 characters",
            });
        }

        // ==========================================
        // CHECK EMAIL
        // ==========================================

        const normalizedEmail = email.toLowerCase();
        const existingEmail =
            await Patient.findOne({
                email: normalizedEmail,
            });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message:
                    "Email already registered",
            });
        }

        // ==========================================
        // CHECK PHONE
        // ==========================================

        const existingPhone =
            await Patient.findOne({
                phone,
            });

        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message:
                    "Phone number already registered",
            });
        }

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(password, 10);

        // ==========================================
        // CREATE PATIENT
        // ==========================================

        const patient = await Patient.create({
            name,
            email: normalizedEmail,
            phone,
            password: hashedPassword,
            role: "patient",
            gender: gender || "",
            dateOfBirth: dateOfBirth || null,
            bloodGroup: bloodGroup || "",
            aadhaarNumber: aadhaarNumber || "",
            location: { city: city || "" },
        });

        const token = generateJWT(patient._id);

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({
            success: true,
            message:
                "Patient registered successfully",

            user: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                role: patient.role,
            },
            token,
            patient: {
                id: patient._id,
                gender: patient.gender,
                dateOfBirth: patient.dateOfBirth,
                bloodGroup: patient.bloodGroup,
                city: patient.location?.city || "",
            },
        });

    } catch (error) {
        console.error(
            "REGISTER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Registration failed",
            error: error.message,
        });

    }
};

// ==========================================
// EXPORT
// ==========================================



// ==========================================
// PATIENT LOGIN
// ==========================================

const loginPatient = async (req, res) => {
    try {


        const {
            email,
            password
        } = req.body;


        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });
        }


        // Find patient
        const patient =
            await Patient.findOne({
                email:
                    email.toLowerCase()
            });


        if (!patient) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }


        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                patient.password
            );


        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }


        // Generate JWT
        const token =
            generateJWT(patient._id);


        return res.status(200).json({
            success: true,
            message:
                "Login successful",

            token,

            user: {
                id:
                    patient._id,

                name:
                    patient.name,

                email:
                    patient.email,

                phone:
                    patient.phone,

                role:
                    patient.role
            }
        });


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Login failed"
        });

    }
};

// ==========================================
// GET PATIENT PROFILE
// ==========================================

const getPatientProfile =
    async (req, res) => {

        try {


            const patient =
                await Patient.findById(
                    req.user.id
                ).select("-password");


            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Patient not found"
                });
            }


            return res.status(200).json({
                success: true,
                user:
                    patient
            });


        } catch (error) {


            console.error(
                "PROFILE ERROR:",
                error
            );


            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch profile"
            });


        }

    };

const updatePatientProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "phone",
            "gender",
            "dateOfBirth",
            "bloodGroup",
            "aadhaarNumber",
            "height",
            "weight",
            "location",
            "emergencyContact",
        ];

        const updates = Object.fromEntries(
            allowedFields
                .filter((field) => req.body[field] !== undefined)
                .map((field) => [field, req.body[field]])
        );

        const patient = await Patient.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        return res.status(200).json({
            success: true,
            user: patient,
        });
    } catch (error) {
        console.error("PROFILE UPDATE ERROR:", error);
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to update profile",
        });
    }
};





const { OAuth2Client } =
    require("google-auth-library");






const googleClient =
    new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID
    );


const googleLogin =
    async (req, res) => {

        try {

            const { token } =
                req.body;


            if (!token) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Google token is required"
                });

            }


            const ticket =
                await googleClient.verifyIdToken({

                    idToken: token,

                    audience:
                        process.env.GOOGLE_CLIENT_ID

                });


            const payload =
                ticket.getPayload();


            const {

                sub,
                email,
                name,
                picture

            } = payload;


            let user =
                await Patient.findOne({
                    email
                });


            // Create user if first login

            if (!user) {

                user =
                    await Patient.create({

                        name,

                        email,

                        phone:
                            `google-${sub}`,

                        password:
                            await bcrypt.hash(
                                crypto.randomBytes(32).toString("hex"),
                                10
                            ),

                        googleId:
                            sub,

                        profilePicture:
                            picture,

                        authProvider:
                            "google",

                        role:
                            "patient"

                    });

            }


            // Generate JWT

            const jwtToken =
                generateJWT(
                    user._id
                );


            return res.status(200).json({

                success: true,

                message:
                    "Google login successful",

                token:
                    jwtToken,

                user: {

                    _id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    phone:
                        user.phone,

                    role:
                        user.role,

                    profilePicture:
                        user.profilePicture

                }

            });


        } catch (error) {

            console.error(
                "GOOGLE AUTH ERROR:",
                error
            );


            return res.status(401).json({

                success: false,

                message:
                    "Google authentication failed"

            });

        }

    };


module.exports = {
    registerPatient,
    loginPatient,
    getPatientProfile,
    updatePatientProfile,
    googleLogin
};