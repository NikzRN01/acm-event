"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const fromStorage = localStorage.getItem("ecg-theme");

    if (fromStorage === "dark") {
      root.classList.add("dark");
      setIsDark(true);
      return;
    }

    if (fromStorage === "light") {
      root.classList.remove("dark");
      setIsDark(false);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
    setIsDark(prefersDark);
  }, []);

  if (!mounted) return null;

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ecg-theme", next ? "dark" : "light");
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </Button>
  );
}
