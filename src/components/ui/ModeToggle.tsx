"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import Button from "@/components/Button";
import { useExternalStore } from "@/hooks/useExternalStore";
import { themeStore, type Theme } from "@/store/themeStore";

export function ModeToggle() {
  const [theme] = useExternalStore(themeStore);

  const handleToggle = () => {
    let newTheme: Theme;
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      newTheme = systemTheme === "light" ? "dark" : "light";
    } else {
      newTheme = theme === "light" ? "dark" : "light";
    }
    themeStore.setTheme(newTheme);

  };

  const [effectiveTheme, setEffectiveTheme] = React.useState(theme);

  React.useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const getSystemTheme = () => (mediaQuery.matches ? "dark" : "light");
      setEffectiveTheme(getSystemTheme());

      const handler = () => setEffectiveTheme(getSystemTheme());
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
