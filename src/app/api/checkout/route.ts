import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { products } from "@/lib/products"
import { entities } from "@/lib/entities-data"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
})

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
    const { items }: { items: CartItem[] } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of items) {
      let product = item.product

      if (!product) {
        const mainProduct = products.find(p => p.id === item.productId)
        if (mainProduct) {
          product = {
            id: mainProduct.id,
            name: mainProduct.name,
            description: mainProduct.description,
            price: mainProduct.price,
            image: mainProduct.image
          }
        }
      }

      if (!product) {
        for (const entity of entities) {
          if (entity.products) {
            const entityProduct = entity.products.find(p => p.id === item.productId)
            if (entityProduct) {
              product = {
                id: entityProduct.id,
                name: entityProduct.name,
                description: entityProduct.description,
                price: entityProduct.price,
                image: entityProduct.image,
                entityId: entity.id,
                entityName: entity.name
              }
              break
            }
          }
        }
      }

      if (product) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.entityName ? `by ${product.entityName}` : product.description,
              images: [product.image],
            },
            unit_amount: product.price,
          },
          quantity: item.quantity,
        })
      }
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "No valid products found" }, { status: 400 })
    }

    const origin = request.headers.get("origin") || "https://jasons-journal.vercel.app"

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/cancel`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      metadata: {
        items: JSON.stringify(items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          entityName: i.product?.entityName
        }))),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
