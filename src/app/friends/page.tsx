"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"
import { entities, getEntitiesByType } from "@/lib/entities-data"
import { FriendProject } from "@/lib/entities"

export default function FriendsPage() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [filter, setFilter] = useState<"all" | "friend" | "project">("all")

  const filteredEntities = filter === "all" 
    ? entities.filter(e => e.active)
    : getEntitiesByType(filter)

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
          <h1 className={`text-xl font-bold ${t.text}`}>Friends & Projects</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
        </nav>

        <div className="container mx-auto p-8">
          <div className={`${t.card} p-6 rounded-xl border ${t.border} mb-8`}>
            <h2 className={`text-2xl font-bold mb-2 ${t.text}`}>👥 Creative Network</h2>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Friends, collaborators, and projects I&apos;m excited about. Click a card to learn more!
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            {(["all", "friend", "project"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg ${filter === f ? "bg-blue-500 text-white" : `${theme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}`}
              >
                {f === "all" ? "All" : f === "friend" ? "👤 Friends" : "🚀 Projects"}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntities.map(entity => (
              <Link key={entity.id} href={`/friends/${entity.slug}`}>
                <div className={`${t.card} rounded-xl border ${t.border} overflow-hidden hover:shadow-lg transition cursor-pointer h-full`}>
                  {entity.banner && (
                    <div className={`h-32 bg-gradient-to-r ${entity.theme?.primary || "from-purple-500 to-blue-500"}`} />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={entity.avatar} 
                        alt={entity.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow"
                      />
                      <div>
                        <h3 className={`font-semibold ${t.text}`}>{entity.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${entity.type === "friend" ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"}`}>
                          {entity.type === "friend" ? "👤 Friend" : "🚀 Project"}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {entity.tagline}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {entity.links.website && <span className="text-xs">🌐 Website</span>}
                      {entity.links.github && <span className="text-xs">📦 GitHub</span>}
                      {entity.links.twitter && <span className="text-xs">🐦 Twitter</span>}
                      {entity.links.instagram && <span className="text-xs">📸 Instagram</span>}
                      {entity.products && <span className="text-xs">🛒 Store</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredEntities.length === 0 && (
            <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              <p>No friends or projects yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
