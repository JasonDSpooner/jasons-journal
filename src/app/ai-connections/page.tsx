"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"

interface AIConnection {
  id: string
  name: string
  type: "pollinations" | "openai" | "anthropic" | "ollama" | "lmstudio" | "custom"
  endpoint?: string
  apiKey?: string
  enabled: boolean
}

const defaultConnections: AIConnection[] = [
  { id: "pollinations", name: "Pollinations.ai (Free)", type: "pollinations", enabled: true },
]

const presetProviders = [
  { type: "ollama", name: "Ollama (Local)", defaultEndpoint: "http://localhost:11434", icon: "🏠" },
  { type: "lmstudio", name: "LM Studio (Local)", defaultEndpoint: "http://localhost:1234/v1", icon: "💻" },
  { type: "openai", name: "OpenAI", defaultEndpoint: "https://api.openai.com/v1", icon: "🔑" },
  { type: "anthropic", name: "Anthropic Claude", defaultEndpoint: "https://api.anthropic.com/v1", icon: "🧠" },
  { type: "custom", name: "Custom OpenAI-Compatible", defaultEndpoint: "", icon: "⚙️" },
]

export default function AIConnections() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [connections, setConnections] = useState<AIConnection[]>([])
  const [selectedConnection, setSelectedConnection] = useState<AIConnection | null>(null)
  const [testPrompt, setTestPrompt] = useState("")
  const [testResult, setTestResult] = useState("")
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("ai-connections")
    if (saved) {
      setConnections(JSON.parse(saved))
    } else {
      setConnections(defaultConnections)
    }
  }, [])

  const saveConnections = useCallback((newConnections: AIConnection[]) => {
    setConnections(newConnections)
    localStorage.setItem("ai-connections", JSON.stringify(newConnections))
  }, [])

  const addConnection = useCallback((type: string) => {
    let presetName = ""
    let presetEndpoint = ""
    
    if (type === "ollama") { presetName = "Ollama (Local)"; presetEndpoint = "http://localhost:11434" }
    else if (type === "lmstudio") { presetName = "LM Studio (Local)"; presetEndpoint = "http://localhost:1234/v1" }
    else if (type === "openai") { presetName = "OpenAI"; presetEndpoint = "https://api.openai.com/v1" }
    else if (type === "anthropic") { presetName = "Anthropic Claude"; presetEndpoint = "https://api.anthropic.com/v1" }
    else if (type === "custom") { presetName = "Custom OpenAI-Compatible"; presetEndpoint = "" }
    else return
    
    const newConn: AIConnection = {
      id: `conn-${Date.now()}`,
      name: presetName,
      type: type as AIConnection["type"],
      endpoint: presetEndpoint,
      apiKey: "",
      enabled: true,
    }
    setConnections(prev => {
      const updated = [...prev, newConn]
      localStorage.setItem("ai-connections", JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateConnection = useCallback((id: string, field: string, value: string | boolean) => {
    setConnections(connections.map(c => c.id === id ? { ...c, [field]: value } : c))
  }, [connections])

  const deleteConnection = useCallback((id: string) => {
    saveConnections(connections.filter(c => c.id !== id))
    if (selectedConnection?.id === id) setSelectedConnection(null)
  }, [connections, selectedConnection, saveConnections])

  const saveConnection = () => {
    localStorage.setItem("ai-connections", JSON.stringify(connections))
    alert("Connection saved!")
  }

  const testConnection = async () => {
    if (!selectedConnection || !testPrompt.trim()) return
    setTesting(true)
    setTestResult("")

    try {
      const conn = selectedConnection

      if (conn.type === "pollinations") {
        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(testPrompt)}?model=openai`)
        const text = await res.text()
        setTestResult(text)
      } 
      else if (conn.type === "ollama" || conn.type === "lmstudio") {
        const res = await fetch(`${conn.endpoint}/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama3.2",
            messages: [{ role: "user", content: testPrompt }],
          }),
        })
        const data = await res.json()
        setTestResult(data.choices?.[0]?.message?.content || JSON.stringify(data))
      }
      else if (conn.type === "openai") {
        const reqHeaders: Record<string, string> = { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${conn.apiKey}` 
        }
        const res = await fetch(`${conn.endpoint}/chat/completions`, {
          method: "POST",
          headers: reqHeaders,
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: testPrompt }],
          }),
        })
        const data = await res.json()
        setTestResult(data.choices?.[0]?.message?.content || JSON.stringify(data))
      }
      else if (conn.type === "anthropic") {
        const reqHeaders: Record<string, string> = { 
          "Content-Type": "application/json",
          "x-api-key": conn.apiKey || "",
          "anthropic-version": "2023-06-01",
        }
        const res = await fetch(`${conn.endpoint}/messages`, {
          method: "POST",
          headers: reqHeaders,
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            messages: [{ role: "user", content: testPrompt }],
          }),
        })
        const data = await res.json()
        setTestResult(data.content?.[0]?.text || JSON.stringify(data))
      }
      else {
        const reqHeaders: Record<string, string> = { "Content-Type": "application/json" }
        if (conn.apiKey) reqHeaders["Authorization"] = `Bearer ${conn.apiKey}`
        const res = await fetch(`${conn.endpoint}/chat/completions`, {
          method: "POST",
          headers: reqHeaders,
          body: JSON.stringify({
            model: "default",
            messages: [{ role: "user", content: testPrompt }],
          }),
        })
        const data = await res.json()
        setTestResult(data.choices?.[0]?.message?.content || JSON.stringify(data))
      }
    } catch (err) {
      setTestResult("Error: " + (err as Error).message)
    }

    setTesting(false)
  }

  const getActiveConnection = () => connections.find(c => c.enabled) || connections[0]

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
          <h1 className={`text-xl font-bold ${t.text}`}>AI Connections (BYOA)</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
        </nav>

        <div className="container mx-auto p-8">
          <div className={`${t.card} p-4 rounded-xl border ${t.border} mb-6`}>
            <h2 className={`text-lg font-semibold mb-3 ${t.text}`}>Bring Your Own Agent</h2>
            <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Connect Jason&apos;s Journal to your preferred AI services. Use local agents like Ollama or connect to cloud providers.
            </p>
            <div className="text-xs text-green-500">
              ✓ Current: {getActiveConnection()?.name} ({getActiveConnection()?.type})
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${t.text}`}>Add Connection</h3>
              <div className="space-y-2">
                {presetProviders.map(preset => (
                  <button
                    key={preset.type}
                    onClick={() => addConnection(preset.type)}
                    className={`w-full text-left p-3 rounded-lg border ${t.border} hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3`}
                  >
                    <span className="text-xl">{preset.icon}</span>
                    <div>
                      <div className={`font-medium ${t.text}`}>{preset.name}</div>
                      <div className="text-xs text-gray-500">{preset.type === "ollama" || preset.type === "lmstudio" ? "Local" : "Cloud"}</div>
                    </div>
                  </button>
                ))}
              </div>

              <h3 className={`text-lg font-semibold mt-8 mb-4 ${t.text}`}>Your Connections</h3>
              <div className="space-y-2">
                {connections.map(conn => (
                  <div
                    key={conn.id}
                    onClick={() => setSelectedConnection(conn)}
                    className={`p-3 rounded-lg border cursor-pointer ${selectedConnection?.id === conn.id ? "border-blue-500 bg-blue-50" : t.border}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={conn.enabled}
                          onChange={(e) => { e.stopPropagation(); updateConnection(conn.id, "enabled", e.target.checked); saveConnections(connections); }}
                          className="w-4 h-4"
                        />
                        <span className={`font-medium ${t.text}`}>{conn.name}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteConnection(conn.id); }}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{conn.type}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {selectedConnection ? (
                <div className={`${t.card} p-6 rounded-xl border ${t.border}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${t.text}`}>Configure: {selectedConnection.name}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm mb-1 ${t.text}`}>Endpoint URL</label>
                      <input
                        type="text"
                        value={selectedConnection.endpoint || ""}
                        onChange={(e) => updateConnection(selectedConnection.id, "endpoint", e.target.value)}
                        className={`w-full p-2 border rounded ${t.input}`}
                        placeholder={selectedConnection.type === "ollama" ? "http://localhost:11434" : ""}
                      />
                      {selectedConnection.type === "ollama" && (
                        <p className="text-xs text-gray-500 mt-1">Default: http://localhost:11434</p>
                      )}
                    </div>

                    {(selectedConnection.type === "openai" || selectedConnection.type === "anthropic" || selectedConnection.type === "custom") && (
                      <div>
                        <label className={`block text-sm mb-1 ${t.text}`}>API Key</label>
                        <input
                          type="password"
                          value={selectedConnection.apiKey || ""}
                          onChange={(e) => updateConnection(selectedConnection.id, "apiKey", e.target.value)}
                          className={`w-full p-2 border rounded ${t.input}`}
                          placeholder="sk-..."
                        />
                      </div>
                    )}

                    <button onClick={saveConnection} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                      Save Connection
                    </button>

                    <div className="border-t pt-4 mt-4">
                      <label className={`block text-sm mb-2 ${t.text}`}>Test Connection</label>
                      <textarea
                        value={testPrompt}
                        onChange={(e) => setTestPrompt(e.target.value)}
                        className={`w-full p-2 border rounded h-24 ${t.input}`}
                        placeholder="Enter a test prompt..."
                      />
                      <button
                        onClick={testConnection}
                        disabled={testing || !testPrompt.trim()}
                        className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50"
                      >
                        {testing ? "Testing..." : "Test Connection"}
                      </button>

                      {testResult && (
                        <div className="mt-4 p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
                          <p className={`text-sm whitespace-pre-wrap ${t.text}`}>{testResult}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${t.card} p-6 rounded-xl border ${t.border} text-center text-gray-400`}>
                  Select a connection to configure
                </div>
              )}
            </div>
          </div>

          <div className={`mt-8 ${t.card} p-4 rounded-xl border ${t.border}`}>
            <h3 className={`font-semibold mb-2 ${t.text}`}>Quick Start: Local AI</h3>
            <div className={`text-sm space-y-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              <p><strong>Ollama:</strong> Install from ollama.ai, then run <code>ollama serve</code></p>
              <p><strong>LM Studio:</strong> Install from lmstudio.ai, start the server</p>
              <p><strong>Connect:</strong> Click above to add, use default localhost endpoints</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
