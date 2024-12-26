const express = require("express");
const router = express.Router();
const wrapAsync = require("../middlewares/wrapAsync.js");
const { isLoggedIn,isOwner } = require("../middlewares/authMiddleware.js");
const { allData } = require("../controllers/dataControllers.js");

router.get("/:companyId", isOwner, wrapAsync(allData));

module.exports = router;
