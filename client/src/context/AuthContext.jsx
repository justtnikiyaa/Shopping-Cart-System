import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import { clearAuthData, getToken, getUser, saveAuthData } from "../utils/auth";
import { notifySuccess } from "../utils/toast";

const AuthContext = createContext(null);

const isValidStoredUser = (value) => {
  return Boolean(value && value.id && value.email && value.role);
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = getToken();
      const storedUser = getUser();

      if (storedToken && isValidStoredUser(storedUser)) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        clearAuthData();
      }
    } catch {
      clearAuthData();
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await loginUser(credentials);
    saveAuthData({ token: result.token, user: result.user });
    setToken(result.token);
    setUser(result.user);
    return result;
  }, []);

  const register = useCallback(async (payload) => {
    const result = await registerUser(payload);
    saveAuthData({ token: result.token, user: result.user });
    setToken(result.token);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback((options = {}) => {
    const { notify = true, message = "Logged out successfully." } = options;

    clearAuthData();
    setToken(null);
    setUser(null);

    if (notify) {
      notifySuccess(message);
    }
  }, []);

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
    [user, token, isAuthLoading, login, register, logout]
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
