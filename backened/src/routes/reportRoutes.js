const express = require("express");

const router =
    express.Router();

const {
    uploadReport,
    getMyReports,
    deleteReport,
} = require(
    "../controllers/reportController"
);

const upload =
    require(
        "../middleware/report.upload"
    );

const {
    verifyToken,
} = require(
    "../middleware/auth.middleware"
);


// UPLOAD REPORT

router.post(
    "/upload",

    verifyToken,

    upload.single(
        "report"
    ),

    uploadReport
);


// GET MY REPORTS

router.get(
    "/my",

    verifyToken,

    getMyReports
);


// DELETE REPORT

router.delete(
    "/:id",

    verifyToken,

    deleteReport
);


module.exports =
    router;