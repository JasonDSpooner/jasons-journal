"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { clearCart } from "@/lib/cart"

function SuccessContent() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const searchParams = useSearchParams()

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <div className={`min-h-screen ${t.bg} flex items-center justify-center p-8`}>
      <div className={`${t.card} p-8 rounded-xl border ${t.border} max-w-lg text-center`}>
        <div className="text-6xl mb-4">🎉</div>
        <h1 className={`text-3xl font-bold mb-4 ${t.text}`}>Thank You!</h1>
        <p className={`text-lg mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          Your order has been placed successfully. You&apos;ll receive a confirmation email shortly.
        </p>
        
        {searchParams.get("session_id") && (
          <div className={`p-4 rounded-lg mb-6 ${theme === "dark" ? "bg-green-900/20" : "bg-green-50"}`}>
            <p className="text-green-500 text-sm">
              Order ID: {searchParams.get("session_id")?.slice(-12)}...
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/shop" 
            className="block w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Continue Shopping
          </Link>
          <Link 
            href="/dashboard" 
            className="block w-full py-3 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
