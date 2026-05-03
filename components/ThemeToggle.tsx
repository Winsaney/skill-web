"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={mounted ? (resolvedTheme === "dark" ? "切换到亮色模式" : "切换到深色模式") : "切换主题"}
    >
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Sun size={18} />
        ) : (
          <Moon size={18} />
        )
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
