"use client"

import { exportAllData } from "./storage"

export interface SyncStatus {
  lastSynced: string | null
  isSyncing: boolean
  error: string | null
}

export async function syncToCloud(): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await exportAllData()
    
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Sync failed")
    }

    const result = await response.json()
    
    // Update last synced timestamp
    localStorage.setItem("last-synced", new Date().toISOString())
    
    return { success: true }
  } catch (error) {
    console.error("Sync error:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function syncFromCloud(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/sync", {
      method: "GET",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Fetch failed")
    }

    const data = await response.json()
    
    // Import data to local storage
    if (data.journal) {
      localStorage.setItem("journal-entries", JSON.stringify(data.journal))
    }
    if (data.gallery) {
      localStorage.setItem("gallery-images", JSON.stringify(data.gallery))
    }
    if (data.media) {
      localStorage.setItem("media-skills", JSON.stringify(data.media.skills || []))
      localStorage.setItem("media-social", JSON.stringify(data.media.socialLinks || []))
      localStorage.setItem("media-contact", JSON.stringify(data.media.contact || {}))
    }
    if (data.mailbox) {
      localStorage.setItem("mailbox-messages", JSON.stringify(data.mailbox))
    }

    localStorage.setItem("last-synced", new Date().toISOString())
    
    return { success: true }
  } catch (error) {
    console.error("Sync from cloud error:", error)
    return { success: false, error: (error as Error).message }
  }
}

export function getLastSynced(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("last-synced")
}

export function clearLastSynced(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("last-synced")
}
