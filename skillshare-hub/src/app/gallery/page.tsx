"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"

export default function Gallery() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [images] = useState([
    "https://placehold.co/300x200/6366f1/white?text=Image+1",
    "https://placehold.co/300x200/10b981/white?text=Image+2",
    "https://placehold.co/300x200/f59e0b/white?text=Image+3",
  ])

  return (
    <div className={`min-h-screen ${t.bg} transition-colors`}>
      <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border}`}>
        <Link href="/dashboard" className="text-blue-500 hover:underline">← Back</Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <h1 className={`text-xl font-bold ${t.text}`}>Gallery</h1>
        </div>
      </nav>

      <main className="container mx-auto p-8">
        <h2 className={`text-2xl font-bold mb-6 ${t.text}`}>My Images</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, i) => (
            <div key={i} className={`${t.card} p-2 rounded-xl shadow-sm border ${t.border}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Gallery ${i + 1}`} className="rounded-lg w-full" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}