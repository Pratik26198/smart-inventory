import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductManagement from "../components/ProductManagement";
import SalesReport from "../components/SalesReport";
import SalesManagement from "../components/SalesManagement";
import { FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";

function Dashboard() {
  const [role, setRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Apply theme on load
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newTheme = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark-mode");
  };

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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>

        <div className="d-flex gap-3">
          <button className="btn btn-secondary" onClick={toggleDarkMode}>
            {darkMode ? <FaSun className="me-2" /> : <FaMoon className="me-2" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          
          <button className="btn btn-danger" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>
      </div>

      {role === "admin" ? (
        <>
          <div className="row">
            <div className="col-md-6">
              <ProductManagement />
            </div>
            <div className="col-md-6">
              <SalesReport />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <SalesManagement products={products} setProducts={setProducts} />
            </div>
            <div className="col-md-6">
              <h3>Product List</h3>
              <table className="table table-striped mt-3">
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
