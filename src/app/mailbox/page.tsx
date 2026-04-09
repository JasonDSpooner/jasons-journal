"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"
import { getContacts, updateContactStatus, deleteContact, ContactMessage } from "@/lib/entities"
import { entities } from "@/lib/entities-data"

type TabType = "contacts" | "sent"

export default function Mailbox() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [tab, setTab] = useState<TabType>("contacts")
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null)
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [forwardTo, setForwardTo] = useState("")
  const [showForward, setShowForward] = useState(false)

  const loadContacts = () => {
    setContacts(getContacts())
  }

  useEffect(() => {
    loadContacts()
    const interval = setInterval(loadContacts, 5000)
    return () => clearInterval(interval)
  }, [])

  const markAsRead = (id: string) => {
    updateContactStatus(id, "read")
    loadContacts()
  }

  const handleReply = () => {
    if (!selectedContact || !replyContent) return
    const mailtoLink = `mailto:${selectedContact.fromEmail}?subject=Re: ${selectedContact.subject}&body=${encodeURIComponent(replyContent)}`
    window.open(mailtoLink, "_blank")
    updateContactStatus(selectedContact.id, "replied")
    loadContacts()
    setShowReply(false)
    setReplyContent("")
  }

  const handleForward = () => {
    if (!selectedContact || !forwardTo) return
    const mailtoLink = `mailto:${forwardTo}?subject=FWD: ${selectedContact.subject}&body=${encodeURIComponent(`Forwarded from ${selectedContact.fromName} (${selectedContact.fromEmail}):\n\n${selectedContact.message}`)}`
    window.open(mailtoLink, "_blank")
    updateContactStatus(selectedContact.id, "forwarded", forwardTo)
    loadContacts()
    setShowForward(false)
    setForwardTo("")
  }

  const handleDelete = (id: string) => {
    deleteContact(id)
    if (selectedContact?.id === id) setSelectedContact(null)
    loadContacts()
  }

  const newCount = contacts.filter(c => c.status === "new").length

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border}`}>
          <h1 className={`text-xl font-bold ${t.text}`}>Mailbox</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
        </nav>

        <div className="flex border-b">
          <button
            onClick={() => setTab("contacts")}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              tab === "contacts" 
                ? "border-blue-500 text-blue-500" 
                : `border-transparent ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`
            }`}
          >
            📬 Contact Messages {newCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{newCount}</span>}
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className={`w-80 border-r ${t.border} overflow-y-auto`}>
            <div className="p-4 border-b">
              <h2 className={`font-semibold ${t.text}`}>
                {tab === "contacts" ? "Contact Inbox" : "Sent Messages"}
              </h2>
            </div>
            <div className="divide-y">
              {contacts.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => { setSelectedContact(msg); markAsRead(msg.id) }}
                  className={`p-4 cursor-pointer ${selectedContact?.id === msg.id ? `${t.card}` : ""} ${msg.status === "new" ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`font-medium text-sm ${t.text}`}>{msg.fromName}</div>
                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className={`text-sm truncate ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{msg.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      msg.status === "new" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                      msg.status === "read" ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" :
                      msg.status === "replied" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}>
                      {msg.status === "forwarded" ? `→ ${msg.forwardedTo}` : msg.status}
                    </span>
                    <span className="text-xs text-gray-400">via {msg.entityName}</span>
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="p-4 text-center text-gray-400">No contact messages yet</p>
              )}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {selectedContact ? (
              <div className={`${t.card} p-6 rounded-xl border ${t.border}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${t.text}`}>{selectedContact.subject}</h3>
                    <p className="text-sm text-gray-500">
                      From: {selectedContact.fromName} ({selectedContact.fromEmail})
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Via {selectedContact.entityName} • {new Date(selectedContact.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(selectedContact.id)} className="text-red-500 hover:text-red-700">Delete</button>
                </div>
                <p className={`whitespace-pre-wrap mb-6 p-4 rounded-lg ${theme === "dark" ? "bg-slate-700" : "bg-gray-50"}`}>
                  {selectedContact.message}
                </p>
                
                <div className="flex gap-3 flex-wrap">
                  <button 
                    onClick={() => setShowReply(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                  >
                    ↩️ Reply via Email
                  </button>
                  <button 
                    onClick={() => setShowForward(true)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
                  >
                    → Forward
                  </button>
                  <a 
                    href={`mailto:${selectedContact.fromEmail}?subject=${encodeURIComponent(selectedContact.subject)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    📧 Open in Mail
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="text-4xl mb-4">📬</p>
                  <p>Select a message to read</p>
                  <p className="text-sm mt-2">Contact messages from friends and projects will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showReply && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${t.card} p-6 rounded-xl w-full max-w-lg`}>
            <h3 className={`font-bold mb-4 ${t.text}`}>Reply to {selectedContact.fromName}</h3>
            <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              This will open your email client to reply to {selectedContact.fromEmail}
            </p>
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Your reply (will be copied to email)..."
              className={`w-full p-2 border rounded mb-4 h-40 ${t.input}`}
            />
            <div className="flex gap-2">
              <button onClick={handleReply} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg">Open Email Client</button>
              <button onClick={() => setShowReply(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showForward && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${t.card} p-6 rounded-xl w-full max-w-lg`}>
            <h3 className={`font-bold mb-4 ${t.text}`}>Forward Message</h3>
            <input
              type="email"
              value={forwardTo}
              onChange={e => setForwardTo(e.target.value)}
              placeholder="Forward to (email address)"
              className={`w-full p-2 border rounded mb-4 ${t.input}`}
            />
            <div className="flex gap-2">
              <button onClick={handleForward} className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg">Forward</button>
              <button onClick={() => setShowForward(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
