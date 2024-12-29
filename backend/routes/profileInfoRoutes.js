const express = require("express");
const router = express.Router();
const { getDepartments } = require("../controllers/profileInfoController");


router.get("/department", getDepartments);

module.exports = router;