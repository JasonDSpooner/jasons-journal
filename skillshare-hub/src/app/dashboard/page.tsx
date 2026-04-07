"use client"

import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"

export default function Dashboard() {
  const { theme } = useTheme()
  const t = themeClasses[theme]

  return (
    <div className={`min-h-screen ${t.bg} transition-colors`}>
      <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border}`}>
        <Link href="/" className="text-blue-500 hover:underline">← Home</Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <h1 className={`text-xl font-bold ${t.text}`}>Dashboard</h1>
        </div>
      </nav>

      <main className="container mx-auto p-8">
        <h2 className={`text-2xl font-bold mb-6 ${t.text}`}>Welcome to your dashboard!</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { href: "/skills", title: "Skills", desc: "Manage your skills", icon: "💡" },
            { href: "/journal", title: "Journal", desc: "Write entries", icon: "📝" },
            { href: "/ai", title: "AI Tools", desc: "Generate content", icon: "🎨" },
            { href: "/gallery", title: "Gallery", desc: "View images", icon: "🖼️" },
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={`${t.card} p-6 rounded-xl border ${t.border} hover:shadow-md transition`}
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className={`font-semibold text-lg mt-2 ${t.text}`}>{item.title}</h3>
              <p className="text-sm opacity-70">{item.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}