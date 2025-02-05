const jwt = require("jsonwebtoken");
const { User } = require("../models");

/// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Access denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    req.user = await User.findByPk(decoded.id); // FIX: Ensure correct ID retrieval

    if (!req.user) return res.status(403).json({ message: "User not found." });

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Middleware to allow only Admins
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
