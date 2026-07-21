import { useEffect, useState } from "react";
import {
  DARK_MODE_MEDIA_QUERY,
  isTheme,
  Theme,
  THEME_STORAGE_KEY,
} from "@/constants/theme";

const getSavedTheme = () => {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(savedTheme) ? savedTheme : null;
  } catch {
    return null;
  }
};

const getInitialTheme = () => {
  const savedTheme = getSavedTheme();
  if (savedTheme) {
    return savedTheme;
  }

  const documentTheme = document.documentElement.dataset.theme;
  if (isTheme(documentTheme)) {
    return documentTheme;
  }

  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches
    ? Theme.DARK
    : Theme.LIGHT;
};

export const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The selected theme still applies when storage is unavailable.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    );
  };

  return { theme, toggleTheme };
};
