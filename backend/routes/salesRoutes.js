const express = require("express");
const { Sale, Product } = require("../models");

const router = express.Router();

// Record a New Sale
router.post("/", async (req, res) => {
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

    // Ensure association exists
    await sale.reload({ include: { model: Product, as: "product" } });

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

// Get All Sales Transactions
router.get("/", async (req, res) => {
    try {
      const sales = await Sale.findAll({
        include: [{ model: Product, as: "product" }], // Fix: Include alias explicitly
      });
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// Generate Sales Report
router.get("/report", async (req, res) => {
  try {
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
