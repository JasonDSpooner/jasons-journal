"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"
import { OnboardingWizard } from "@/components/OnboardingWizard"
import { useEffect, useState } from "react"

interface JournalEntry {
  id: string
  title: string
  content: string
  date: string
  lastModified: string
}

interface GalleryImage {
  id: string
  url: string
  prompt: string
  createdAt: string
}

interface Stats {
  journalCount: number
  galleryCount: number
  messagesCount: number
}

export default function Dashboard() {
  const { theme } = useTheme()
  const sessionData = useSession()
  const session = sessionData?.data
  const t = themeClasses[theme]
  
  const [stats, setStats] = useState<Stats>({ journalCount: 0, galleryCount: 0, messagesCount: 0 })
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
  const [recentImages, setRecentImages] = useState<GalleryImage[]>([])

  useEffect(() => {
    // Load stats from localStorage
    const journalData = localStorage.getItem("journal-entries")
    const galleryData = localStorage.getItem("gallery-images")
    const messagesData = localStorage.getItem("mailbox-messages")

    const entries: JournalEntry[] = journalData ? JSON.parse(journalData) : []
    const images: GalleryImage[] = galleryData ? JSON.parse(galleryData) : []
    const messages = messagesData ? JSON.parse(messagesData) : []

    setStats({
      journalCount: entries.length,
      galleryCount: images.length,
      messagesCount: messages.length,
    })

    // Get 3 most recent entries
    setRecentEntries(entries.slice(0, 3))
    setRecentImages(images.slice(0, 3))
  }, [])

  const userName = session?.user?.name || "Guest"
  const userImage = session?.user?.image

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <OnboardingWizard />
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Top Navigation */}
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
          <h1 className={`text-xl font-bold ${t.text}`}>Dashboard</h1>
          <Link href="/" className="text-blue-500 hover:underline text-sm">Home →</Link>
        </nav>

        <div className="container mx-auto p-8">
          {/* Welcome Section */}
          <div className={`${t.card} p-6 rounded-xl border ${t.border} mb-8`}>
            <div className="flex items-center gap-4">
              {userImage ? (
                <img src={userImage} alt="Profile" className="w-16 h-16 rounded-full border-2 border-purple-500" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className={`text-2xl font-bold ${t.text}`}>Welcome back, {userName.split(" ")[0]}!</h2>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Here&apos;s what&apos;s happening with your journal
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/journal"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
            >
              <span>✏️</span> New Entry
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <Link href="/journal">
              <div className={`${t.card} p-4 rounded-xl border ${t.border} text-center hover:shadow-md transition`}>
                <p className="text-3xl font-bold text-blue-500">{stats.journalCount}</p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Journal Entries</p>
              </div>
            </Link>
            <Link href="/gallery">
              <div className={`${t.card} p-4 rounded-xl border ${t.border} text-center hover:shadow-md transition`}>
                <p className="text-3xl font-bold text-purple-500">{stats.galleryCount}</p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Gallery Images</p>
              </div>
            </Link>
            <Link href="/mailbox">
              <div className={`${t.card} p-4 rounded-xl border ${t.border} text-center hover:shadow-md transition`}>
                <p className="text-3xl font-bold text-orange-500">{stats.messagesCount}</p>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Messages</p>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Recent Journal Entries */}
            <div className={`${t.card} p-6 rounded-xl border ${t.border}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-semibold ${t.text}`}>📝 Recent Entries</h3>
                <Link href="/journal" className="text-blue-500 text-sm hover:underline">View All</Link>
              </div>
              {recentEntries.length > 0 ? (
                <div className="space-y-3">
                  {recentEntries.map((entry) => (
                    <Link key={entry.id} href={`/journal?date=${entry.date}`}>
                      <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-slate-700" : "bg-gray-50"} hover:opacity-80 transition`}>
                        <p className={`font-medium text-sm ${t.text}`}>{entry.title}</p>
                        <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{entry.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>No entries yet. Start writing!</p>
              )}
            </div>

            {/* Recent Gallery Images */}
            <div className={`${t.card} p-6 rounded-xl border ${t.border}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-semibold ${t.text}`}>🖼️ Recent Images</h3>
                <Link href="/gallery" className="text-blue-500 text-sm hover:underline">View All</Link>
              </div>
              {recentImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {recentImages.map((img) => (
                    <Link key={img.id} href="/gallery">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.prompt} className="rounded-lg w-full aspect-square object-cover hover:opacity-80 transition" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>No images yet. Generate some in AI Tools!</p>
              )}
            </div>
          </div>

          {/* Quick Access Cards */}
          <h2 className={`text-xl font-bold mb-4 ${t.text}`}>Quick Access</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { href: "/shop", title: "Shop", desc: "Dev tools & gear", icon: "🛒" },
              { href: "/friends", title: "Friends", desc: "Creative network", icon: "👥" },
              { href: "/ai", title: "AI Tools", desc: "Generate content", icon: "🎨" },
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
        </div>
      </main>
    </div>
  )
}
