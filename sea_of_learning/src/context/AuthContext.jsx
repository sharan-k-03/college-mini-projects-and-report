import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const MOCK_USER = {
  id: "u_me",
  name: "You",
  avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=sea_of_learning",
  email: "student@seaoflearning.app",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return null;
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
    return signedInUser;
  };

  const logout = () => {
    setUser(null);
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
