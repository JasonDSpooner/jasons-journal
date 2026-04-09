import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
})

export async function POST(request: NextRequest) {
  try {
    const { amount, type } = await request.json()

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Minimum donation is $1.00" }, { status: 400 })
    }

    const origin = request.headers.get("origin") || "https://jasons-journal.vercel.app"

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Support Jason's Journal",
              description: "100% of proceeds go directly to keeping this app free forever. Thank you for your support!",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}&amount=${amount}`,
      cancel_url: `${origin}/donate`,
      metadata: {
        type: type || "donation",
        month: new Date().toISOString().slice(0, 7),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Donation error:", error)
    return NextResponse.json(
      { error: "Failed to create donation session" },
      { status: 500 }
    )
  }
}
