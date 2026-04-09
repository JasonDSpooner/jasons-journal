"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function DonationMeter() {
  const [stats, setStats] = useState<{
    totalThisMonth: number
    goalMonthly: number
    percentToGoal: number
    donorCount: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/donations/stats")
        const data = await res.json()
        setStats(data)
      } catch {
        setStats({
          totalThisMonth: 0,
          goalMonthly: 500000,
          percentToGoal: 0,
          donorCount: 0,
        })
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading || !stats) return null

  const percent = Math.min(stats.percentToGoal, 100)

  return (
    <Link href="/donate">
      <div className="fixed bottom-3 left-3 z-40 group cursor-pointer">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 hover:bg-black/80 transition-all">
          <span className="text-sm">💝</span>
          <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs text-white/80 font-medium">
            ${(stats.totalThisMonth / 100).toFixed(0)}/${stats.goalMonthly / 100}
          </span>
        </div>
        
        <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap border border-white/10">
            <p className="font-medium">Support Goal: ${(stats.goalMonthly / 100).toLocaleString()}/month</p>
            <p className="text-white/60 mt-0.5">
              ${(stats.totalThisMonth / 100).toFixed(2)} raised ({percent}%) · {stats.donorCount} supporters
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
