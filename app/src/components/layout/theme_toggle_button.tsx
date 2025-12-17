"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

export function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (theme === "system") {
      setTheme(resolvedTheme ?? "light");
    }
  }, [resolvedTheme, theme, setTheme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return <Skeleton className="w-10 h-10 rounded-lg" />;
  }
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 text-card-foreground hover:bg-muted hover:text-primary"
    >
      <Sun className=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" size={20} />
      <Moon className="absolute  rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" size={20} />
    </button>
  );
}