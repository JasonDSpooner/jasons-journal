"use client"

import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/Sidebar"

interface Skill {
  id: string
  name: string
  description: string
  category: string
}

interface SocialLink {
  platform: string
  url: string
  username: string
}

interface ContactInfo {
  email: string
  phone: string
  location: string
}

interface PortfolioData {
  name: string
  title: string
  bio: string
  skills: Skill[]
  socialLinks: SocialLink[]
  contact: ContactInfo
}

export default function Portfolio() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [data, setData] = useState<PortfolioData>({
    name: "Jason",
    title: "Creator & Builder",
    bio: "A curious creator, learner, and builder exploring the intersection of technology and personal expression.",
    skills: [],
    socialLinks: [],
    contact: { email: "", phone: "", location: "" },
  })
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    // Load data from localStorage
    const savedSkills = localStorage.getItem("media-skills")
    const savedSocial = localStorage.getItem("media-social")
    const savedContact = localStorage.getItem("media-contact")

    const skills: Skill[] = savedSkills ? JSON.parse(savedSkills) : [
      { id: "1", name: "Web Development", description: "Building modern web applications", category: "tech" },
      { id: "2", name: "UI/UX Design", description: "Creating user-friendly interfaces", category: "design" },
    ]
    const socialLinks: SocialLink[] = savedSocial ? JSON.parse(savedSocial) : []
    const contact: ContactInfo = savedContact ? JSON.parse(savedContact) : { email: "", phone: "", location: "" }

    setData(prev => ({ ...prev, skills, socialLinks, contact }))
  }, [])

  const categories = ["all", ...Array.from(new Set(data.skills.map(s => s.category)))]
  const filteredSkills = selectedCategory === "all" 
    ? data.skills 
    : data.skills.filter(s => s.category === selectedCategory)

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
          <h1 className={`text-xl font-bold ${t.text}`}>Portfolio</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
        </nav>

        <div className="container mx-auto px-6 py-12 max-w-5xl">
          {/* Profile Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
              {data.name.charAt(0)}
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${t.text}`}>{data.name}</h1>
            <p className={`text-xl ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>{data.title}</p>
            <p className={`mt-4 max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {data.bio}
            </p>
            
            {/* Social Links */}
            {data.socialLinks.length > 0 && (
              <div className="flex justify-center gap-4 mt-6 flex-wrap">
                {data.socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-lg border ${t.border} ${t.card} hover:shadow-md transition`}
                  >
                    <span className={`font-medium ${t.text}`}>{link.platform}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Skills Section */}
          <section className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 text-center ${t.text}`}>Skills & Expertise</h2>
            
            {/* Category Filter */}
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    selectedCategory === cat
                      ? "bg-purple-500 text-white"
                      : `${t.card} border ${t.border} ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            {filteredSkills.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`${t.card} p-6 rounded-xl border ${t.border} hover:shadow-lg transition group`}
                  >
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 mb-3">
                      {skill.category}
                    </span>
                    <h3 className={`text-xl font-semibold mb-2 ${t.text} group-hover:text-purple-500 transition`}>
                      {skill.name}
                    </h3>
                    <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${t.card} rounded-xl border ${t.border}`}>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>No skills added yet</p>
                <Link href="/media" className="text-blue-500 hover:underline mt-2 inline-block">
                  Add skills in Media →
                </Link>
              </div>
            )}
          </section>

          {/* Contact Section */}
          {(data.contact.email || data.contact.phone || data.contact.location) && (
            <section className={`${t.card} p-8 rounded-xl border ${t.border} text-center`}>
              <h2 className={`text-2xl font-bold mb-6 ${t.text}`}>Get in Touch</h2>
              <div className="flex justify-center gap-8 flex-wrap">
                {data.contact.email && (
                  <div>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Email</p>
                    <a href={`mailto:${data.contact.email}`} className={`${t.text} hover:text-purple-500`}>
                      {data.contact.email}
                    </a>
                  </div>
                )}
                {data.contact.phone && (
                  <div>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Phone</p>
                    <p className={t.text}>{data.contact.phone}</p>
                  </div>
                )}
                {data.contact.location && (
                  <div>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Location</p>
                    <p className={t.text}>{data.contact.location}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className={`mt-12 pt-8 border-t ${t.border} text-center`}>
            <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
              © {new Date().getFullYear()} {data.name}. Built with Jason&apos;s Journal.
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}
