import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to Smart Inventory</h1>
      <p>Manage your products and sales efficiently.</p>
      <Link to="/login" className="btn btn-primary">Login</Link>
    </div>
  );
}

export default HomePage;
