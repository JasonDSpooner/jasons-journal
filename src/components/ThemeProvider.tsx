"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Theme = "light" | "dark" | "pastel"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")

  const setTheme = (newTheme: Theme | string) => {
    if (typeof newTheme === "string" && (newTheme === "dark" || newTheme === "light" || newTheme === "pastel")) {
      setThemeState(newTheme)
    }
  }

  useEffect(() => {
    localStorage.setItem("theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const themeClasses: Record<Theme, { bg: string; text: string; card: string; border: string; nav: string; input: string; button: string; accent: string }> = {
  dark: {
    bg: "bg-slate-900",
    text: "text-slate-100",
    card: "bg-slate-800",
    border: "border-slate-700",
    nav: "bg-slate-800",
    input: "bg-slate-700 border-slate-600 text-slate-100",
    button: "bg-blue-500 hover:bg-blue-600",
    accent: "from-purple-500 to-pink-500",
  },
  light: {
    bg: "bg-slate-50",
    text: "text-slate-800",
    card: "bg-white",
    border: "border-slate-200",
    nav: "bg-white",
    input: "bg-white border-slate-300 text-slate-800",
    button: "bg-blue-500 hover:bg-blue-600",
    accent: "from-blue-500 to-purple-500",
  },
  pastel: {
    bg: "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50",
    text: "text-slate-700",
    card: "bg-white/80 backdrop-blur",
    border: "border-purple-200",
    nav: "bg-white/60 backdrop-blur",
    input: "bg-white border-purple-200 text-slate-700",
    button: "bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500",
    accent: "from-pink-400 to-purple-400",
  },
}