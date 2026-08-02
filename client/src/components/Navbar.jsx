import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav>
      <h2>MediTrack</h2>

      {!user ? (
        <>
          <Link to="/login">Login</Link>{" | "}
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard">Dashboard</Link>{" | "}
          <Link to="/medications">Medications</Link>{" | "}
          <Link to="/reminders">Reminders</Link>{" | "}
          <Link to="/prescriptions">Prescriptions</Link>{" | "}
          <Link to="/profile">Profile</Link>{" | "}

          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;