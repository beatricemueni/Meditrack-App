import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Shield, ArrowRight } from "lucide-react";
import useAuth from "../hooks/useAuth";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth(); 

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await register(formData);
      
      // 🌟 FIXED: Accommodate the updated object structure
      if (result === true) {
        navigate("/dashboard");
      } else if (result && result.message) {
        setError(result.message); // Displays real backend strings like "Email already exists"
      } else {
        setError("Registration process encountered an error.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during submission.");
    }
  };


  return (
    <div className="main-content" style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <div className="dashboard-card" style={{ maxWidth: "450px", width: "100%", padding: "40px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text)" }}>Create Account</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "4px" }}>
            Get started with your MediTrack account dashboard
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#fee2e2", border: "1px solid #fca5a5", color: "var(--danger)", padding: "12px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", fontWeight: "500" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Username</label>
            <div style={{ position: "relative" }}>
              <User size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input type="text" name="username" required value={formData.username} onChange={handleChange} placeholder="e.g. sophia" style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--background)", outline: "none", fontSize: "15px", color: "var(--text)" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="sophia@example.com" style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--background)", outline: "none", fontSize: "15px", color: "var(--text)" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--background)", outline: "none", fontSize: "15px", color: "var(--text)" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Account Type</label>
            <div style={{ position: "relative" }}>
              <Shield size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
              <select name="role" value={formData.role} onChange={handleChange} style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--background)", outline: "none", fontSize: "15px", color: "var(--text)", appearance: "none" }}>
                <option value="user">Standard Patient (User)</option>
                <option value="admin">System Administrator (Admin)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "15px", marginTop: "10px" }}>
            Sign Up <ArrowRight size={18} style={{ marginLeft: "8px" }} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--muted)" }}>
          Already registered?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600", textDecoration: "underline" }}>
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;

