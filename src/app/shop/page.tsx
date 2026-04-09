"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"
import { CartDrawer, CartButton } from "@/components/Cart"
import { addToCart, getCart, CartItem } from "@/lib/cart"
import { products } from "@/lib/products"
import { Product } from "@/lib/cart"

export default function Shop() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [showCart, setShowCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const [category, setCategory] = useState<"all" | "digital" | "physical">("all")

  const handleAddToCart = (productId: string) => {
    addToCart(productId)
    setAddedToCart(productId)
    setTimeout(() => setAddedToCart(null), 1500)
  }

  const filteredProducts = category === "all" 
    ? products 
    : products.filter(p => p.category === category)

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
          <h1 className={`text-xl font-bold ${t.text}`}>Shop</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
            <CartButton onClick={() => setShowCart(true)} />
          </div>
        </nav>

        <div className="container mx-auto p-8">
          <div className={`${t.card} p-6 rounded-xl border ${t.border} mb-8`}>
            <h2 className={`text-2xl font-bold mb-2 ${t.text}`}>🛒 Jason&apos;s Dev Setup Store</h2>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Tools, gear, and resources I use daily. Support my work!
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            {(["all", "digital", "physical"] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg ${category === cat ? "bg-blue-500 text-white" : `${theme === "dark" ? "bg-slate-700" : "bg-gray-100"}`}`}
              >
                {cat === "all" ? "All Products" : cat === "digital" ? "📱 Digital" : "📦 Physical"}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className={`${t.card} rounded-xl border ${t.border} overflow-hidden hover:shadow-lg transition`}>
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                    product.category === "digital" 
                      ? "bg-blue-500 text-white" 
                      : "bg-orange-500 text-white"
                  }`}>
                    {product.category === "digital" ? "📱 Digital" : "📦 Physical"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className={`text-lg font-semibold mb-2 ${t.text}`}>{product.name}</h3>
                  <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-500">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        addedToCart === product.id
                          ? "bg-green-500 text-white"
                          : "bg-purple-500 text-white hover:bg-purple-600"
                      }`}
                    >
                      {addedToCart === product.id ? "✓ Added!" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-12 p-6 rounded-xl border ${t.border} text-center`}>
            <p className={`text-lg mb-2 ${t.text}`}>💳 Secure payments powered by Stripe</p>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              All transactions are secure and encrypted
            </p>
          </div>
        </div>
      </main>

      <CartDrawer 
        isOpen={showCart} 
        onClose={() => setShowCart(false)}
        onCheckout={() => {
          const cart = getCart()
          if (cart.length > 0) {
            window.location.href = `/shop/checkout?items=${encodeURIComponent(JSON.stringify(cart))}`
          }
        }}
      />
    </div>
  )
}
