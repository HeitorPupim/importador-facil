import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [userTheme, setUserTheme] = useState<Theme | null>(() => {
    // Tenta obter a preferência do usuário do localStorage
    const stored = localStorage.getItem("theme_preference") as Theme;
    return stored || null;
  });

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Aplica o tema atual
  useEffect(() => {
    const root = document.documentElement;
    
    // Se o usuário não definiu um tema específico, usa o tema do sistema
    const effectiveTheme = userTheme || systemTheme;
    root.classList.toggle("dark", effectiveTheme === "dark");
    
    // Salva a preferência do usuário no localStorage (se houver)
    if (userTheme) {
      localStorage.setItem("theme_preference", userTheme);
    } else {
      localStorage.removeItem("theme_preference");
    }
  }, [userTheme, systemTheme]);

  // Escuta mudanças na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // Adiciona o listener
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Função para obter o tema efetivo (resolvido)
  const getEffectiveTheme = (): "light" | "dark" => {
    return userTheme || systemTheme;
  };

  // Função para alternar entre claro e escuro
  const toggleTheme = () => {
    const currentEffective = getEffectiveTheme();
    const newTheme = currentEffective === "light" ? "dark" : "light";
    setUserTheme(newTheme);
  };

  // Função para resetar para o tema do sistema
  const resetToSystem = () => {
    setUserTheme(null);
  };

  return {
    userTheme,
    setUserTheme,
    systemTheme,
    effectiveTheme: getEffectiveTheme(),
    toggleTheme,
    resetToSystem,
  };
}
