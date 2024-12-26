const express = require("express");
const router = express.Router();
const wrapAsync = require("../middlewares/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middlewares/authMiddleware.js");
const getPrediction = require("../controllers/predictionController.js");

router.get("/:companyId", isLoggedIn, wrapAsync(getPrediction));

module.exports = router;
