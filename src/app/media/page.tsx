"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
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

export default function Media() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [activeTab, setActiveTab] = useState<"skills" | "social" | "contact">("skills")
  const [skills, setSkills] = useState<Skill[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [contact, setContact] = useState<ContactInfo>({ email: "", phone: "", location: "" })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const savedSkills = localStorage.getItem("media-skills")
    const savedSocial = localStorage.getItem("media-social")
    const savedContact = localStorage.getItem("media-contact")
    if (savedSkills) setSkills(JSON.parse(savedSkills))
    else setSkills([
      { id: "1", name: "Web Development", description: "Building modern web applications", category: "tech" },
      { id: "2", name: "UI/UX Design", description: "Creating user-friendly interfaces", category: "design" },
    ])
    if (savedSocial) setSocialLinks(JSON.parse(savedSocial))
    if (savedContact) setContact(JSON.parse(savedContact))
  }, [])

  const save = () => {
    localStorage.setItem("media-skills", JSON.stringify(skills))
    localStorage.setItem("media-social", JSON.stringify(socialLinks))
    localStorage.setItem("media-contact", JSON.stringify(contact))
    setIsEditing(false)
  }

  const addSkill = () => {
    setSkills([...skills, { id: Date.now().toString(), name: "New Skill", description: "", category: "other" }])
  }

  const updateSkill = (id: string, field: string, value: string) => {
    setSkills(skills.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const deleteSkill = (id: string) => setSkills(skills.filter(s => s.id !== id))

  const addSocial = () => {
    setSocialLinks([...socialLinks, { platform: "Twitter", url: "", username: "" }])
  }

  const updateSocial = (index: number, field: string, value: string) => {
    const updated = [...socialLinks]
    updated[index] = { ...updated[index], [field]: value }
    setSocialLinks(updated)
  }

  const deleteSocial = (index: number) => setSocialLinks(socialLinks.filter((_, i) => i !== index))

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
          <h1 className={`text-xl font-bold ${t.text}`}>Media Profile</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => isEditing ? save() : setIsEditing(true)}
              className={`px-4 py-2 rounded-lg text-white text-sm ${isEditing ? "bg-green-500" : "bg-blue-500"}`}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
            <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
          </div>
        </nav>

        <div className="flex gap-4 border-b px-4 pt-4">
          {(["skills", "social", "contact"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg capitalize ${activeTab === tab ? `${t.nav} ${t.text} border-t border-x` : "text-gray-500"}`}
            >
              {tab === "social" ? "Social Media" : tab}
            </button>
          ))}
        </div>

        <div className="container mx-auto p-6">
          {activeTab === "skills" && (
            <div>
              {isEditing && (
                <button onClick={addSkill} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg">+ Add Skill</button>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                {skills.map(skill => (
                  <div key={skill.id} className={`${t.card} p-6 rounded-xl border ${t.border}`}>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          value={skill.name}
                          onChange={e => updateSkill(skill.id, "name", e.target.value)}
                          className={`w-full p-2 border rounded ${t.input}`}
                          placeholder="Skill name"
                        />
                        <input
                          value={skill.category}
                          onChange={e => updateSkill(skill.id, "category", e.target.value)}
                          className={`w-full p-2 border rounded ${t.input}`}
                          placeholder="Category"
                        />
                        <textarea
                          value={skill.description}
                          onChange={e => updateSkill(skill.id, "description", e.target.value)}
                          className={`w-full p-2 border rounded ${t.input}`}
                          placeholder="Description"
                        />
                        <button onClick={() => deleteSkill(skill.id)} className="text-red-500 text-sm">Delete</button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{skill.category}</span>
                        <h3 className={`font-semibold text-lg mt-2 ${t.text}`}>{skill.name}</h3>
                        <p className="text-sm opacity-70 mt-1">{skill.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div>
              {isEditing && (
                <button onClick={addSocial} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg">+ Add Social</button>
              )}
              <div className="space-y-4">
                {socialLinks.map((link, i) => (
                  <div key={i} className={`${t.card} p-4 rounded-xl border ${t.border}`}>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          value={link.platform}
                          onChange={e => updateSocial(i, "platform", e.target.value)}
                          className={`w-full p-2 border rounded ${t.input}`}
                          placeholder="Platform (Twitter, GitHub, etc)"
                        />
                        <input
                          value={link.username}
                          onChange={e => updateSocial(i, "username", e.target.value)}
                          className={`w-full p-2 border rounded ${t.input}`}
                          placeholder="Username"
                        />
                        <input
                          value={link.url}
                          onChange={e => updateSocial(i, "url", e.target.value)}
                          className={`w-full p-2 border rounded ${t.input}`}
                          placeholder="URL"
                        />
                        <button onClick={() => deleteSocial(i)} className="text-red-500 text-sm">Delete</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-medium ${t.text}`}>{link.platform}</h3>
                          <p className="text-sm opacity-70">{link.username}</p>
                        </div>
                        {link.url && (
                          <a href={link.url} target="_blank" className="text-blue-500 hover:underline text-sm">Visit</a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {!isEditing && socialLinks.length === 0 && (
                  <p className="text-center text-gray-400">No social links added yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className={`${t.card} p-6 rounded-xl border ${t.border}`}>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm mb-1 ${t.text}`}>Email</label>
                    <input
                      value={contact.email}
                      onChange={e => setContact({ ...contact, email: e.target.value })}
                      className={`w-full p-2 border rounded ${t.input}`}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm mb-1 ${t.text}`}>Phone</label>
                    <input
                      value={contact.phone}
                      onChange={e => setContact({ ...contact, phone: e.target.value })}
                      className={`w-full p-2 border rounded ${t.input}`}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm mb-1 ${t.text}`}>Location</label>
                    <input
                      value={contact.location}
                      onChange={e => setContact({ ...contact, location: e.target.value })}
                      className={`w-full p-2 border rounded ${t.input}`}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {contact.email && (
                    <div>
                      <span className="text-sm text-gray-500">Email</span>
                      <p className={`${t.text}`}>{contact.email}</p>
                    </div>
                  )}
                  {contact.phone && (
                    <div>
                      <span className="text-sm text-gray-500">Phone</span>
                      <p className={`${t.text}`}>{contact.phone}</p>
                    </div>
                  )}
                  {contact.location && (
                    <div>
                      <span className="text-sm text-gray-500">Location</span>
                      <p className={`${t.text}`}>{contact.location}</p>
                    </div>
                  )}
                  {!contact.email && !contact.phone && !contact.location && (
                    <p className="text-center text-gray-400">No contact info added yet</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
