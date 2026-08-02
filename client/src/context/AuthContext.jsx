import { createContext, useState } from "react";

export const AuthContext = createContext();

let initialUser = null;

try {
  const storedUser = localStorage.getItem("user");
  initialUser = storedUser ? JSON.parse(storedUser) : null;
} catch {
  initialUser = null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(initialUser);

  const login = (data) => {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}