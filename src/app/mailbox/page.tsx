"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"

interface Message {
  id: string
  from: string
  subject: string
  content: string
  date: string
  read: boolean
}

export default function Mailbox() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [composeForm, setComposeForm] = useState({ to: "", subject: "", content: "" })

  useEffect(() => {
    const saved = localStorage.getItem("mailbox-messages")
    if (saved) setMessages(JSON.parse(saved))
    else setMessages([
      { id: "1", from: "System", subject: "Welcome to your mailbox!", content: "This is your personal mailbox. Messages you receive will appear here.", date: new Date().toISOString().split("T")[0], read: false },
    ])
  }, [])

  const saveMessages = (newMessages: Message[]) => {
    setMessages(newMessages)
    localStorage.setItem("mailbox-messages", JSON.stringify(newMessages))
  }

  const markAsRead = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: true } : m)
    saveMessages(updated)
  }

  const deleteMessage = (id: string) => {
    saveMessages(messages.filter(m => m.id !== id))
    if (selectedMessage?.id === id) setSelectedMessage(null)
  }

  const sendMessage = () => {
    if (!composeForm.to || !composeForm.content) return
    const newMessage: Message = {
      id: Date.now().toString(),
      from: "You",
      subject: composeForm.subject || "(No subject)",
      content: composeForm.content,
      date: new Date().toISOString().split("T")[0],
      read: true,
    }
    saveMessages([newMessage, ...messages])
    setShowCompose(false)
    setComposeForm({ to: "", subject: "", content: "" })
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border}`}>
          <h1 className={`text-xl font-bold ${t.text}`}>Mailbox</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowCompose(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">Compose</button>
            <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
          </div>
        </nav>

        <div className="flex flex-1 overflow-hidden">
          <div className={`w-80 border-r ${t.border} overflow-y-auto`}>
            <div className="p-4 border-b">
              <h2 className={`font-semibold ${t.text}`}>Inbox ({unreadCount} unread)</h2>
            </div>
            <div className="divide-y">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => { setSelectedMessage(msg); markAsRead(msg.id) }}
                  className={`p-4 cursor-pointer ${selectedMessage?.id === msg.id ? `${t.card}` : ""} ${!msg.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                >
                  <div className="flex justify-between">
                    <span className={`font-medium ${t.text}`}>{msg.from}</span>
                    <span className="text-xs text-gray-400">{msg.date}</span>
                  </div>
                  <p className={`text-sm truncate ${t.text}`}>{msg.subject}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="p-4 text-center text-gray-400">No messages</p>
              )}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {selectedMessage ? (
              <div className={`${t.card} p-6 rounded-xl border ${t.border}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${t.text}`}>{selectedMessage.subject}</h3>
                    <p className="text-sm text-gray-500">From: {selectedMessage.from}</p>
                  </div>
                  <button onClick={() => deleteMessage(selectedMessage.id)} className="text-red-500 hover:text-red-700">Delete</button>
                </div>
                <p className={`whitespace-pre-wrap ${t.text}`}>{selectedMessage.content}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`${t.card} p-6 rounded-xl w-full max-w-lg`}>
            <h3 className={`font-bold mb-4 ${t.text}`}>New Message</h3>
            <input
              value={composeForm.to}
              onChange={e => setComposeForm({ ...composeForm, to: e.target.value })}
              placeholder="To (username)"
              className={`w-full p-2 border rounded mb-2 ${t.input}`}
            />
            <input
              value={composeForm.subject}
              onChange={e => setComposeForm({ ...composeForm, subject: e.target.value })}
              placeholder="Subject"
              className={`w-full p-2 border rounded mb-2 ${t.input}`}
            />
            <textarea
              value={composeForm.content}
              onChange={e => setComposeForm({ ...composeForm, content: e.target.value })}
              placeholder="Message..."
              className={`w-full p-2 border rounded mb-4 h-40 ${t.input}`}
            />
            <div className="flex gap-2">
              <button onClick={sendMessage} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg">Send</button>
              <button onClick={() => setShowCompose(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
