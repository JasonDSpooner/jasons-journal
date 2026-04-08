"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useTheme, themeClasses } from "@/components/ThemeProvider"

const themes = [
  { key: "dark", label: "Dark", icon: "🌙" },
  { key: "light", label: "Light", icon: "☀️" },
  { key: "pastel", label: "Pastel", icon: "🌸" },
]

// Google Logo SVG
function GoogleLogo() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

// GitHub Logo SVG
function GitHubLogo() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

// Google Sign In Button
function GoogleSignInButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
    >
      <GoogleLogo />
      <span>Sign in with Google</span>
    </button>
  )
}

// GitHub Sign In Button
function GitHubSignInButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 bg-gray-900 text-white font-medium rounded-lg border border-gray-800 hover:bg-gray-800 transition shadow-sm"
    >
      <GitHubLogo />
      <span>Sign in with GitHub</span>
    </button>
  )
}

// Get Started Buttons (Hero section)
function GoogleGetStartedButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-3 px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition text-lg"
    >
      <GoogleLogo />
      <span>Get Started with Google</span>
    </button>
  )
}

function GitHubGetStartedButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-lg border border-gray-800 hover:bg-gray-800 hover:shadow-md transition text-lg"
    >
      <GitHubLogo />
      <span>Get Started with GitHub</span>
    </button>
  )
}

export default function Home() {
  const { theme, setTheme } = useTheme()
  const sessionData = useSession()
  const session = sessionData?.data
  const status = sessionData?.status || "loading"
  const t = themeClasses[theme]
  const [showAbout, setShowAbout] = useState(false)

  const currentIndex = themes.findIndex(t => t.key === theme)
  const nextTheme = themes[(currentIndex + 1) % themes.length]

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" : t.bg} transition-colors`}>
      <nav className="p-6 flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : t.text}`}>Jason&apos;s Journal</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(nextTheme.key as "dark" | "light" | "pastel")}
            className={`px-3 py-2 rounded-lg transition ${theme === "dark" ? "text-gray-300 hover:text-white bg-white/5" : "text-gray-600 hover:text-gray-900 bg-gray-100"}`}
            title={`Switch to ${nextTheme.label}`}
          >
            {themes.find(t => t.key === theme)?.icon}
          </button>
          <button
            onClick={() => setShowAbout(true)}
            className={`px-4 py-2 rounded-lg transition ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            About
          </button>
          
          {isLoading ? (
            <span className={`px-4 py-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Loading...</span>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              {session?.user?.image && (
                <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full" />
              )}
              <span className={`hidden sm:inline ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                {session?.user?.name?.split(" ")[0]}
              </span>
              <Link 
                href="/dashboard"
                className={`px-4 py-2 rounded-lg transition ${theme === "dark" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <GoogleSignInButton onClick={() => signIn("google")} />
              <GitHubSignInButton onClick={() => signIn("github")} />
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className={`text-5xl font-bold mb-6 ${theme === "dark" ? "text-white" : t.text}`}>
            Jason&apos;s Journal, <span className="text-purple-400">AI-Powered</span>
          </h2>
          <p className={`text-xl mb-10 max-w-2xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            A personal dashboard with skill sharing, 
            AI text & image generation, and markdown journaling.
          </p>

          {isAuthenticated ? (
            <Link 
              href="/dashboard"
              className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GoogleGetStartedButton onClick={() => signIn("google")} />
              <GitHubGetStartedButton onClick={() => signIn("github")} />
            </div>
          )}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {[
            { title: "Dashboard", desc: "Personal stats & quick actions", icon: "📊" },
            { title: "Media", desc: "Skills, social & contact", icon: "📱" },
            { title: "Mailbox", desc: "Your messages", icon: "📬" },
            { title: "Journal", desc: "Markdown entries", icon: "📝" },
            { title: "Gallery", desc: "Generated images", icon: "🖼️" },
            { title: "AI Tools", desc: "Text & image generation", icon: "🎨" },
          ].map((feature) => (
            <div key={feature.title} className={theme === "dark" ? "bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10" : `${t.card} p-6 rounded-xl border ${t.border}`}>
              <span className="text-3xl">{feature.icon}</span>
              <h3 className={`text-lg font-semibold mt-3 ${theme === "dark" ? "text-white" : t.text}`}>{feature.title}</h3>
              <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"} rounded-2xl border max-w-lg w-full p-8 relative`}>
            <button
              onClick={() => setShowAbout(false)}
              className={`absolute top-4 right-4 text-2xl ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
            >
              ×
            </button>
            <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>About Jason</h2>
            <div className={`space-y-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              <p>
                Hi! I&apos;m Jason — a curious creator, learner, and builder. This journal is my digital space 
                where I document my journey, explore new ideas, and experiment with AI-powered creativity.
              </p>
              <p>
                Whether it&apos;s coding projects, creative writing, or visual art, I believe in the power of 
                combining human imagination with artificial intelligence to create something unique.
              </p>
              <p>
                Through this platform, I share my skills, track my growth, and invite others to explore 
                the intersection of technology and personal expression.
              </p>
              <div className="pt-4">
                <h3 className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Get in Touch</h3>
                <p className="text-sm">
                  Want to collaborate or just say hi? Reach out through the app or connect with me online.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="mt-6 w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
