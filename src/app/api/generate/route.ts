import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, prompt, options = {} } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (type === "text") {
      // Generate text using Pollinations.ai
      const model = options.model || "openai"
      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=${model}`,
        { method: "GET" }
      )
      
      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`)
      }
      
      const text = await response.text()
      return NextResponse.json({ 
        type: "text",
        prompt,
        result: text,
        timestamp: new Date().toISOString(),
      })
    } 
    
    if (type === "image") {
      // Generate image URL using Pollinations.ai
      const width = options.width || 1024
      const height = options.height || 1024
      const imageModel = options.model || "flux"
      
      const encodedPrompt = encodeURIComponent(prompt)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${imageModel}&nologo=true`
      
      return NextResponse.json({ 
        type: "image",
        prompt,
        result: imageUrl,
        width,
        height,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({ error: "Invalid type. Use 'text' or 'image'" }, { status: 400 })
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate content", details: (error as Error).message },
      { status: 500 }
    )
  }
}

// GET endpoint for simple text generation
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const prompt = searchParams.get("prompt")
  const type = searchParams.get("type") || "text"

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
  }

  try {
    if (type === "text") {
      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`
      )
      const text = await response.text()
      return NextResponse.json({ result: text })
    }
    
    if (type === "image") {
      const encodedPrompt = encodeURIComponent(prompt)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&nologo=true`
      return NextResponse.json({ result: imageUrl })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { error: "Generation failed", details: (error as Error).message },
      { status: 500 }
    )
  }
}
