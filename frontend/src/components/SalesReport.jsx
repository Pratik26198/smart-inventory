import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";

function SalesReport() {
  const [report, setReport] = useState({ totalRevenue: 0, totalTransactions: 0 });
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("token");

  const reportRef = useRef(null); // ✅ Reference for capturing PDF

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
  }, [token]);

  // ✅ Function to filter sales by time period
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

  // ✅ Prepare CSV data
  const csvData = filterSales().map((sale) => ({
    Date: new Date(sale.createdAt).toLocaleDateString(),
    Product: sale.product ? sale.product.name : "Unknown Product",
    Quantity: sale.quantity,
    Total_Price: `$${sale.totalPrice}`,
  }));

  // ✅ Function to Export Sales Report as PDF
  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Sales_Report_${filter}.pdf`);
    });
  };

  return (
    <div className="container mt-5">
      <h2>Sales Report</h2>

      <div className="card p-3 mt-3" ref={reportRef}>
        <p><strong>Total Revenue:</strong> ${report.totalRevenue}</p>
        <p><strong>Total Transactions:</strong> {report.totalTransactions}</p>

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

      {/* ✅ Download Buttons for CSV & PDF */}
      <div className="d-flex gap-3 mt-3">
        <CSVLink data={csvData} filename={`sales_report_${filter}.csv`} className="btn btn-success">
          <FaDownload className="me-2" /> Download CSV
        </CSVLink>

        <button className="btn btn-primary" onClick={downloadPDF}>
          <FaDownload className="me-2" /> Download PDF
        </button>
      </div>
    </div>
  );
}

export default SalesReport;
