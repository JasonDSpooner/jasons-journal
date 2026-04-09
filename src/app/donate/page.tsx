"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"

const donationTiers = [
  { amount: 500, label: "$5", description: "Buy me a coffee ☕" },
  { amount: 1500, label: "$15", description: "Lunch is on you! 🍕" },
  { amount: 2500, label: "$25", description: "A solid contribution 💪" },
  { amount: 5000, label: "$50", description: "Major support! 🌟" },
  { amount: 10000, label: "$100", description: "Incredible generosity! 🚀" },
]

export default function DonatePage() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [selectedAmount, setSelectedAmount] = useState<number | null>(2500)
  const [customAmount, setCustomAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleDonate = async () => {
    const amount = customAmount ? Math.round(parseFloat(customAmount) * 100) : selectedAmount
    if (!amount || amount < 100) return

    setLoading(true)
    try {
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type: "donation" }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error("Donation error:", err)
    }
    setLoading(false)
  }

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
          <h1 className={`text-xl font-bold ${t.text}`}>Support This Project</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
        </nav>

        <div className="container mx-auto p-8 max-w-2xl">
          <div className={`${t.card} p-8 rounded-xl border ${t.border} text-center mb-8`}>
            <div className="text-6xl mb-4">💝</div>
            <h2 className={`text-3xl font-bold mb-4 ${t.text}`}>Keep This App 100% Free</h2>
            <p className={`text-lg mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              I&apos;m an independent developer building free tools for everyone. 
              This app will never have paywalls, premium tiers, or annoying ads.
            </p>
            
            <div className={`p-4 rounded-lg mb-6 ${theme === "dark" ? "bg-yellow-900/20 border border-yellow-700" : "bg-yellow-50 border border-yellow-200"}`}>
              <p className={`font-medium ${theme === "dark" ? "text-yellow-300" : "text-yellow-800"}`}>
                ⚠️ Important Note
              </p>
              <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                I will <strong>never</strong> DM you differently based on donations. 
                This is the <strong>only</strong> way to support this project. 
                Every dollar helps me keep the servers running and code flowing.
              </p>
            </div>

            <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-green-900/20 border border-green-700" : "bg-green-50 border border-green-200"}`}>
              <p className={`font-semibold text-lg mb-2 ${theme === "dark" ? "text-green-300" : "text-green-800"}`}>
                🎯 Goal: $5,000/month
              </p>
              <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                At $5K/month I can dedicate full-time to releasing all my code, stories, and apps 100% free forever.
              </p>
              <div className={`mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden`}>
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full" style={{ width: "12%" }}>
                </div>
              </div>
              <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Current progress: ~$600/month from 47 supporters
              </p>
            </div>
          </div>

          <div className={`${t.card} p-6 rounded-xl border ${t.border} mb-8`}>
            <h3 className={`text-xl font-bold mb-4 ${t.text}`}>Choose an Amount</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {donationTiers.map(tier => (
                <button
                  key={tier.amount}
                  onClick={() => { setSelectedAmount(tier.amount); setCustomAmount(""); }}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedAmount === tier.amount && !customAmount
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : `${t.border} hover:border-purple-300`
                  }`}
                >
                  <p className={`text-2xl font-bold ${t.text}`}>{tier.label}</p>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {tier.description}
                  </p>
                </button>
              ))}
            </div>

            <div className={`p-4 rounded-lg border ${t.border}`}>
              <label className={`block text-sm mb-2 ${t.text}`}>Or enter custom amount ($)</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  placeholder="25"
                  className={`flex-1 p-3 border rounded-lg text-xl ${t.input}`}
                />
              </div>
            </div>

            <button
              onClick={handleDonate}
              disabled={loading || (!selectedAmount && (!customAmount || parseFloat(customAmount) < 1))}
              className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Redirecting..." : `Donate ${customAmount ? `$${customAmount}` : selectedAmount ? `$${selectedAmount / 100}` : ""}`}
            </button>

            <p className={`text-center text-sm mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Secure payment via Stripe. Cancel anytime.
            </p>
          </div>

          <div className={`${t.card} p-6 rounded-xl border ${t.border}`}>
            <h3 className={`text-lg font-semibold mb-3 ${t.text}`}>What you get</h3>
            <ul className={`space-y-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              <li>✅ 100% free access to all features</li>
              <li>✅ No ads, ever</li>
              <li>✅ All future updates included</li>
              <li>✅ Knowledge that you&apos;re helping keep the internet free</li>
              <li>✅ Good vibes ✨</li>
            </ul>
          </div>

          <div className={`mt-8 text-center ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            <p className="text-sm">
              Made with 💜 by Jason Spoor
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
