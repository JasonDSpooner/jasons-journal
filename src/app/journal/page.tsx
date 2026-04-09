"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"
import { useSearchParams } from "next/navigation"
import { buildPollinationsUrl, buildImagePollinationsUrl } from "@/lib/pollinations"

interface JournalEntry {
  id: string
  title: string
  content: string
  date: string
  lastModified: string
}

interface AIHistoryItem {
  id: string
  type: "text" | "image"
  prompt: string
  response: string
  timestamp: string
}

function Calendar({ selectedDate, onSelectDate, entries, theme }: { selectedDate: string; onSelectDate: (date: string) => void; entries: JournalEntry[]; theme: "light" | "dark" | "pastel" }) {
  const t = themeClasses[theme]
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const today = new Date().toISOString().split("T")[0]
  const entryDates = new Set(entries.map(e => e.date))

  const goToPrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const goToNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  const goToToday = () => {
    setCurrentMonth(new Date())
    onSelectDate(today)
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className={`${t.card} p-4 rounded-xl border ${t.border}`}>
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPrevMonth} className={`p-1 hover:bg-gray-100 rounded ${theme === "dark" ? "text-gray-300" : ""}`}>◀</button>
        <span className={`font-medium ${t.text}`}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
        <button onClick={goToNextMonth} className={`p-1 hover:bg-gray-100 rounded ${theme === "dark" ? "text-gray-300" : ""}`}>▶</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-xs text-center text-gray-400">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          const hasEntry = entryDates.has(dateStr)
          const isToday = dateStr === today
          const isSelected = dateStr === selectedDate

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateStr)}
              className={`p-2 text-sm rounded-lg relative ${
                isSelected ? "bg-blue-500 text-white" :
                isToday ? "bg-purple-100 text-purple-700 font-bold" :
                `hover:bg-gray-100 ${theme === "dark" ? "text-gray-300" : t.text}`
              }`}
            >
              {day}
              {hasEntry && !isSelected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />}
            </button>
          )
        })}
      </div>
      <button onClick={goToToday} className="w-full mt-4 text-sm text-blue-500 hover:underline">
        Go to Today
      </button>
    </div>
  )
}

