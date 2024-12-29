const departments = require("../utilities/departments.json");
const clubs = require("../utilities/clubs.json");

const getDepartments = (req, res) => {
  res.json(departments);
};

const getClubs = (req, res) => {
  res.json(clubs);
};

module.exports = { getDepartments, getClubs };
