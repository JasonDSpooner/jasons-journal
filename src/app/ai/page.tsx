"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"
import { buildPollinationsUrl, buildImagePollinationsUrl, getPollinationsApiKey, checkPollinationsStatus, hasPollinationsKey } from "@/lib/pollinations"

export default function AITools() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [prompt, setPrompt] = useState("")
  const [generatedText, setGeneratedText] = useState("")
  const [generatedImage, setGeneratedImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"text" | "image">("text")
  const [pollinStatus, setPollinStatus] = useState<{ connected: boolean; level: string }>({ connected: false, level: "Free" })

  useEffect(() => {
    checkPollinationsStatus().then(setPollinStatus)
  }, [])

  const generateText = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const url = buildPollinationsUrl(prompt, { model: "openai" })
      const res = await fetch(url)
      const text = await res.text()
      setGeneratedText(text)
    } catch (err) {
      setGeneratedText("Error: " + (err as Error).message)
    }
    setLoading(false)
  }

  const generateImage = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const url = buildImagePollinationsUrl(prompt, { width: 1024, height: 1024, model: "flux" })
      setGeneratedImage(url)
    } catch {
      setGeneratedImage("")
    }
    setLoading(false)
  }

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
          <h1 className={`text-xl font-bold ${t.text}`}>AI Tools</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
        </nav>

        <div className="container mx-auto p-8">
          {!pollinStatus.connected && (
            <div className={`mb-6 p-4 rounded-lg border ${theme === "dark" ? "bg-yellow-900/20 border-yellow-700" : "bg-yellow-50 border-yellow-200"}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🐝</span>
                <div className="flex-1">
                  <h3 className={`font-semibold ${theme === "dark" ? "text-yellow-300" : "text-yellow-800"}`}>
                    Get Your Own Pollinations API Key
                  </h3>
                  <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    You&apos;re on the free tier. Add your API key for higher limits, faster generation, and more models!
                  </p>
                  <Link 
                    href="/settings" 
                    className="inline-block mt-2 text-sm text-blue-500 hover:underline"
                  >
                    Add API Key in Settings →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${t.text}`}>AI Generation</h2>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${pollinStatus.connected ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
              <span className="text-sm">🐝</span>
              <span className="text-sm font-medium">{pollinStatus.connected ? pollinStatus.level : "Free (No Key)"}</span>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("text")}
              className={`px-4 py-2 rounded-lg ${activeTab === "text" ? "bg-blue-500 text-white" : `${t.input}`}`}
            >
              Text
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`px-4 py-2 rounded-lg ${activeTab === "image" ? "bg-blue-500 text-white" : `${t.input}`}`}
            >
              Image
            </button>
          </div>

          <div className={`${t.card} p-6 rounded-xl shadow-sm border ${t.border}`}>
            <textarea
              placeholder={activeTab === "text" ? "Enter a prompt for text generation..." : "Enter a prompt for image generation..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={`w-full p-3 border rounded-lg mb-4 h-32 ${t.input}`}
            />
            
            <button
              onClick={activeTab === "text" ? generateText : generateImage}
              disabled={loading}
              className={`px-6 py-2 text-white rounded-lg disabled:opacity-50 bg-gradient-to-r ${t.accent}`}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {generatedText && activeTab === "text" && (
            <div className={`mt-6 ${t.card} p-6 rounded-xl shadow-sm border ${t.border}`}>
              <h3 className={`font-semibold mb-3 ${t.text}`}>Generated Text</h3>
              <p className={`whitespace-pre-wrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{generatedText}</p>
            </div>
          )}

          {generatedImage && activeTab === "image" && (
            <div className="mt-6">
              <h3 className={`font-semibold mb-3 ${t.text}`}>Generated Image</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={generatedImage} alt="Generated" className="rounded-xl max-w-md" />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
