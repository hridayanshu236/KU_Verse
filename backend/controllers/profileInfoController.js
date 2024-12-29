const departments = require("../utilities/departments.json");

const getDepartments = (req, res) => {
  res.json(departments);
};

module.exports = { getDepartments };
