"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTheme, themeClasses } from "@/components/ThemeProvider"

function SuccessContent() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount")

  return (
    <div className={`min-h-screen ${t.bg} flex items-center justify-center p-8`}>
      <div className={`${t.card} p-8 rounded-xl border ${t.border} max-w-lg text-center`}>
        <div className="text-6xl mb-4">🎉</div>
        <h1 className={`text-3xl font-bold mb-4 ${t.text}`}>Thank You!</h1>
        <p className={`text-lg mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          Your donation of <span className="font-bold text-green-500">${amount ? (parseInt(amount) / 100).toFixed(2) : "0.00"}</span> has been received.
        </p>
        
        <div className={`p-4 rounded-lg mb-6 ${theme === "dark" ? "bg-green-900/20" : "bg-green-50"}`}>
          <p className={`text-sm ${theme === "dark" ? "text-green-300" : "text-green-700"}`}>
            💜 You&apos;re directly helping keep this app 100% free for everyone.
            Every dollar makes a difference!
          </p>
        </div>

        <div className="space-y-3">
          <Link 
            href="/dashboard" 
            className="block w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Go to Dashboard
          </Link>
          <Link 
            href="/donate" 
            className="block w-full py-3 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition"
          >
            Donate Again
          </Link>
        </div>

        <p className={`mt-8 text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
          A receipt has been sent to your email.
        </p>
      </div>
    </div>
  )
}

export default function DonateSuccessPage() {
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
