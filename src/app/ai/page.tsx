"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"

export default function AITools() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [prompt, setPrompt] = useState("")
  const [generatedText, setGeneratedText] = useState("")
  const [generatedImage, setGeneratedImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"text" | "image">("text")

  const generateText = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`)
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
      const encodedPrompt = encodeURIComponent(prompt)
      setGeneratedImage(`https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&nologo=true`)
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
          <h2 className={`text-2xl font-bold mb-6 ${t.text}`}>AI Generation</h2>

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
