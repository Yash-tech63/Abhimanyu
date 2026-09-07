const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
    bookToken,
    getMyTokens,
    getTokenById,
    cancelToken
} = require("../controllers/OPD.token.controller");


// Authentication required for all token routes
router.use(auth.verifyToken);


// Book OPD Token
router.post("/book", bookToken);


// Get logged-in user's tokens
router.get("/my", getMyTokens);


// Get single token
router.get("/:id", getTokenById);


// Cancel token
router.put("/:id/cancel", cancelToken);


module.exports = router;