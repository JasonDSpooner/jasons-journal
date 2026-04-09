"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { getEntityBySlug } from "@/lib/entities-data"
import { FriendProject, Product, ContactMessage, saveContact } from "@/lib/entities"

interface Props {
  params: Promise<{ slug: string }>
}

export default function EntityPage({ params }: Props) {
  const resolvedParams = use(params)
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [entity, setEntity] = useState<FriendProject | null>(null)
  const [showContact, setShowContact] = useState(false)
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  useEffect(() => {
    const found = getEntityBySlug(resolvedParams.slug)
    setEntity(found || null)
  }, [resolvedParams.slug])

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!entity) return

    const message: ContactMessage = {
      id: Date.now().toString(),
      entityId: entity.id,
      entityName: entity.name,
      fromName: contactForm.name,
      fromEmail: contactForm.email,
      subject: `Message for ${entity.name}`,
      message: contactForm.message,
      status: "new",
      createdAt: new Date().toISOString()
    }

    saveContact(message)
    setSubmitted(true)
    setContactForm({ name: "", email: "", message: "" })
  }

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("jasons-journal-cart") || "[]")
    const existing = cart.find((item: { productId: string }) => item.productId === `${entity?.id}-${product.id}`)
    
    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({ productId: `${entity?.id}-${product.id}`, quantity: 1, product })
    }
    
    localStorage.setItem("jasons-journal-cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cart-updated"))
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 1500)
  }

  if (!entity) {
    return (
      <div className={`min-h-screen ${t.bg} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${t.text}`}>Not Found</h1>
          <Link href="/friends" className="text-blue-500 hover:underline mt-4 block">
            ← Back to Friends & Projects
          </Link>
        </div>
      </div>
    )
  }

  const primaryColor = entity.theme?.primary || "from-purple-500 to-blue-500"
  const accentColor = entity.theme?.accent || "purple"

  const renderLayout = () => {
    switch (entity.layout) {
      case "gallery":
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${t.text}`}>Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`aspect-square rounded-lg bg-gradient-to-br ${primaryColor} opacity-80`} />
              ))}
            </div>
          </div>
        )

      case "blog":
        return (
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold ${t.text}`}>Latest Posts</h2>
            {[
              { title: "Getting Started with Next.js 15", date: "Dec 15, 2024" },
              { title: "The Art of Clean Code", date: "Dec 10, 2024" },
              { title: "Building Developer Tools", date: "Dec 5, 2024" }
            ].map((post, i) => (
              <div key={i} className={`p-4 rounded-lg border ${t.border} hover:shadow-md transition cursor-pointer`}>
                <h3 className={`font-medium ${t.text}`}>{post.title}</h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{post.date}</p>
              </div>
            ))}
          </div>
        )

      case "store":
      case "portfolio":
      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen ${t.bg} transition-colors`}>
      <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
        <Link href="/friends" className={`text-sm ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
          ← Friends & Projects
        </Link>
        <button
          onClick={() => setShowContact(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
        >
          📬 Contact
        </button>
      </nav>

      <div className={`h-48 bg-gradient-to-r ${primaryColor}`}>
        {entity.banner && (
          <img src={entity.banner} alt="" className="w-full h-full object-cover opacity-50" />
        )}
      </div>

      <div className="container mx-auto px-4 -mt-16 pb-8">
        <div className={`${t.card} rounded-xl border ${t.border} p-6 shadow-lg`}>
          <div className="flex flex-col md:flex-row gap-6">
            <img 
              src={entity.avatar} 
              alt={entity.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto md:mx-0"
            />
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h1 className={`text-3xl font-bold ${t.text}`}>{entity.name}</h1>
                <span className={`px-2 py-1 rounded text-xs ${entity.type === "friend" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>
                  {entity.type === "friend" ? "Friend" : "Project"}
                </span>
              </div>
              <p className={`text-lg mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                {entity.tagline}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {entity.links.website && (
                  <a href={entity.links.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    🌐 Website
                  </a>
                )}
                {entity.links.github && (
                  <a href={`https://github.com/${entity.links.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:underline">
                    📦 GitHub
                  </a>
                )}
                {entity.links.twitter && (
                  <a href={`https://twitter.com/${entity.links.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    🐦 Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`${t.card} rounded-xl border ${t.border} p-6 mt-6`}>
          <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            {entity.description}
          </p>
        </div>

        {entity.layout !== "minimal" && renderLayout()}

        {entity.products && entity.products.length > 0 && (
          <div className="mt-8">
            <h2 className={`text-2xl font-bold mb-4 ${t.text}`}>🛒 Shop</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entity.products.map(product => (
                <div key={product.id} className={`${t.card} rounded-xl border ${t.border} overflow-hidden`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className={`font-semibold ${t.text}`}>{product.name}</h3>
                    <p className={`text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-500">${(product.price / 100).toFixed(2)}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          addedToCart === product.id
                            ? "bg-green-500 text-white"
                            : `bg-${accentColor}-500 text-white hover:bg-${accentColor}-600`
                        }`}
                      >
                        {addedToCart === product.id ? "✓ Added!" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${theme === "dark" ? "bg-slate-800" : "bg-white"} rounded-2xl max-w-md w-full p-6`}>
            <button onClick={() => { setShowContact(false); setSubmitted(false); }} className="float-right text-2xl">×</button>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className={`text-xl font-bold mb-2 ${t.text}`}>Message Sent!</h3>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                  Your message has been received. We&apos;ll get back to you soon!
                </p>
              </div>
            ) : (
              <>
                <h3 className={`text-xl font-bold mb-4 ${t.text}`}>Contact {entity.name}</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm mb-1 ${t.text}`}>Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                      className={`w-full p-2 border rounded ${t.input}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm mb-1 ${t.text}`}>Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                      className={`w-full p-2 border rounded ${t.input}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm mb-1 ${t.text}`}>Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                      className={`w-full p-2 border rounded ${t.input}`}
                    />
                  </div>
                  <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
