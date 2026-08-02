
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

  return (
    <aside className="left-navbar">
      <div className="navbar-logo">
        <Activity size={28} strokeWidth={2.5} />
      </div>

      {/* Navigation Links */}
      <nav className="navbar-links-stack">
        {!user ? (
          
          <>
            <NavLink 
              to="/login" 
              className={({ isActive }) => isActive ? "nav-icon-btn active" : "nav-icon-btn"}
              title="Login"
            >
              <LogIn size={22} />
            </NavLink>
            <NavLink 
              to="/register" 
              className={({ isActive }) => isActive ? "nav-icon-btn active" : "nav-icon-btn"}
              title="Register"
            >
              <UserPlus size={22} />
            </NavLink>
          </>
        ) : (
          
          <>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? "nav-icon-btn active" : "nav-icon-btn"}
              title="Dashboard"
            >
              <Activity size={22} />
            </NavLink>

            <NavLink 
              to="/medications" 
              className={({ isActive }) => isActive ? "nav-icon-btn active" : "nav-icon-btn"}
              title="Medications"
            >
              <Pill size={22} />
            </NavLink>

            <NavLink 
              to="/reminders" 
              className={({ isActive }) => isActive ? "nav-icon-btn active" : "nav-icon-btn"}
              title="Reminders"
            >
              <Bell size={22} />
            </NavLink>

            <NavLink 
              to="/prescriptions" 
              className={({ isActive }) => isActive ? "nav-icon-btn active" : "nav-icon-btn"}
              title="Prescriptions"
            >
              <FileText size={22} />
            </NavLink>

            <NavLink 
              to="/profile" 
              className={({ isActive }) => isActive ? "nav-icon-btn active" : "nav-icon-btn"}
              title="Profile"
            >
              <User size={22} />
            </NavLink>

          
            {isAdmin && (
              <NavLink 
                to="/admin-controls" 
                className={({ isActive }) => isActive ? "nav-icon-btn admin active" : "nav-icon-btn admin"}
                title="Admin Controls"
              >
                <ShieldCheck size={22} />
              </NavLink>
            )}
          </>
        )}
      </nav>

      
      {user ? (
        <button onClick={handleLogout} className="navbar-logout-btn" title="Logout">
          <LogOut size={22} />
        </button>
      ) : (
        <div style={{ height: "52px" }}></div>
      )}
    </aside>
  );
}

export default Navbar;
