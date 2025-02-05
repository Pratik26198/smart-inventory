const express = require("express");
const { Sale, Product } = require("../models");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Record a New Sale (Only Staff Users)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if user is a staff member
    if (req.user.role !== "staff") {
      return res.status(403).json({ message: "Access denied. Only staff can record sales." });
    }

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
    console.error("Error recording sale:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get All Sales (Admin Only)
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const sales = await Sale.findAll({
      include: [
        {
          model: Product,
          as: "product", // Ensure association is correct
          attributes: ["name", "price"],
        },
      ],
      order: [["createdAt", "DESC"]], // Show latest sales first
    });

    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get All Sales (Admin Only)
router.get("/", verifyToken, async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  
      const sales = await Sale.findAll({
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["name", "price"],
          },
        ],
        order: [["createdAt", "DESC"]], // Show latest sales first
      });
  
      res.json(sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

module.exports = router;
