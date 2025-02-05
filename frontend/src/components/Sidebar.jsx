import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import "../styles/Sidebar.css";

function Sidebar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav>
        <ul>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>
              <FaChartBar /> Dashboard
            </Link>
          </li>
          <li>
            <button className="logout-btn" onClick={onLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
