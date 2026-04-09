export type EntityType = "friend" | "project"
export type LayoutType = "portfolio" | "blog" | "gallery" | "store" | "minimal"

export interface FriendProject {
  id: string
  slug: string
  name: string
  type: EntityType
  tagline: string
  description: string
  avatar: string
  banner?: string
  layout: LayoutType
  theme?: {
    primary: string
    accent: string
  }
  links: {
    website?: string
    github?: string
    twitter?: string
    instagram?: string
  }
  products?: Product[]
  contactEmail?: string
  active: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  digital?: boolean
  downloadUrl?: string
}

export interface ContactMessage {
  id: string
  entityId: string
  entityName: string
  fromName: string
  fromEmail: string
  subject: string
  message: string
  status: "new" | "read" | "replied" | "forwarded"
  forwardedTo?: string
  createdAt: string
}

const CONTACTS_KEY = "jasons-journal-contacts"

export function getContacts(): ContactMessage[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(CONTACTS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveContact(contact: ContactMessage): void {
  if (typeof window === "undefined") return
  const contacts = getContacts()
  contacts.unshift(contact)
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts))
}

export function updateContactStatus(id: string, status: ContactMessage["status"], forwardedTo?: string): void {
  if (typeof window === "undefined") return
  const contacts = getContacts()
  const contact = contacts.find(c => c.id === id)
  if (contact) {
    contact.status = status
    if (forwardedTo) contact.forwardedTo = forwardedTo
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts))
  }
}

export function deleteContact(id: string): void {
  if (typeof window === "undefined") return
  const contacts = getContacts().filter(c => c.id !== id)
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts))
}
