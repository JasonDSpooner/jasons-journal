"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/about", label: "About Jason", icon: "👤" },
  { href: "/journal", label: "Journal", icon: "📝" },
  { href: "/gallery", label: "Gallery", icon: "🖼️" },
  { href: "/ai", label: "AI Tools", icon: "🎨" },
  { href: "/ai-connections", label: "AI Connect", icon: "🔗" },
  { href: "/shop", label: "Shop", icon: "🛒" },
  { href: "/friends", label: "Friends", icon: "👥" },
  { href: "/mailbox", label: "Mailbox", icon: "📬" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
  { href: "/donate", label: "Donate", icon: "💝" },
]

export function Sidebar() {
  const { theme } = useTheme()
  const sessionData = useSession()
  const pathname = usePathname()
  const t = themeClasses[theme]
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Handle loading/unauthenticated state
  const session = sessionData?.data
  const status = sessionData?.status

  const userName = session?.user?.name || "User"
  const userImage = session?.user?.image

  // Show loading or simplified sidebar during SSR/static generation
  if (status === "loading" || !session) {
    return (
      <aside className={`${t.card} border-r ${t.border} flex flex-col w-64`}>
        <div className={`p-4 border-b ${t.border}`}>
          <span className={`font-bold text-lg ${t.text}`}>Jason&apos;s Journal</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Loading...</p>
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={`${t.card} border-r ${t.border} flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo/Brand */}
      <div className={`p-4 border-b ${t.border} flex items-center justify-between`}>
        {!isCollapsed && (
          <Link href="/" className={`font-bold text-lg ${t.text}`}>
            Jason&apos;s Journal
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1 rounded ${theme === "dark" ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* User Profile */}
      <div className={`p-4 border-b ${t.border}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          {userImage ? (
            <img
              src={userImage}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-purple-500"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className={`font-medium truncate ${t.text}`}>{userName.split(" ")[0]}</p>
              <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Online</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : `${theme === "dark" ? "hover:bg-slate-700" : "hover:bg-gray-100"} ${t.text}`
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t ${t.border}`}>
        <button
          onClick={() => signOut()}
          className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <span>🚪</span>
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
