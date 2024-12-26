const express = require("express");
const router = express.Router();
const wrapAsync = require("../middlewares/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middlewares/authMiddleware.js");
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController.js");

// get all companies
router.get("/", isLoggedIn, wrapAsync(getCompanies));

// create a company
router.post("/", isLoggedIn, wrapAsync(createCompany));

// get company by id
router.get("/:companyId", isLoggedIn, wrapAsync(getCompany));

// update company
router.put("/:companyId", isLoggedIn, wrapAsync(updateCompany));

// delete company
router.delete("/:companyId", isLoggedIn, wrapAsync(deleteCompany));

module.exports = router;
