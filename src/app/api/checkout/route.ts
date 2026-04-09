import { NextRequest, NextResponse } from "next/server"
import { products } from "@/lib/products"
import { entities } from "@/lib/entities-data"

interface CartItem {
  productId: string
  quantity: number
  product?: {
    id: string
    name: string
    description: string
    price: number
    image: string
    entityId?: string
    entityName?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Mock response since Stripe is not configured
    return NextResponse.json({
      id: "mock_session_" + Date.now(),
      url: "/shop/success?mock=true",
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
