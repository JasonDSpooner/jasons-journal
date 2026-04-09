"use client"

import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"

export default function CancelPage() {
  const { theme } = useTheme()
  const t = themeClasses[theme]

  return (
    <div className={`min-h-screen ${t.bg} flex items-center justify-center p-8`}>
      <div className={`${t.card} p-8 rounded-xl border ${t.border} max-w-lg text-center`}>
        <div className="text-6xl mb-4">😔</div>
        <h1 className={`text-3xl font-bold mb-4 ${t.text}`}>Order Cancelled</h1>
        <p className={`text-lg mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          Your order was cancelled. No charges were made to your card.
        </p>
        
        <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          Your cart items are still saved if you&apos;d like to try again.
        </p>

        <div className="space-y-3">
          <Link 
            href="/shop" 
            className="block w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Return to Shop
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
