import { act, renderHook } from "@testing-library/react";
import { Theme, THEME_STORAGE_KEY } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("uses a saved theme", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, Theme.DARK);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe(Theme.DARK);
    expect(document.documentElement.dataset.theme).toBe(Theme.DARK);
  });

  it("falls back to the system preference", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe(Theme.DARK);
  });

  it("toggles and persists the selected theme", () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe(Theme.DARK);
    expect(document.documentElement.dataset.theme).toBe(Theme.DARK);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe(Theme.DARK);
  });
});