function JournalContent() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const searchParams = useSearchParams()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [aiHistory, setAiHistory] = useState<AIHistoryItem[]>([])
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMode, setAiMode] = useState<"text" | "image">("text")
  const [saveAsModal, setSaveAsModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(searchParams.get("date") || new Date().toISOString().split("T")[0])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("journal-entries")
    if (saved) setEntries(JSON.parse(saved))
    const savedHistory = localStorage.getItem("ai-history")
    if (savedHistory) setAiHistory(JSON.parse(savedHistory))
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    const entryForDate = entries.find(e => e.date === selectedDate)
    if (entryForDate) {
      setCurrentEntry(entryForDate)
      setEditTitle(entryForDate.title)
      setEditContent(entryForDate.content)
      setIsEditing(true)
    } else {
      setCurrentEntry(null)
      setEditTitle("")
      setEditContent("")
      setIsEditing(false)
    }
  }, [selectedDate, entries, isLoaded])

  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries)
    localStorage.setItem("journal-entries", JSON.stringify(newEntries))
  }

  const saveAiHistory = (newHistory: AIHistoryItem[]) => {
    setAiHistory(newHistory)
    localStorage.setItem("ai-history", JSON.stringify(newHistory))
  }

  const createNew = () => {
    const existingEntry = entries.find(e => e.date === selectedDate)
    if (existingEntry) {
      setCurrentEntry(existingEntry)
      setEditTitle(existingEntry.title)
      setEditContent(existingEntry.content)
      setIsEditing(true)
      return
    }
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: `Journal - ${selectedDate}`,
      content: "",
      date: selectedDate,
      lastModified: new Date().toISOString(),
    }
    setCurrentEntry(newEntry)
    setEditTitle(newEntry.title)
    setEditContent(newEntry.content)
    setIsEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  const saveCurrent = () => {
    if (!currentEntry) return
    const updated: JournalEntry = {
      ...currentEntry,
      title: editTitle || `Journal - ${selectedDate}`,
      content: editContent,
      lastModified: new Date().toISOString(),
    }
    const existing = entries.find((e) => e.id === currentEntry.id)
    let newEntries: JournalEntry[]
    if (existing) {
      newEntries = entries.map((e) => (e.id === currentEntry.id ? updated : e))
    } else {
      newEntries = [updated, ...entries]
    }
    saveEntries(newEntries)
    setCurrentEntry(updated)
    setIsEditing(false)
  }

  const saveAsNew = () => {
    if (!editTitle.trim()) return
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: editTitle,
      content: editContent,
      date: selectedDate,
      lastModified: new Date().toISOString(),
    }
    saveEntries([newEntry, ...entries])
    setCurrentEntry(newEntry)
    setSaveAsModal(false)
  }

  const deleteEntry = (id: string) => {
    const newEntries = entries.filter((e) => e.id !== id)
    saveEntries(newEntries)
    if (currentEntry?.id === id) {
      setCurrentEntry(null)
      setIsEditing(false)
      setEditTitle("")
      setEditContent("")
    }
  }

  const deleteAllEntries = () => {
    saveEntries([])
    setCurrentEntry(null)
    setIsEditing(false)
    setEditTitle("")
    setEditContent("")
    setShowDeleteConfirm(false)
  }

  const deleteCurrentEntry = () => {
    if (currentEntry) deleteEntry(currentEntry.id)
  }

  const openEntry = (entry: JournalEntry) => {
    setSelectedDate(entry.date)
    setCurrentEntry(entry)
    setEditTitle(entry.title)
    setEditContent(entry.content)
    setIsEditing(true)
  }

  const generateAIText = async () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiResponse("")
    try {
      const url = buildPollinationsUrl(aiPrompt, { model: "openai" })
      const res = await fetch(url)
      const text = await res.text()
      setAiResponse(text)
      const historyItem: AIHistoryItem = {
        id: Date.now().toString(),
        type: "text",
        prompt: aiPrompt,
        response: text,
        timestamp: new Date().toISOString(),
      }
      saveAiHistory([historyItem, ...aiHistory])
    } catch (err) {
      setAiResponse("Error: " + (err as Error).message)
    }
    setAiLoading(false)
  }

  const generateAIImage = async () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiResponse("")
    try {
      const imageUrl = buildImagePollinationsUrl(aiPrompt, { width: 1024, height: 1024, model: "flux" })
      setAiResponse(imageUrl)
      const historyItem: AIHistoryItem = {
        id: Date.now().toString(),
        type: "image",
        prompt: aiPrompt,
        response: imageUrl,
        timestamp: new Date().toISOString(),
      }
      saveAiHistory([historyItem, ...aiHistory])
      
      const galleryItem = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: aiPrompt,
        createdAt: new Date().toISOString(),
      }
      const savedGallery = localStorage.getItem("gallery-images")
      const galleryImages = savedGallery ? JSON.parse(savedGallery) : []
      localStorage.setItem("gallery-images", JSON.stringify([galleryItem, ...galleryImages]))
    } catch (err) {
      setAiResponse("Error: " + (err as Error).message)
    }
    setAiLoading(false)
  }

  const insertTextAtCursor = (text: string) => {
    if (!textareaRef.current) return
    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const newContent = editContent.substring(0, start) + text + editContent.substring(end)
    setEditContent(newContent)
  }

  return (
    <div className={`min-h-screen ${t.bg} flex transition-colors`}>
      <Sidebar />
      
      {/* Journal-specific Sidebar */}
      <aside className={`w-64 ${t.card} border-r p-4 overflow-y-auto flex flex-col ${t.border}`}>
        <div className="flex items-center justify-between mb-4">
          <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">← Dashboard</Link>
        </div>
        <div className="flex items-center justify-between mb-2">
          {isLoaded && entries.length > 0 && (
            <button onClick={() => setShowDeleteConfirm(true)} className="text-red-500 text-xs hover:underline">Clear All</button>
          )}
        </div>

        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} entries={entries} theme={theme} />

        <div className="mt-4">
          <button
            onClick={createNew}
            className={`w-full mb-4 px-4 py-2 rounded-lg hover:opacity-90 text-white bg-gradient-to-r ${t.accent}`}
          >
            {isLoaded && entries.find(e => e.date === selectedDate) ? "Edit Entry" : "Add Entry"}
          </button>
        </div>

        <div className="flex-1 mt-4">
          <h3 className={`font-medium text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Recent Entries</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {isLoaded && entries.slice(0, 10).map((entry) => (
              <div
                key={entry.id}
                className={`p-2 rounded-lg cursor-pointer border text-xs ${t.card} ${t.border} ${currentEntry?.id === entry.id ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"}`}
                onClick={() => openEntry(entry)}
              >
                <div className="flex justify-between items-start">
                  <span className={`truncate ${t.text}`}>{entry.title}</span>
                  <button onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id) }} className="text-red-400 hover:text-red-600">✕</button>
                </div>
                <p className="text-gray-400 text-xs mt-1">{entry.date}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setShowHistory(!showHistory)} className={`w-full mt-4 px-4 py-2 text-sm border rounded-lg ${t.border} hover:bg-gray-50`}>
          {showHistory ? "Hide" : "Show"} AI History
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <nav className={`${t.nav} border-b p-4 flex justify-between items-center ${t.border}`}>
          <div className="flex items-center gap-4">
            <h1 className={`text-xl font-bold ${t.text}`}>Journal</h1>
            <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{selectedDate}</span>
          </div>
          {isEditing && currentEntry && (
            <div className="flex gap-2">
              <button onClick={deleteCurrentEntry} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">Delete</button>
              <button onClick={saveCurrent} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">Save</button>
              <button onClick={() => setSaveAsModal(true)} className={`px-4 py-2 text-white rounded-lg text-sm bg-gradient-to-r ${t.accent}`}>Save As</button>
            </div>
          )}
        </nav>

        {!localStorage.getItem("pollinations-api-key") && (
          <div className={`mx-4 mt-4 p-3 rounded-lg border ${theme === "dark" ? "bg-yellow-900/20 border-yellow-700" : "bg-yellow-50 border-yellow-200"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🐝</span>
                <span className={`text-sm ${theme === "dark" ? "text-yellow-300" : "text-yellow-800"}`}>
                  Using free tier — add your Pollinations API key for more!
                </span>
              </div>
              <Link href="/settings" className="text-xs text-blue-500 hover:underline">
                Add Key →
              </Link>
            </div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            {isEditing && currentEntry ? (
              <div className="h-full flex flex-col">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Entry Title"
                  className={`text-2xl font-bold mb-4 p-2 border rounded-lg w-full ${t.input}`}
                />
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Write in Markdown..."
                  className={`flex-1 p-4 border rounded-lg resize-none font-mono min-h-[300px] ${t.input}`}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="text-lg">Select a date or create a new entry</p>
                  <p className="text-sm mt-2">{selectedDate}</p>
                  <button onClick={createNew} className={`mt-4 px-6 py-2 text-white rounded-lg bg-gradient-to-r ${t.accent}`}>Add Entry for {selectedDate}</button>
                </div>
              </div>
            )}
          </div>

          <div className={`w-96 border-l ${t.card} p-4 flex flex-col ${t.border} overflow-y-auto`}>
            <h2 className={`font-bold mb-4 ${t.text}`}>AI Assistant</h2>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAiMode("text")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${aiMode === "text" ? "bg-blue-500 text-white" : `${t.input}`}`}
              >
                Qwen Text
              </button>
              <button
                onClick={() => setAiMode("image")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${aiMode === "image" ? "bg-purple-500 text-white" : `${t.input}`}`}
              >
                Flux Image
              </button>
            </div>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder={aiMode === "text" ? "Ask Qwen to help write..." : "Describe an image to generate..."}
              className={`w-full p-3 border rounded-lg mb-3 h-24 text-sm ${t.input}`}
            />

            <button
              onClick={aiMode === "text" ? generateAIText : generateAIImage}
              disabled={aiLoading || !aiPrompt.trim()}
              className={`w-full px-4 py-2 text-white rounded-lg mb-2 disabled:opacity-50 bg-gradient-to-r ${t.accent}`}
            >
              {aiLoading ? "Generating..." : aiMode === "text" ? "Ask Qwen" : "Generate Image"}
            </button>

            {aiResponse && aiMode === "text" && (
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Response</span>
                  <button onClick={() => insertTextAtCursor(aiResponse)} className="text-xs text-blue-500 hover:underline">Insert to Journal</button>
                </div>
                <div className={`border rounded-lg p-3 overflow-auto max-h-40 ${theme === "dark" ? "bg-slate-700" : "bg-gray-50"}`}>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{aiResponse}</pre>
                </div>
              </div>
            )}

            {aiResponse && aiMode === "image" && (
              <div className="mb-2">
                <span className="text-xs text-gray-500">Generated Image</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={aiResponse} alt="Generated" className="w-full rounded-lg mt-1" />
              </div>
            )}

            {showHistory && aiHistory.length > 0 && (
              <div className="mt-4 border-t pt-4 flex-1 overflow-auto">
                <h3 className={`font-medium text-sm mb-2 ${t.text}`}>History</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {aiHistory.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 rounded text-xs cursor-pointer ${theme === "dark" ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-50 hover:bg-gray-100"}`}
                      onClick={() => { setAiPrompt(item.prompt); setAiResponse(item.response); setAiMode(item.type) }}
                    >
                      <span className="font-medium">{item.type === "text" ? "📝" : "🖼️"}</span>
                      <span className="ml-1 truncate">{item.prompt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {saveAsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${t.card} p-6 rounded-xl w-96`}>
            <h3 className={`font-bold mb-4 ${t.text}`}>Save As New Entry</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="New title"
              className={`w-full p-2 border rounded mb-4 ${t.input}`}
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={saveAsNew} className={`flex-1 px-4 py-2 text-white rounded-lg bg-green-500`}>Save</button>
              <button onClick={() => setSaveAsModal(false)} className={`flex-1 px-4 py-2 border rounded-lg ${t.input}`}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${t.card} p-6 rounded-xl w-96`}>
            <h3 className={`font-bold mb-4 ${t.text}`}>Delete All Entries?</h3>
            <p className={`mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>This will permanently delete all {entries.length} journal entries.</p>
            <div className="flex gap-2">
              <button onClick={deleteAllEntries} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg">Delete All</button>
              <button onClick={() => setShowDeleteConfirm(false)} className={`flex-1 px-4 py-2 border rounded-lg ${t.input}`}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Journal() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <JournalContent />
    </Suspense>
  )
}
