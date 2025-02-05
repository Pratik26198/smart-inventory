const express = require("express");
const { Sale, Product } = require("../models");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Record a New Sale (Any Authenticated User)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Find the product
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    // Check if enough stock is available
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available!" });
    }

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Create sale record
    const sale = await Sale.create({
      productId,
      quantity,
      totalPrice,
    });

    // Update product stock
    await product.update({ stock: product.stock - quantity });

    res.status(201).json({
      message: "Sale recorded successfully!",
      sale,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Sales (Admin Only)
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const sales = await Sale.findAll({ include: [{ model: Product, as: "product" }] });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Sales Report (Admin Only)
router.get("/report", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const totalSales = await Sale.sum("totalPrice");
    const totalTransactions = await Sale.count();

    res.json({
      totalRevenue: totalSales || 0,
      totalTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
