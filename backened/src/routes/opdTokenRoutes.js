const express = require("express");
const router = express.Router();

const opdTokenController = require("../controllers/opdTokenController");

router.post("/create", opdTokenController.createOPDToken);

router.get("/get/:tokenId", opdTokenController.getOPDToken);

router.get("/patient/:patientId", opdTokenController.getPatientTokens);

router.get("/today", opdTokenController.getTodayQueue);

router.get(
    "/doctor/:doctorId",
    opdTokenController.getDoctorTokens
);

router.put(
    "/update/:tokenId",
    opdTokenController.updateTokenStatus
);

router.delete(
    "/delete/:tokenId",
    opdTokenController.cancelOPDToken
);

module.exports = router;