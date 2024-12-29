const departments = require("../utilities/departments.json");
const clubs = require("../utilities/clubs.json");
const skills = require("../utilities/skills.json");

const getDepartments = (req, res) => {
  res.json(departments);
};

const getClubs = (req, res) => {
  res.json(clubs);
};

const getSkills = (req, res) => {
  res.json(skills);
};

module.exports = { getDepartments, getClubs, getSkills };
