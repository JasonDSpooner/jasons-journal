import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

interface Skill {
  id: string
  name: string
  description: string
  category: string
}

// In-memory storage (replace with Vercel KV in production)
let skillsStore: Map<string, Skill[]> = new Map()

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email
  const skills = skillsStore.get(userId) || []
  
  return NextResponse.json({ skills })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email
  const body = await request.json()
  
  const newSkill: Skill = {
    id: body.id || Date.now().toString(),
    name: body.name,
    description: body.description,
    category: body.category,
  }

  const userSkills = skillsStore.get(userId) || []
  userSkills.push(newSkill)
  skillsStore.set(userId, userSkills)

  return NextResponse.json({ skill: newSkill }, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.email
  const body = await request.json()
  const { id, ...updates } = body

  const userSkills = skillsStore.get(userId) || []
  const skillIndex = userSkills.findIndex(s => s.id === id)
  
  if (skillIndex === -1) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 })
  }

  userSkills[skillIndex] = { ...userSkills[skillIndex], ...updates }
  skillsStore.set(userId, userSkills)

  return NextResponse.json({ skill: userSkills[skillIndex] })
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

  const userSkills = skillsStore.get(userId) || []
  const filteredSkills = userSkills.filter(s => s.id !== id)
  skillsStore.set(userId, filteredSkills)

  return NextResponse.json({ success: true })
}
