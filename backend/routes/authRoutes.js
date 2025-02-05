const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { Op } = require("sequelize"); // Import Sequelize operators
const { verifyToken } = require("../middlewares/authMiddleware"); // Ensure this middleware is used

const router = express.Router();

// ✅ Register User (Admin Only)
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
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password!" }); // Avoid revealing user existence
    }

    // Compare hashed passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Ensure correct ID is stored in the token
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get Authenticated User Details (Fix for `/api/auth/me` Not Found)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in /me:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Logout (Optional: Implement Logout on Frontend by Removing Token)
router.post("/logout", verifyToken, (req, res) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in /logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
