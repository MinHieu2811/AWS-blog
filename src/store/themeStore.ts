import { ExternalStore } from "@/hooks/useExternalStore";
import Cookies from "js-cookie";

export type Theme = "light" | "dark" | "system";

const initialTheme: Theme = "system";

class ThemeStore extends ExternalStore<Theme> {
  constructor() {
    super(initialTheme);
  }

  setTheme(theme: Theme) {
    this.setValue(theme);
    Cookies.set("theme", theme, { expires: 365 });
  }
}

export const themeStore = new ThemeStore();

