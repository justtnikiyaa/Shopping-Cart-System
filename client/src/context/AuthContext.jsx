import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import { clearAuthData, getToken, getUser, saveAuthData } from "../utils/auth";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setIsAuthLoading(false);
  }, []);

  const login = async (credentials) => {
    const result = await loginUser(credentials);
    saveAuthData({ token: result.token, user: result.user });
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const register = async (payload) => {
    const result = await registerUser(payload);
    saveAuthData({ token: result.token, user: result.user });
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthLoading,
      isAuthenticated: Boolean(token && user),
      isAdminUser: user?.role === "admin",
      login,
      register,
      logout
    }),
    [user, token, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
