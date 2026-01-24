import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTheme = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setThemeState("light");
      applyTheme("light");
      setIsLoading(false);
      return;
    }

    try {
      const userConfig = await axios.get<any>(
        `${import.meta.env.VITE_API_URL}/users/${userId}/config`
      );
      const savedTheme = userConfig.data?.theme || "light";
      setThemeState(savedTheme as Theme);
      applyTheme(savedTheme as Theme);
    } catch (error) {
      setThemeState("light");
      applyTheme("light");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTheme();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userId") {
        fetchTheme();
      }
    };

    const handleUserIdChange = () => {
      fetchTheme();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userIdChanged", handleUserIdChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userIdChanged", handleUserIdChange);
    };
  }, [fetchTheme]);

  useEffect(() => {
    if (!isLoading) {
      applyTheme(theme);
    }
  }, [theme, isLoading]);

  const saveThemeToBackend = async (newTheme: Theme) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${userId}/config`,
        { theme: newTheme }
      );
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  };

  const setTheme = async (t: Theme) => {
    setThemeState(t);
    await saveThemeToBackend(t);
  };

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeState(newTheme);
    await saveThemeToBackend(newTheme);
  };

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}