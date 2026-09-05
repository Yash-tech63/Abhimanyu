const express = require("express");

const router =
    express.Router();

const {
    registerPatient,
    loginPatient,
    getPatientProfile,
    updatePatientProfile,
    googleLogin
} = require(
    "../controllers/auth.controller"
);

const {
    verifyToken
} = require(
    "../middleware/auth.middleware"
);

// REGISTER
router.post(
    "/register",
    registerPatient
);

// LOGIN
router.post(
    "/login",
    loginPatient
);

// PROTECTED PROFILE
router.get(
    "/profile",
    verifyToken,
    getPatientProfile
);

router.put(
    "/profile",
    verifyToken,
    updatePatientProfile
);

router.post(
    "/google",
    googleLogin
);

module.exports =
    router;
