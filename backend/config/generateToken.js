const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "yakilevs", { expiresIn: "30d" });
};

module.exports = generateToken;
