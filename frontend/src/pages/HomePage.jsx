import { Link } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
  return (
    <div className="homepage">
      <div className="overlay">
        <div className="content">
          <h1 className="animate-heading">Welcome to Smart Inventory</h1>
          <p className="animate-text">Manage your products and sales efficiently with ease.</p>
          <Link to="/login" className="btn btn-primary btn-lg mt-3 animate-btn">Get Started</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
