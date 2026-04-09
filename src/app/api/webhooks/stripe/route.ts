import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature") || ""

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      
      console.log("Payment successful:", session.id)
      console.log("Customer:", session.customer_details?.email)
      console.log("Items:", session.metadata?.items)
      
      break
    }
    
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("Payment intent succeeded:", paymentIntent.id)
      break
    }
    
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error("Payment failed:", paymentIntent.id, paymentIntent.last_payment_error?.message)
      break
    }
  }

  return NextResponse.json({ received: true })
}
