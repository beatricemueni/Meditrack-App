import React, { createContext, useState } from 'react';
import { apiFetch } from '../api/api'; 

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const register = async (userData) => {
    try {
      const data = await apiFetch("/register", { 
        method: "POST",
        body: JSON.stringify(userData)
      });
      
      localStorage.setItem("token", data.token);
      setUser(data.user); 
      return true;
    } catch (error) {
      console.error("Registration error:", error.message);
      // 🌟 FIXED: Bubble up the custom message text so Register.jsx can render it
      return { success: false, message: error.message || "Registration failed." };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      
      localStorage.setItem("token", data.token);
      setUser(data.user); 
      return true;
    } catch (error) {
      console.error("Login error:", error.message);
      // 🌟 FIXED: Bubble up the custom message text so Login.jsx can render it
      return { success: false, message: error.message || "Login failed." };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
