"use client"

import { useTheme, themeClasses } from "./ThemeProvider"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  // themeClasses is used for type consistency
  void themeClasses[theme]

  const themes: { key: "dark" | "light" | "pastel"; label: string; icon: string }[] = [
    { key: "dark", label: "Dark", icon: "🌙" },
    { key: "light", label: "Light", icon: "☀️" },
    { key: "pastel", label: "Pastel", icon: "🌸" },
  ]

  return (
    <div className="flex gap-1">
      {themes.map((t) => (
        <button
          key={t.key}
          onClick={() => setTheme(t.key)}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            theme === t.key
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  )
}