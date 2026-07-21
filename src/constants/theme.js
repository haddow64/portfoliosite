export const Theme = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
});

export const THEME_STORAGE_KEY = "portfolio-theme";
export const DARK_MODE_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const isTheme = (value) =>
  value === Theme.LIGHT || value === Theme.DARK;
