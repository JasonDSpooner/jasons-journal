import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // Mock webhook handler since Stripe is not configured
  return NextResponse.json({ received: true })
}
