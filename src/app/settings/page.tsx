"use client"

import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { useEffect, useState, useRef, ChangeEvent } from "react"
import { exportAllData, generateJSONExport, generateMarkdownExport } from "@/lib/storage"
import { syncToCloud, syncFromCloud, getLastSynced } from "@/lib/sync"
import { Sidebar } from "@/components/Sidebar"

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const t = themeClasses[theme]
  const [stats, setStats] = useState({ journal: 0, gallery: 0, messages: 0 })
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const [lastSynced, setLastSynced] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [apiKey, setApiKey] = useState("")

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await exportAllData()
        setStats({
          journal: data.journal.length,
          gallery: data.gallery.length,
          messages: data.mailbox.length,
        })
        setLastSynced(getLastSynced())
      } catch (e) {
        console.error("Failed to load stats", e)
      }
    }
    loadStats()
    
    const savedKey = localStorage.getItem("pollinations-api-key")
    if (savedKey) setApiKey(savedKey)
  }, [])

  const handleExport = async (format: "json" | "markdown") => {
    setExporting(true)
    try {
      let content: string
      let filename: string
      let mimeType: string

      if (format === "json") {
        content = await generateJSONExport()
        filename = `jasons-journal-export-${Date.now()}.json`
        mimeType = "application/json"
      } else {
        content = await generateMarkdownExport()
        filename = `jasons-journal-export-${Date.now()}.md`
        mimeType = "text/markdown"
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error("Export failed", e)
      alert("Export failed. Please try again.")
    }
    setExporting(false)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setImportError(null)
    setImportSuccess(false)

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate the data structure
      if (!data.journal || !data.gallery || !data.media || !data.mailbox) {
        throw new Error("Invalid file format. Missing required fields.")
      }

        // Import data to localStorage
      if (!data.journal || !data.gallery || !data.mailbox) {
        throw new Error("Invalid file format. Missing required fields.")
      }

      if (Array.isArray(data.journal)) {
        localStorage.setItem("journal-entries", JSON.stringify(data.journal))
      }
      if (Array.isArray(data.gallery)) {
        localStorage.setItem("gallery-images", JSON.stringify(data.gallery))
      }
      if (Array.isArray(data.mailbox)) {
        localStorage.setItem("mailbox-messages", JSON.stringify(data.mailbox))
      }

      setImportSuccess(true)
      // Reload stats
      const newData = await exportAllData()
      setStats({
        journal: newData.journal.length,
        gallery: newData.gallery.length,
        messages: newData.mailbox.length,
      })
    } catch (error) {
      console.error("Import failed", error)
      setImportError((error as Error).message)
    }

    setImporting(false)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSyncToCloud = async () => {
    setIsSyncing(true)
    setSyncMessage(null)
    const result = await syncToCloud()
    if (result.success) {
      setSyncMessage("Synced to cloud successfully!")
      setLastSynced(getLastSynced())
    } else {
      setSyncMessage(`Sync failed: ${result.error}`)
    }
    setIsSyncing(false)
  }

  const handleSyncFromCloud = async () => {
    setIsSyncing(true)
    setSyncMessage(null)
    const result = await syncFromCloud()
    if (result.success) {
      setSyncMessage("Synced from cloud successfully!")
      setLastSynced(getLastSynced())
      // Reload stats
      const data = await exportAllData()
      setStats({
        journal: data.journal.length,
        gallery: data.gallery.length,
        messages: data.mailbox.length,
      })
    } else {
      setSyncMessage(`Sync failed: ${result.error}`)
    }
    setIsSyncing(false)
  }

  const clearAllData = async () => {
    if (!confirm("This will delete ALL your data permanently. Are you sure?")) return
    if (!confirm("Really? This cannot be undone.")) return
    
    localStorage.clear()
    indexedDB.deleteDatabase("jasons-journal-db")
    alert("All data cleared. Please refresh the app.")
  }

  const themes = [
    { key: "dark", label: "Dark", icon: "🌙" },
    { key: "light", label: "Light", icon: "☀️" },
    { key: "pastel", label: "Pastel", icon: "🌸" },
  ]

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
          <h1 className={`text-xl font-bold ${t.text}`}>Settings</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
        </nav>

        <div className="container mx-auto p-8 max-w-2xl">
          <section className={`${t.card} p-6 rounded-xl border ${t.border} mb-6`}>
            <h2 className={`text-lg font-semibold mb-4 ${t.text}`}>Theme</h2>
            <div className="flex gap-2">
              {themes.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key as "dark" | "light" | "pastel")}
                  className={`px-4 py-2 rounded-lg ${
                    theme === t.key 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </section>

          <section className={`${t.card} p-6 rounded-xl border ${t.border} mb-6`}>
            <h2 className={`text-lg font-semibold mb-2 ${t.text}`}>Pollinations.ai API Key</h2>
            <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Enter your own Pollinations.ai API key to use your account's quota and features. 
              Without a key, the app uses free endpoints with limited functionality.
            </p>
            <a 
              href="https://pollinations.ai/api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm block mb-4"
            >
              Get your free API key from Pollinations.ai →
            </a>
            <input
              type="password"
              placeholder="Enter your Pollinations.ai API key"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); localStorage.setItem("pollinations-api-key", e.target.value) }}
              className={`w-full p-3 border rounded-lg ${t.input}`}
            />
            {apiKey && (
              <p className="text-green-500 text-sm mt-2">✓ API key configured</p>
            )}
          </section>

          <section className={`${t.card} p-6 rounded-xl border ${t.border} mb-6`}>
            <h2 className={`text-lg font-semibold mb-4 ${t.text}`}>Your Data</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}>
                <p className="text-2xl font-bold">{stats.journal}</p>
                <p className="text-sm opacity-70">Journal Entries</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}>
                <p className="text-2xl font-bold">{stats.gallery}</p>
                <p className="text-sm opacity-70">Gallery Images</p>
              </div>
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}>
                <p className="text-2xl font-bold">{stats.messages}</p>
                <p className="text-sm opacity-70">Messages</p>
              </div>
            </div>
          </section>

          {/* Cloud Sync Section */}
          <section className={`${t.card} p-6 rounded-xl border ${t.border} mb-6`}>
            <h2 className={`text-lg font-semibold mb-4 ${t.text}`}>Cloud Sync</h2>
            <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Sync your data to Vercel KV for backup and access across devices.
              {lastSynced && (
                <span className="block mt-1 text-xs">
                  Last synced: {new Date(lastSynced).toLocaleString()}
                </span>
              )}
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleSyncToCloud}
                disabled={isSyncing}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
              >
                {isSyncing ? "Syncing..." : "↑ Sync to Cloud"}
              </button>
              <button
                onClick={handleSyncFromCloud}
                disabled={isSyncing}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isSyncing ? "Syncing..." : "↓ Sync from Cloud"}
              </button>
            </div>
            {syncMessage && (
              <p className={`mt-3 text-sm ${syncMessage.includes("failed") ? "text-red-500" : "text-green-500"}`}>
                {syncMessage}
              </p>
            )}
          </section>

          {/* Export/Import Section */}
          <section className={`${t.card} p-6 rounded-xl border ${t.border} mb-6`}>
            <h2 className={`text-lg font-semibold mb-4 ${t.text}`}>Export & Import</h2>
            <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Download all your data as JSON or Markdown, or import from a previous export.
            </p>
            <div className="flex gap-2 flex-wrap mb-4">
              <button
                onClick={() => handleExport("json")}
                disabled={exporting}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Export JSON
              </button>
              <button
                onClick={() => handleExport("markdown")}
                disabled={exporting}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
              >
                Export Markdown
              </button>
            </div>
            
            {/* Import Section */}
            <div className="border-t pt-4 mt-4">
              <h3 className={`font-medium mb-2 ${t.text}`}>Import Data</h3>
              <p className={`text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Import data from a JSON export file. This will merge with existing data.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleImportClick}
                disabled={importing}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {importing ? "Importing..." : "Import JSON File"}
              </button>
              {importError && (
                <p className="mt-2 text-sm text-red-500">{importError}</p>
              )}
              {importSuccess && (
                <p className="mt-2 text-sm text-green-500">Import successful! Data has been loaded.</p>
              )}
            </div>
          </section>

          <section className={`${t.card} p-6 rounded-xl border ${t.border} mb-6`}>
            <h2 className={`text-lg font-semibold mb-4 ${t.text}`}>Privacy & Security</h2>
            <Link href="/privacy" className="text-blue-500 hover:underline">
              View Privacy Policy →
            </Link>
            <div className="mt-4">
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Your data is stored locally on your device. Enable device encryption and 
                biometric locks for maximum security. Cloud sync requires Vercel KV setup.
              </p>
            </div>
          </section>

          <section className={`${t.card} p-6 rounded-xl border ${t.border} border-red-500/50`}>
            <h2 className={`text-lg font-semibold mb-4 text-red-500`}>Danger Zone</h2>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Clear All Data
            </button>
          </section>

          <section className={`mt-6 text-center ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            <p className="text-sm">Jason&apos;s Journal v1.0.0</p>
            <p className="text-xs mt-1">AI-Powered Personal Journal</p>
          </section>
        </div>
      </main>
    </div>
  )
}
