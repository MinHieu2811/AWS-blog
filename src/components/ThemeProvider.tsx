"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { useExternalStore } from "@/hooks/useExternalStore";
import { themeStore } from "@/store/themeStore";
import Cookies from "js-cookie";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [theme] = useExternalStore(themeStore);
  const { setTheme: setNextTheme } = useTheme();

  React.useEffect(() => {
    const cookieTheme = Cookies.get("theme") as
      | "light"
      | "dark"
      | "system"
      | undefined;
    if (cookieTheme) {
      themeStore.setTheme(cookieTheme);
    }
  }, []);

  React.useEffect(() => {
    if (theme) {
      setNextTheme(theme);
    }
  }, [theme, setNextTheme]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
