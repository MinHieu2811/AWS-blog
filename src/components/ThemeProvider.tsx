"use client";

import { useLayoutEffect, useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { useExternalStore } from "@/hooks/useExternalStore";
import { themeStore, type Theme } from "@/store/themeStore";
import Cookies from "js-cookie";

interface ThemeSyncProps {
  children: ReactNode;
}

function ThemeSync({ children }: ThemeSyncProps) {
  const [theme] = useExternalStore(themeStore);
  const { setTheme: setNextTheme, resolvedTheme } = useTheme();

  useLayoutEffect(() => {
    const cookieTheme = Cookies.get("theme") as Theme | undefined;
    if (cookieTheme) {
      themeStore.setTheme(cookieTheme);
    }
  }, []);

  useEffect(() => {
    if (theme) {
      setNextTheme(theme);
    }
  }, [theme, setNextTheme]);

  useEffect(() => {
    if (resolvedTheme) {
      document.documentElement.style.colorScheme = resolvedTheme;
    }
  }, [resolvedTheme]);

  return <>{children}</>;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSync>{children}</ThemeSync>
    </NextThemesProvider>
  );
}
