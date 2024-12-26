const express = require("express");
const router = express.Router();
const wrapAsync = require("../middlewares/wrapAsync.js");
const { isLoggedIn,isOwner } = require("../middlewares/authMiddleware.js");
const {
  sendWhatsAppMessage
} = require("../controllers/chatController.js");

router.get("/:companyId", isLoggedIn, wrapAsync(sendWhatsAppMessage));
router.post("/:companyId", isLoggedIn, wrapAsync(sendWhatsAppMessage));

module.exports = router;
