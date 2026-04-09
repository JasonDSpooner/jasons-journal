"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTheme, themeClasses } from "@/components/ThemeProvider"

function CheckoutContent() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processCheckout = async () => {
      const itemsParam = searchParams.get("items")
      
      if (!itemsParam) {
        setError("No items in cart")
        setLoading(false)
        return
      }

      try {
        const items = JSON.parse(decodeURIComponent(itemsParam))
        
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        })

        const data = await response.json()

        if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error(data.error || "Failed to create checkout")
        }
      } catch (err) {
        setError((err as Error).message)
        setLoading(false)
      }
    }

    processCheckout()
  }, [searchParams])

  if (loading) {
    return (
      <div className={`min-h-screen ${t.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-4">🛒</div>
          <p className={`text-xl ${t.text}`}>Preparing checkout...</p>
          <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Redirecting to Stripe...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen ${t.bg} flex items-center justify-center`}>
        <div className={`${t.card} p-8 rounded-xl border ${t.border} max-w-md text-center`}>
          <div className="text-4xl mb-4">❌</div>
          <h1 className={`text-2xl font-bold mb-2 ${t.text}`}>Checkout Error</h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{error}</p>
          <a 
            href="/shop" 
            className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Return to Shop
          </a>
        </div>
      </div>
    )
  }

  return null
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
