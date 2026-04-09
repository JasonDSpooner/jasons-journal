export function getPollinationsApiKey(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("pollinations-api-key") || null
}

export function hasPollinationsKey(): boolean {
  return !!getPollinationsApiKey()
}

export async function checkPollinationsStatus(): Promise<{ connected: boolean; level: string; error?: string }> {
  const apiKey = getPollinationsApiKey()
  if (!apiKey) {
    return { connected: false, level: "Free (No Key)" }
  }
  
  try {
    const response = await fetch(`https://api.pollinations.ai/account`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      return { 
        connected: true, 
        level: data.plan || data.tier || "Premium" 
      }
    } else {
      return { connected: false, level: "Invalid Key", error: "API key may be invalid" }
    }
  } catch (err) {
    return { connected: false, level: "Error", error: (err as Error).message }
  }
}

export function buildPollinationsUrl(prompt: string, options?: {
  model?: string
  width?: number
  height?: number
  nologo?: boolean
  seed?: number
}): string {
  const encodedPrompt = encodeURIComponent(prompt)
  const params = new URLSearchParams()
  
  if (options?.model) params.set("model", options.model)
  if (options?.width) params.set("width", options.width.toString())
  if (options?.height) params.set("height", options.height.toString())
  if (options?.nologo !== false) params.set("nologo", "true")
  if (options?.seed) params.set("seed", options.seed.toString())
  
  const apiKey = getPollinationsApiKey()
  if (apiKey) {
    params.set("key", apiKey)
  }
  
  return `https://text.pollinations.ai/${encodedPrompt}?${params.toString()}`
}

export function buildImagePollinationsUrl(prompt: string, options?: {
  width?: number
  height?: number
  model?: string
  nologo?: boolean
  seed?: number
  secure?: boolean
}): string {
  const encodedPrompt = encodeURIComponent(prompt)
  const params = new URLSearchParams()
  
  if (options?.width) params.set("width", options.width.toString())
  if (options?.height) params.set("height", options.height.toString())
  if (options?.model) params.set("model", options.model)
  else params.set("model", "flux")
  if (options?.nologo !== false) params.set("nologo", "true")
  if (options?.seed) params.set("seed", options.seed.toString())
  if (options?.secure) params.set("secure", "true")
  
  const apiKey = getPollinationsApiKey()
  if (apiKey) {
    params.set("key", apiKey)
  }
  
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`
}