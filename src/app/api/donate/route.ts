import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, type } = await request.json()

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Minimum donation is $1.00" }, { status: 400 })
    }

    // Mock response since Stripe is not configured
    return NextResponse.json({
      id: "mock_session_" + Date.now(),
      url: "/donate/success?mock=true",
    })
  } catch (error) {
    console.error("Error creating donation session:", error)
    return NextResponse.json(
      { error: "Failed to create donation session" },
      { status: 500 }
    )
  }
}
