const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Middleware to verify JWT token
const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: "User not found." });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Middleware to check Admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }
  next();
};

// Middleware to check Staff role (or Admin)
const isStaffOrAdmin = (req, res, next) => {
  if (req.user.role !== "staff" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Staff or Admin required." });
  }
  next();
};

module.exports = { authenticateUser, isAdmin, isStaffOrAdmin };
