const express = require("express");
const router = express.Router();
const { getDepartments,getClubs } = require("../controllers/profileInfoController");


router.get("/department", getDepartments);
router.get("/clubs", getClubs);

module.exports = router;