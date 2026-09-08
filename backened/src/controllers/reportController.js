const Report = require("../models/report");


// ==========================================
// UPLOAD REPORT
// ==========================================

const uploadReport = async (req, res) => {
    try {
        console.log("REPORT UPLOAD API HIT");

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Report file is required",
            });
        }

        const report = await Report.create({
            patient: req.user.id,

            originalName:
                req.file.originalname,

            fileName:
                req.file.filename,

            fileUrl:
                `/uploads/reports/${req.file.filename}`,

            fileType:
                req.file.mimetype,

            fileSize:
                req.file.size,
        });

        return res.status(201).json({
            success: true,

            message:
                "Report uploaded successfully",

            report,
        });

    } catch (error) {

        console.error(
            "REPORT UPLOAD ERROR:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                error.message ||
                "Report upload failed",
        });

    }
};


// ==========================================
// GET MY REPORTS
// ==========================================

const getMyReports = async (req, res) => {
    try {

        const reports =
            await Report.find({
                patient: req.user.id,
            })
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,

            reports,
        });

    } catch (error) {

        console.error(
            "GET REPORTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Unable to get reports",
        });

    }
};


// ==========================================
// DELETE REPORT
// ==========================================

const deleteReport = async (
    req,
    res
) => {

    try {

        const report =
            await Report.findOne({
                _id: req.params.id,

                patient:
                    req.user.id,
            });

        if (!report) {

            return res.status(404).json({
                success: false,

                message:
                    "Report not found",
            });

        }

        await report.deleteOne();

        return res.status(200).json({

            success: true,

            message:
                "Report deleted successfully",

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};


module.exports = {

    uploadReport,

    getMyReports,

    deleteReport,

};