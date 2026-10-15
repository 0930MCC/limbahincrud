import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("limbahin_theme") || "light");
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("limbahin_theme", theme);
  }, [theme]);

  // Dark mode only ever applies inside the portal (/app/*). Login and the public
  // marketing site always stay light, regardless of the stored preference — the
  // class still toggles on <html> (not a local wrapper) so Radix-portaled content
  // rendered inside the portal (dialogs, popovers, alerts) still inherits it correctly.
  useEffect(() => {
    const isPortal = location.pathname.startsWith("/app");
    document.documentElement.classList.toggle("dark", isPortal && theme === "dark");
  }, [theme, location.pathname]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}