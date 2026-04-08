import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

interface JournalEntry {
  id: string
  title: string
  content: string
  date: string
  lastModified: string
  tags?: string[]
  mood?: string
}

// In-memory storage (replace with Vercel KV in production)
let journalStore: Map<string, JournalEntry[]> = new Map()

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  
  const entries = journalStore.get(userId) || []
  
  if (id) {
    const entry = entries.find(e => e.id === id)
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }
    return NextResponse.json({ entry })
  }
  
  return NextResponse.json({ entries })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email
  const body = await request.json()
  
  const newEntry: JournalEntry = {
    id: body.id || Date.now().toString(),
    title: body.title,
    content: body.content,
    date: body.date || new Date().toISOString().split("T")[0],
    lastModified: new Date().toISOString(),
    tags: body.tags || [],
    mood: body.mood,
  }

  const userEntries = journalStore.get(userId) || []
  userEntries.unshift(newEntry)
  journalStore.set(userId, userEntries)

  return NextResponse.json({ entry: newEntry }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email
  const body = await request.json()
  const { id, ...updates } = body

  const userEntries = journalStore.get(userId) || []
  const entryIndex = userEntries.findIndex(e => e.id === id)
  
  if (entryIndex === -1) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 })
  }

  userEntries[entryIndex] = { 
    ...userEntries[entryIndex], 
    ...updates, 
    lastModified: new Date().toISOString() 
  }
  journalStore.set(userId, userEntries)

  return NextResponse.json({ entry: userEntries[entryIndex] })
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 })
  }

  const userEntries = journalStore.get(userId) || []
  const filteredEntries = userEntries.filter(e => e.id !== id)
  journalStore.set(userId, filteredEntries)

  return NextResponse.json({ success: true })
}
