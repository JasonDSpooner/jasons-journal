"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export function SignInButton() {
  const { data: session } = useSession()

  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Sign Out
      </button>
    )
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
    >
      Sign In with Google
    </button>
  )
}

export function UserAvatar() {
  const { data: session } = useSession()

  if (!session?.user?.image) return null

  return (
    <img 
      src={session.user.image} 
      alt="Profile" 
      className="w-10 h-10 rounded-full"
    />
  )
}
