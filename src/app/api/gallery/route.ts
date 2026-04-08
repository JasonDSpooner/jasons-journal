import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

interface GalleryImage {
  id: string
  url: string
  prompt: string
  createdAt: string
  metadata?: {
    width?: number
    height?: number
    model?: string
  }
}

// In-memory storage (replace with Vercel KV in production)
let galleryStore: Map<string, GalleryImage[]> = new Map()

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  
  const images = galleryStore.get(userId) || []
  
  if (id) {
    const image = images.find(img => img.id === id)
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }
    return NextResponse.json({ image })
  }
  
  // Sort by createdAt descending
  const sortedImages = [...images].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  
  return NextResponse.json({ images: sortedImages })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email
  const body = await request.json()
  
  const newImage: GalleryImage = {
    id: body.id || Date.now().toString(),
    url: body.url,
    prompt: body.prompt,
    createdAt: body.createdAt || new Date().toISOString(),
    metadata: body.metadata,
  }

  const userImages = galleryStore.get(userId) || []
  userImages.unshift(newImage)
  galleryStore.set(userId, userImages)

  return NextResponse.json({ image: newImage }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email
  const body = await request.json()
  const { id, ...updates } = body

  const userImages = galleryStore.get(userId) || []
  const imageIndex = userImages.findIndex(img => img.id === id)
  
  if (imageIndex === -1) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 })
  }

  userImages[imageIndex] = { ...userImages[imageIndex], ...updates }
  galleryStore.set(userId, userImages)

  return NextResponse.json({ image: userImages[imageIndex] })
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

  const userImages = galleryStore.get(userId) || []
  const filteredImages = userImages.filter(img => img.id !== id)
  galleryStore.set(userId, filteredImages)

  return NextResponse.json({ success: true })
}

// Bulk operations
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email
  const body = await request.json()
  const { action, ids } = body

  if (action === "delete" && Array.isArray(ids)) {
    const userImages = galleryStore.get(userId) || []
    const filteredImages = userImages.filter(img => !ids.includes(img.id))
    galleryStore.set(userId, filteredImages)
    return NextResponse.json({ success: true, deleted: ids.length })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
