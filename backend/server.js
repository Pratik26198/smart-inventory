require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Default route
app.get('/', (req, res) => {
    res.send('Smart Inventory Management API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Import routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const salesRoutes = require("./routes/salesRoutes"); // Import sales routes
app.use("/api/sales", salesRoutes); // Register sales routes
