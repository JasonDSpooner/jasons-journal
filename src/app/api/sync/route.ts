import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { kv } from "@vercel/kv"
import { authOptions } from "../auth/[...nextauth]/route"

interface UserData {
  journal: unknown[]
  gallery: unknown[]
  media: {
    skills: unknown[]
    socialLinks: unknown[]
    contact: Record<string, string>
  } | null
  mailbox: unknown[]
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.email
    const key = `user:${userId}:data`
    
    // Check if KV is configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json(
        { error: "Vercel KV not configured" },
        { status: 503 }
      )
    }

    const data = await kv.get<UserData>(key)
    
    if (!data) {
      return NextResponse.json({
        journal: [],
        gallery: [],
        media: { skills: [], socialLinks: [], contact: {} },
        mailbox: [],
        lastSynced: null,
      })
    }

    return NextResponse.json({
      ...data,
      lastSynced: new Date().toISOString(),
    })
  } catch (error) {
    console.error("KV GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch data", details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.email
    const key = `user:${userId}:data`
    const data = await request.json()

    // Check if KV is configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json(
        { error: "Vercel KV not configured" },
        { status: 503 }
      )
    }

    // Store data with metadata
    const dataToStore = {
      ...data,
      _syncedAt: new Date().toISOString(),
      _userId: userId,
    }

    await kv.set(key, dataToStore)

    return NextResponse.json({
      success: true,
      lastSynced: dataToStore._syncedAt,
    })
  } catch (error) {
    console.error("KV POST error:", error)
    return NextResponse.json(
      { error: "Failed to sync data", details: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const userId = session.user.email
    const key = `user:${userId}:data`

    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json(
        { error: "Vercel KV not configured" },
        { status: 503 }
      )
    }

    await kv.del(key)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("KV DELETE error:", error)
    return NextResponse.json(
      { error: "Failed to delete data", details: (error as Error).message },
      { status: 500 }
    )
  }
}
