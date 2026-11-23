import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const MOCK_USER = {
  id: "u_me",
  name: "You",
  avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=sea_of_learning",
  email: "student@seaoflearning.app",
};

const STORAGE_KEY = "sea_of_learning_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (account = null) => {
    const signedInUser = account
      ? {
          id: `u_${Date.now()}`,
          name: account.name?.trim() || "You",
          avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(account.name?.trim() || "sea_of_learning")}`,
          email: account.email?.trim() || MOCK_USER.email,
        }
      : MOCK_USER;
    setUser(signedInUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(signedInUser));
    } catch {}
    return signedInUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
