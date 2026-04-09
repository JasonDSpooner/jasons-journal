import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data since Stripe is not configured
    const goalMonthly = 500000
    const currentMonthly = 0
    const totalDonors = 0

    return NextResponse.json({
      current: currentMonthly,
      goal: goalMonthly,
      donors: totalDonors,
      percentage: Math.min(Math.round((currentMonthly / goalMonthly) * 100), 100),
    })
  } catch (error) {
    console.error("Error fetching donation stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch donation stats" },
      { status: 500 }
    )
  }
}
