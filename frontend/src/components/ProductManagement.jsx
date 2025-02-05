import { useEffect, useState } from "react";
import axios from "axios";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [role, setRole] = useState(null);
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

    const fetchUserRole = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchProducts();
    fetchUserRole();
  }, [token]);

  // Add or Update a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = { name, description, price, stock };

      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/products", productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      window.location.reload();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Delete a product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
  };

  return (
    <div className="container">
      <h2 className="mt-5">Product Management</h2>

      {/* Show product form only if Admin */}
      {role === "admin" && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Product Name:</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Description:</label>
            <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Price:</label>
            <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Stock:</label>
            <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}

      {/* Product List */}
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            {role === "admin" && <th>Actions</th>} {/* Show actions only for admins */}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              {role === "admin" && (
                <td>
                  <button className="btn btn-warning me-2" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductManagement;
