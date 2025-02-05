import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductManagement from "../components/ProductManagement";
import SalesReport from "../components/SalesReport";
import SalesManagement from "../components/SalesManagement";

function Dashboard() {
  const [role, setRole] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/login");
      }
    };

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

    fetchUserRole();
    fetchProducts();
  }, [token, navigate]);

  return (
    <div className="container">
      <h2 className="mt-5">Dashboard</h2>
      <button className="btn btn-danger mb-3" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
        Logout
      </button>

      {role === "admin" ? (
        <>
          <ProductManagement />
          <SalesReport />
        </>
      ) : (
        <>
          <SalesManagement products={products} setProducts={setProducts} />
          <h3>Product List</h3>
          <table className="table mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No products available</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Dashboard;
