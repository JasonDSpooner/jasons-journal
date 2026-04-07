"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"

const defaultSkills = [
  { id: 1, name: "Web Development", description: "Building modern web applications", category: "tech" },
  { id: 2, name: "UI/UX Design", description: "Creating user-friendly interfaces", category: "design" },
]

export default function Skills() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [skills] = useState(defaultSkills)

  return (
    <div className={`min-h-screen ${t.bg} transition-colors`}>
      <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border}`}>
        <Link href="/dashboard" className="text-blue-500 hover:underline">← Back</Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <h1 className={`text-xl font-bold ${t.text}`}>Skills</h1>
        </div>
      </nav>

      <main className="container mx-auto p-8">
        <h2 className={`text-2xl font-bold mb-6 ${t.text}`}>My Skills</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className={`${t.card} p-6 rounded-xl shadow-sm border ${t.border}`}>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {skill.category}
              </span>
              <h3 className={`font-semibold text-lg mt-2 ${t.text}`}>{skill.name}</h3>
              <p className="text-sm opacity-70 mt-1">{skill.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}