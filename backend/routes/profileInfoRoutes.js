const express = require("express");
const router = express.Router();
const { getDepartments,getClubs, getSkills } = require("../controllers/profileInfoController");


router.get("/department", getDepartments);
router.get("/clubs", getClubs);
router.get("/skills", getSkills);

module.exports = router;