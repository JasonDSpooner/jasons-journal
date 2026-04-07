"use client"

import Link from "next/link"
import { useState } from "react"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"

export default function Home() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [showAbout, setShowAbout] = useState(false)

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" : t.bg} transition-colors`}>
      <nav className="p-6 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : t.text}`}>Jason&apos;s Journal</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAbout(true)}
            className={`px-4 py-2 rounded-lg transition ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            About
          </button>
          <ThemeSwitcher />
          <Link 
            href="/dashboard"
            className={`px-4 py-2 rounded-lg transition ${theme === "dark" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Enter App
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className={`text-5xl font-bold mb-6 ${theme === "dark" ? "text-white" : t.text}`}>
            Jason&apos;s Journal, <span className="text-purple-400">AI-Powered</span>
          </h2>
          <p className={`text-xl mb-10 max-w-2xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            A personal dashboard with skill sharing, 
            AI text & image generation, and markdown journaling.
          </p>

          <Link 
            href="/dashboard"
            className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-lg"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {[
            { title: "Dashboard", desc: "Personal stats & quick actions", icon: "📊" },
            { title: "AI Tools", desc: "Text & image generation", icon: "🎨" },
            { title: "Journal", desc: "Markdown entries", icon: "📝" },
            { title: "Gallery", desc: "Generated images", icon: "🖼️" },
            { title: "Skills", desc: "Share your expertise", icon: "💡" },
          ].map((feature) => (
            <div key={feature.title} className={theme === "dark" ? "bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10" : `${t.card} p-6 rounded-xl border ${t.border}`}>
              <span className="text-3xl">{feature.icon}</span>
              <h3 className={`text-lg font-semibold mt-3 ${theme === "dark" ? "text-white" : t.text}`}>{feature.title}</h3>
              <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"} rounded-2xl border max-w-lg w-full p-8 relative`}>
            <button
              onClick={() => setShowAbout(false)}
              className={`absolute top-4 right-4 text-2xl ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
            >
              ×
            </button>
            <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>About Jason</h2>
            <div className={`space-y-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              <p>
                Hi! I&apos;m Jason — a curious creator, learner, and builder. This journal is my digital space 
                where I document my journey, explore new ideas, and experiment with AI-powered creativity.
              </p>
              <p>
                Whether it&apos;s coding projects, creative writing, or visual art, I believe in the power of 
                combining human imagination with artificial intelligence to create something unique.
              </p>
              <p>
                Through this platform, I share my skills, track my growth, and invite others to explore 
                the intersection of technology and personal expression.
              </p>
              <div className="pt-4">
                <h3 className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Get in Touch</h3>
                <p className="text-sm">
                  Want to collaborate or just say hi? Reach out through the app or connect with me online.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="mt-6 w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
