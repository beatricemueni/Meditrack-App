import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { 
  Activity, 
  Pill, 
  Bell, 
  FileText, 
  User, 
  ShieldCheck, 
  LogOut,
  LogIn,
  UserPlus
} from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isAdmin = user?.role === "admin";

  // Base styling for every link item
  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px 16px",
    borderRadius: "12px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    width: "100%",
    boxSizing: "border-box",
    color: isActive ? "#ffffff" : "#475569",
    backgroundColor: isActive ? "#0f766e" : "transparent",
    boxShadow: isActive ? "0 4px 12px rgba(15, 118, 110, 0.2)" : "none",
    transition: "all 0.2s ease"
  });

  return (
    <aside style={{ width: "240px", height: "100vh", backgroundColor: "#ffffff", borderRight: "1px solid #e2f5f1", boxShadow: "0 2px 8px rgba(15, 118, 110, 0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px 16px", position: "fixed", left: 0, top: 0, zIndex: 1000, boxSizing: "border-box" }}>
      
      {/* Top Branding Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", marginBottom: "12px" }}>
        <div style={{ color: "#0f766e", backgroundColor: "#ccfbf1", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Activity size={22} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: "18px", fontWeight: "800", color: "#134e4a", letterSpacing: "-0.5px" }}>MediTrack</span>
      </div>

      {/* Center Navigation Links Links Stack */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flexGrow: 1, width: "100%" }}>
        {!user ? (
          <>
            <NavLink to="/login" style={linkStyle}>
              <LogIn size={20} />
              <span>Sign In</span>
            </NavLink>
            <NavLink to="/register" style={linkStyle}>
              <UserPlus size={20} />
              <span>Create Account</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard" style={linkStyle}>
              <Activity size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/medications" style={linkStyle}>
              <Pill size={20} />
              <span>Medications</span>
            </NavLink>

            <NavLink to="/reminders" style={linkStyle}>
              <Bell size={20} />
              <span>Reminders</span>
            </NavLink>

            <NavLink to="/prescriptions" style={linkStyle}>
              <FileText size={20} />
              <span>Prescriptions</span>
            </NavLink>

            <NavLink to="/profile" style={linkStyle}>
              <User size={20} />
              <span>Profile</span>
            </NavLink>

            {isAdmin && (
              <NavLink to="/admin-controls" style={linkStyle}>
                <ShieldCheck size={20} />
                <span>Admin Controls</span>
              </NavLink>
            )}
          </>
        )}
      </nav>

      {/* Bottom Profile Footer & Logout Element */}
      {user && (
        <div style={{ width: "100%", paddingTop: "16px", borderTop: "1px solid #e2f5f1", display: "flex", flexDirection: "column", gap: "8px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "4px 8px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#0f766e", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: "700", textTransform: "uppercase", flexShrink: 0 }}>
              {user.username?.charAt(0) || "U"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#134e4a", textTransform: "capitalize", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.username}
              </span>
              <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.5px" }}>
                {user.role}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%", padding: "12px 16px", borderRadius: "12px", border: "none", backgroundColor: "transparent", color: "#ef4444", fontWeight: "600", cursor: "pointer", fontSize: "14px", textAlign: "left", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}

export default Navbar;
