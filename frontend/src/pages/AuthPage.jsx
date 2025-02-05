import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff"); // Default to "staff"
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isRegister ? "/register" : "/login";
      const data = isRegister
        ? { name, email, mobile, password, role }
        : { email, password };

      const response = await axios.post(`http://localhost:5000/api/auth${endpoint}`, data);
      
      if (!isRegister) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setIsRegister(false); // Switch to login after successful registration
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? "Register" : "Login"}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleAuth}>
          {isRegister && (
            <>
              <div className="mb-3">
                <label>Name:</label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label>Mobile:</label>
                <input type="text" className="form-control" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label>Role:</label>
                <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}
          
          <div className="mb-3">
            <label>Email:</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Password:</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="toggle-link" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
