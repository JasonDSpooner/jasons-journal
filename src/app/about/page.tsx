"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"

export default function AboutPage() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const sections = [
    {
      id: "it",
      title: "IT Professional",
      icon: "💻",
      color: "from-blue-500 to-cyan-500",
      content: `I enjoy making the machine go, making the wheel turn, solving problems. Making more problems along the way. Fixing all the problems in the machine is but a Dream. I love to Dream.

Long ago I got my A+ CompTIA IT Certification but now I help businesses grow. Currently supporting clients full-time with their technology needs.`,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop"
    },
    {
      id: "content",
      title: "Content Creator",
      icon: "🎬",
      color: "from-purple-500 to-pink-500",
      content: `From time to time I post on YouTube and create content for amazing people! I post about travel with my partner, sports betting, and whimsical things. I went to the Redwood Forest once.

Check out my YouTube playlist to see what I've been up to!`,
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=400&fit=crop",
      link: { href: "https://youtube.com/playlist?list=PL7qEi_YAF8Y5ISac1lD3jr52Jqg37M4Lj", label: "Watch on YouTube" }
    },
    {
      id: "biohack",
      title: "Biohacker",
      icon: "🧬",
      color: "from-green-500 to-emerald-500",
      content: `I've lost 100% of my body weight. I've also helped other men lose weight. Sometimes it's a complex challenge and I'm here to help.

I've had a complex set of roadblocks in my life that have made me the perfect coach to teach consistency. Your body is capable of amazing things.`,
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=400&fit=crop"
    },
    {
      id: "trading",
      title: "Crypto Trading",
      icon: "📈",
      color: "from-orange-500 to-yellow-500",
      content: `Using Python and the Hyperliquid network I have developed a trading platform. Hyperliquid is a decentralized exchange (DEX) where users trade directly on a blockchain.

My custom Python trading bot automates buying and selling using predefined strategies with technical indicators like RSI and Bollinger Bands. Recent demo tests show a 95% win rate!`,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
      link: { href: "/about/trading", label: "View Trading Page" }
    }
  ]

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
          <h1 className={`text-xl font-bold ${t.text}`}>About Jason</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
        </nav>

        <div className="container mx-auto p-8">
          <div className={`${t.card} p-6 rounded-xl border ${t.border} mb-8 text-center`}>
            <div className="text-6xl mb-4">👨‍💻</div>
            <h2 className={`text-3xl font-bold mb-2 ${t.text}`}>Jason Spooner</h2>
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              IT Professional · Content Creator · Biohacker
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="https://x.com/vote4arealclown" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">🐦 Twitter</a>
              <a href="https://www.instagram.com/vote4arealclown/" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">📸 Instagram</a>
              <a href="mailto:jasondspooner@gmail.com" className="text-purple-400 hover:underline">✉️ Email</a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {sections.map(section => (
              <div 
                key={section.id}
                className={`${t.card} rounded-xl border ${t.border} overflow-hidden hover:shadow-lg transition cursor-pointer`}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              >
                <div className={`h-40 bg-gradient-to-r ${section.color} relative`}>
                  <img src={section.image} alt="" className="w-full h-full object-cover opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">{section.icon}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 ${t.text}`}>{section.title}</h3>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} line-clamp-2`}>
                    {section.content.split('\n')[0]}
                  </p>
                  {section.link && (
                    <a 
                      href={section.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-blue-500 hover:underline text-sm"
                      onClick={e => e.stopPropagation()}
                    >
                      {section.link.label} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-12 ${t.card} p-8 rounded-xl border ${t.border}`}>
            <h2 className={`text-2xl font-bold mb-4 ${t.text}`}>🚀 Adventure?</h2>
            <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              I grew up playing Pitfall and Pacman. Are you up for Adventure?
            </p>
            <a 
              href="/about/adventure"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-bold hover:opacity-90 transition"
            >
              🎮 Play Now
            </a>
          </div>

          <div className={`mt-8 text-center ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            <p>Want to get in touch?</p>
            <a href="mailto:jasondspooner@gmail.com" className="text-blue-500 hover:underline">
              jasondspooner@gmail.com
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
