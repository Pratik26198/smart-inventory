import { useEffect, useState } from "react";
import axios from "axios";

function SalesManagement({ products, setProducts }) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [token]);

  // Handle sale submission
  const handleSale = async (e) => {
    e.preventDefault();
    try {
      const saleData = { productId: selectedProduct, quantity };

      const response = await axios.post("http://localhost:5000/api/sales", saleData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(response.data.message);
      setQuantity(""); // Reset input field

      // ✅ Update stock in UI instantly without requiring a page refresh
      const updatedProduct = response.data.updatedProduct;
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );

    } catch (error) {
      setMessage("Error recording sale: " + error.response?.data?.message);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-5">Record a Sale</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSale}>
        <div className="mb-3">
          <label>Select Product:</label>
          <select
            className="form-control"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">-- Select a Product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (Stock: {product.stock})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Quantity:</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Record Sale</button>
      </form>
    </div>
  );
}

export default SalesManagement;
