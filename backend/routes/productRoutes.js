const express = require("express");
const { Product } = require("../models");
const { authenticateUser, isAdmin, isStaffOrAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Product (Admin Only)
router.post("/", authenticateUser, isAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Products (Staff & Admin)
router.get("/", authenticateUser, isStaffOrAdmin, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Product (Admin Only)
router.put("/:id", authenticateUser, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    await product.update(req.body);
    res.status(200).json({ message: "Product updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Product (Admin Only)
router.delete("/:id", authenticateUser, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
