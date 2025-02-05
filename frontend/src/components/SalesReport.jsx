import { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv"; // Import CSV Export Library

function SalesReport() {
  const [report, setReport] = useState({ totalRevenue: 0, totalTransactions: 0 });
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sales/report", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    };

    const fetchSales = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sales", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSales(response.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchSalesReport();
    fetchSales();
  }, [token, sales]);  // 🔥 FIX: Refresh report when sales update

  // Function to filter sales by time period
  const filterSales = () => {
    const now = new Date();
    return sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      if (filter === "daily") return saleDate.toDateString() === now.toDateString();
      if (filter === "weekly") return (now - saleDate) / (1000 * 60 * 60 * 24) <= 7;
      if (filter === "monthly") return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      return true;
    });
  };

  // Prepare CSV data
  const csvData = filterSales().map((sale) => ({
    Date: new Date(sale.createdAt).toLocaleDateString(),
    Product: sale.product ? sale.product.name : "Unknown Product",
    Quantity: sale.quantity,
    Total_Price: `$${sale.totalPrice}`,
  }));

  return (
    <div className="container mt-5">
      <h2>Sales Report</h2>
      <div className="card p-3 mt-3">
        <p><strong>Total Revenue:</strong> ${report.totalRevenue}</p>
        <p><strong>Total Transactions:</strong> {report.totalTransactions}</p>
      </div>

      <h3 className="mt-4">Sales List</h3>
      <div className="mb-3">
        <label>Filter by:</label>
        <select className="form-control" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* CSV Download Button */}
      <CSVLink data={csvData} filename={`sales_report_${filter}.csv`} className="btn btn-success mb-3">
        Download as CSV
      </CSVLink>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {filterSales().map((sale) => (
            <tr key={sale.id}>
              <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
              <td>{sale.product ? sale.product.name : "Unknown Product"}</td>
              <td>{sale.quantity}</td>
              <td>${sale.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesReport;
