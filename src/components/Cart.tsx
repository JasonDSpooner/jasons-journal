"use client"

import { useState, useEffect } from "react"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal, CartItem } from "@/lib/cart"
import { products } from "@/lib/products"
import { entities } from "@/lib/entities-data"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

function getProductInfo(cartItem: CartItem) {
  if (cartItem.product) return cartItem.product

  const mainProduct = products.find(p => p.id === cartItem.productId)
  if (mainProduct) {
    return {
      id: mainProduct.id,
      name: mainProduct.name,
      description: mainProduct.description,
      price: mainProduct.price,
      image: mainProduct.image
    }
  }

  for (const entity of entities) {
    if (entity.products) {
      const entityProduct = entity.products.find(p => p.id === cartItem.productId)
      if (entityProduct) {
        return {
          id: entityProduct.id,
          name: entityProduct.name,
          description: entityProduct.description,
          price: entityProduct.price,
          image: entityProduct.image,
          entityName: entity.name
        }
      }
    }
  }

  return null
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    setCartItems(getCart())
    
    const handleUpdate = () => setCartItems(getCart())
    window.addEventListener("cart-updated", handleUpdate)
    return () => window.removeEventListener("cart-updated", handleUpdate)
  }, [isOpen])

  const total = getCartTotal(cartItems)
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative w-full max-w-md ${theme === "dark" ? "bg-slate-800" : "bg-white"} shadow-xl flex flex-col`}>
        <div className={`p-4 border-b ${t.border} flex justify-between items-center`}>
          <h2 className={`text-xl font-bold ${t.text}`}>Your Cart ({itemCount})</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Your cart is empty
              </p>
              <button 
                onClick={onClose}
                className="mt-4 text-blue-500 hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => {
                const product = getProductInfo(item)
                if (!product) return null
                
                return (
                  <div key={item.productId} className={`p-3 rounded-lg ${theme === "dark" ? "bg-slate-700" : "bg-gray-50"}`}>
                    <div className="flex gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className={`font-medium ${t.text}`}>{product.name}</h3>
                        {product.entityName && (
                          <p className="text-xs text-purple-500">by {product.entityName}</p>
                        )}
                        <p className="text-sm text-green-500">${(product.price / 100).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className={`w-8 h-8 rounded ${theme === "dark" ? "bg-slate-600" : "bg-gray-200"}`}
                        >
                          -
                        </button>
                        <span className={t.text}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className={`w-8 h-8 rounded ${theme === "dark" ? "bg-slate-600" : "bg-gray-200"}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={`p-4 border-t ${t.border}`}>
            <div className="flex justify-between items-center mb-4">
              <span className={`font-semibold ${t.text}`}>Total</span>
              <span className="text-2xl font-bold text-green-500">${(total / 100).toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition"
            >
              Checkout with Stripe
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 py-2 text-red-500 hover:underline text-sm"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function CartButton({ onClick }: { onClick: () => void }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(getCart().reduce((sum, item) => sum + item.quantity, 0))
    
    const handleUpdate = () => setCount(getCart().reduce((sum, item) => sum + item.quantity, 0))
    window.addEventListener("cart-updated", handleUpdate)
    return () => window.removeEventListener("cart-updated", handleUpdate)
  }, [])

  return (
    <button 
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
    >
      <span className="text-xl">🛒</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  )
}
