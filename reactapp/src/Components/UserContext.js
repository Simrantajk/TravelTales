import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const UserContext = createContext({
  username: null,
  userRole: null,
  setUser: () => {},
  clearUser: () => {},
});

export function UserProvider({ children, persist = true }) {
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Load from localStorage on mount (optional)
  useEffect(() => {
    if (!persist) return;
    const savedName = localStorage.getItem("username");
    const savedRole = localStorage.getItem("userRole");
    if (savedName) setUsername(savedName);
    if (savedRole) setUserRole(savedRole);
  }, [persist]);

  // Persist on change (optional)
  useEffect(() => {
    if (!persist) return;
    if (username) localStorage.setItem("username", username);
    else localStorage.removeItem("username");
  }, [username, persist]);

  useEffect(() => {
    if (!persist) return;
    if (userRole) localStorage.setItem("userRole", userRole);
    else localStorage.removeItem("userRole");
  }, [userRole, persist]);

  const setUser = ({ username: name, userRole: role }) => {
    if (typeof name !== "undefined") setUsername(name || null);
    if (typeof role !== "undefined") setUserRole(role || null);
  };

  const clearUser = () => {
    setUsername(null);
    setUserRole(null);
    // Also clear localStorage if persisting
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
  };

  const value = useMemo(
    () => ({ username, userRole, setUser, clearUser }),
    [username, userRole]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Ergonomic hook
export function useUser() {
  return useContext(UserContext);
}