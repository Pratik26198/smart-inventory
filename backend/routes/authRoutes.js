const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize"); // Import Sequelize operators

const router = express.Router();

// Register User (Admin Only)
router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    // Validate input fields
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields (name, email, mobile, password) are required." });
    }

    // Ensure role is valid (either 'admin' or 'staff')
    if (role && !["admin", "staff"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Use 'admin' or 'staff'." });
    }

    // Check if user already exists with the same email or mobile
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { mobile }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User with the same email or mobile already exists." });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: role || "staff", // Default to 'staff' if no role is provided
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
  
      // Compare hashed passwords
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password!" });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "your_jwt_secret_key",
        { expiresIn: "1h" }
      );
  
      res.json({ token, role: user.role });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
