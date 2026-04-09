import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
})

export async function GET() {
  try {
    const goalMonthly = 500000

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const charges = await stripe.charges.list({
      created: {
        gte: Math.floor(startOfMonth.getTime() / 1000),
      },
      limit: 100,
    })

    const donations = charges.data.filter(charge => {
      const description = charge.description || ""
      return description.toLowerCase().includes("support") || 
             charge.metadata?.type === "donation" ||
             (charge.metadata?.type === "donation")
    })

    const totalThisMonth = donations.reduce((sum, charge) => sum + charge.amount, 0)
    const donorCount = new Set(donations.map(d => d.receipt_email || d.billing_details?.email)).size

    const previousMonths: { month: string; amount: number; donors: number }[] = []
    for (let i = 1; i <= 5; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      date.setDate(1)
      date.setHours(0, 0, 0, 0)
      
      const endDate = new Date(date)
      endDate.setMonth(endDate.getMonth() + 1)

      const prevCharges = await stripe.charges.list({
        created: {
          gte: Math.floor(date.getTime() / 1000),
          lt: Math.floor(endDate.getTime() / 1000),
        },
        limit: 100,
      })

      const prevDonations = prevCharges.data.filter(charge => 
        charge.metadata?.type === "donation"
      )

      previousMonths.push({
        month: date.toISOString().slice(0, 7),
        amount: prevDonations.reduce((sum, charge) => sum + charge.amount, 0),
        donors: new Set(prevDonations.map(d => d.receipt_email || d.billing_details?.email)).size,
      })
    }

    return NextResponse.json({
      goalMonthly,
      totalThisMonth,
      donorCount,
      percentToGoal: Math.round((totalThisMonth / goalMonthly) * 100),
      history: previousMonths.reverse(),
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Donation stats error:", error)
    return NextResponse.json(
      { 
        goalMonthly: 500000,
        totalThisMonth: 0,
        donorCount: 0,
        percentToGoal: 0,
        history: [],
        error: "Unable to fetch stats" 
      },
      { status: 500 }
    )
  }
}
