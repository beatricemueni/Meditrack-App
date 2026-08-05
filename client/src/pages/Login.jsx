import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import useAuth from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Execute authentication loop
      const result = await login(formData.email, formData.password);
      
      // 🌟 FIXED: Handle object response with .message from AuthContext
      if (result === true) {
        navigate("/dashboard");
      } else if (result && typeof result === "object" && result.message) {
        setError(result.message); // Displays the precise server error string
      } else {
        setError("Invalid email address or secure password combo.");
      }
    } catch (err) {
      setError("Failed to connect to authentication server profile.");
    }
  };

  return (
    <div className="main-content" style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
      <div className="dashboard-card" style={{ maxWidth: "420px", width: "100%", padding: "40px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text)" }}>Welcome Back</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "4px" }}>
            Sign in to access your tracking metrics panel
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#fee2e2", border: "1px solid #fca5a5", color: "var(--danger)", padding: "12px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", fontWeight: "500" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Email verification row */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="name@example.com" style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--background)", outline: "none", fontSize: "15px", color: "var(--text)" }} />
            </div>
          </div>

          {/* Secure password key element */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--background)", outline: "none", fontSize: "15px", color: "var(--text)" }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "15px", marginTop: "10px" }}>
            Sign In <ArrowRight size={18} style={{ marginLeft: "8px" }} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--muted)" }}>
          New to the workspace?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "underline" }}>
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
