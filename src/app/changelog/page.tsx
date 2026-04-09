"use client"

import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"

const changelog = [
  {
    version: "v1.1.0",
    date: "April 2026",
    changes: [
      "Added branded Google and GitHub OAuth sign-in buttons",
      "Added Privacy Policy and Terms of Service pages",
      "Added footer with legal links on all pages",
      "Improved theme system with dark, light, and pastel modes",
      "Added sidebar navigation for authenticated users",
      "Added Terms of Service documentation",
    ],
  },
  {
    version: "v1.0.0",
    date: "April 2026",
    changes: [
      "Initial release of Jason's Journal",
      "Google and GitHub OAuth authentication",
      "Markdown journal with calendar view",
      "AI text and image generation via Pollinations.ai",
      "Personal skill portfolio management",
      "Gallery for storing generated images",
      "Media profile with skills, social links, and contact info",
      "Mailbox system for messages",
      "Cloud sync via Vercel KV",
      "Data export (JSON and Markdown)",
      "Data import functionality",
      "Theme switching (Dark, Light, Pastel)",
      "Responsive design for mobile and desktop",
      "PWA support with offline capabilities",
    ],
  },
]

const roadmap = [
  { feature: "End-to-end encryption for journal entries", status: "planned" },
  { feature: "Collaborative journal entries", status: "planned" },
  { feature: "AI-powered journal prompts", status: "planned" },
  { feature: "Voice-to-text journaling", status: "planned" },
  { feature: "Mood tracking and analytics", status: "planned" },
  { feature: "Custom themes and color schemes", status: "planned" },
  { feature: "Mobile app (iOS/Android)", status: "planned" },
  { feature: "Integration with external AI providers", status: "planned" },
]

export default function Changelog() {
  const { theme } = useTheme()
  const t = themeClasses[theme]

  return (
    <div className={`min-h-screen ${t.bg} transition-colors`}>
      <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border}`}>
        <Link href="/" className="text-blue-500 hover:underline">← Back to Home</Link>
        <h1 className={`text-xl font-bold ${t.text}`}>Changelog & Roadmap</h1>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Changelog Section */}
        <div className={`${t.card} p-8 rounded-xl border ${t.border} mb-8`}>
          <h1 className={`text-3xl font-bold mb-8 ${t.text}`}>Changelog</h1>
          
          <div className="space-y-8">
            {changelog.map((release) => (
              <div key={release.version} className={`border-l-4 border-purple-500 pl-6`}>
                <div className="flex items-baseline gap-3 mb-3">
                  <h2 className={`text-xl font-bold ${t.text}`}>{release.version}</h2>
                  <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {release.date}
                  </span>
                </div>
                <ul className={`space-y-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {release.changes.map((change, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap Section */}
        <div className={`${t.card} p-8 rounded-xl border ${t.border} mb-8`}>
          <h2 className={`text-2xl font-bold mb-6 ${t.text}`}>Roadmap</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {roadmap.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${t.border} ${theme === "dark" ? "bg-slate-700/50" : "bg-gray-50"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">○</span>
                  <span className={t.text}>{item.feature}</span>
                </div>
                <span className={`text-xs uppercase tracking-wide ml-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Color Psychology Section */}
        <div className={`${t.card} p-8 rounded-xl border ${t.border}`}>
          <h2 className={`text-2xl font-bold mb-6 ${t.text}`}>The Psychology of Color in Journaling</h2>
          
          <div className={`space-y-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            <p className="leading-relaxed">
              Colors profoundly impact our mood, creativity, and cognitive performance. 
              Jason's Journal offers three carefully crafted themes designed to optimize 
              your journaling experience based on color psychology research.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {/* Dark Mode */}
              <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🌙</span>
                  <h3 className="text-white font-semibold text-lg">Dark Mode</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Deep blues and purples create a calming, focused environment ideal for 
                  introspection and evening journaling.
                </p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Reduces eye strain in low light</li>
                  <li>• Promotes relaxation and sleep</li>
                  <li>• Enhances focus and concentration</li>
                  <li>• Perfect for late-night reflection</li>
                </ul>
              </div>

              {/* Light Mode */}
              <div className="p-6 rounded-xl bg-white border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">☀️</span>
                  <h3 className="text-gray-800 font-semibold text-lg">Light Mode</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Clean whites and slate grays provide clarity and energy, perfect for 
                  morning journaling and active brainstorming.
                </p>
                <ul className="text-gray-500 text-sm space-y-1">
                  <li>• Increases alertness and energy</li>
                  <li>• Improves readability in daylight</li>
                  <li>• Creates sense of openness</li>
                  <li>• Ideal for productive planning</li>
                </ul>
              </div>

              {/* Pastel Mode */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🌸</span>
                  <h3 className="text-slate-700 font-semibold text-lg">Pastel Mode</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Soft pinks and purples inspire creativity and emotional expression, 
                  encouraging artistic and free-form journaling.
                </p>
                <ul className="text-slate-500 text-sm space-y-1">
                  <li>• Stimulates creativity and imagination</li>
                  <li>• Reduces stress and anxiety</li>
                  <li>• Encourages emotional expression</li>
                  <li>• Perfect for artistic journaling</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-200">
              <h3 className={`font-semibold mb-3 ${t.text}`}>Research-Backed Benefits</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-purple-600 mb-2">Color Temperature</h4>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                    Warm colors (pastels) evoke emotions and creativity, while cool colors 
                    (dark mode blues) promote calm and analytical thinking.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-purple-600 mb-2">Circadian Rhythm</h4>
                  <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                    Dark interfaces in the evening help maintain natural sleep cycles by 
                    reducing blue light exposure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={`border-t ${t.border} py-6 mt-12`}>
        <div className="container mx-auto px-6 text-center">
          <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            © {new Date().getFullYear()} Jason&apos;s Journal. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="text-sm text-blue-500 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-blue-500 hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
