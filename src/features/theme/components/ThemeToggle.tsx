import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/features/theme/contexts/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // We consider it checked if the theme is explicitly dark
  // or if it's "system" and the system prefers dark mode.
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        isDark ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
      }`}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`pointer-events-none relative flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          isDark ? "translate-x-5" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-slate-800" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        )}
      </span>
    </button>
  );
}
