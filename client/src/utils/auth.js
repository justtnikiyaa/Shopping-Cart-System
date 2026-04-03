const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

const saveAuthData = ({ token, user }) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

const getUser = () => {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

const isAdmin = () => getUser()?.role === "admin";

const clearAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

const logout = () => {
  clearAuthData();
};

export { clearAuthData, getToken, getUser, isAdmin, logout, saveAuthData };
