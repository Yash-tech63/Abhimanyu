const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

router.get(
    "/check",
    auth.verifyToken,
    (req, res) => {

        return res.json({
            success: true,
            message: "JWT is working",
            user: req.user
        });

    }
);

module.exports = router;