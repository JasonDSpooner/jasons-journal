export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category?: "digital" | "physical"
  downloadable?: string
  entityId?: string
  entityName?: string
}

export interface CartItem {
  productId: string
  quantity: number
  product?: Product
}

const CART_KEY = "jasons-journal-cart"

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  const cart = localStorage.getItem(CART_KEY)
  return cart ? JSON.parse(cart) : []
}

export function addToCart(productId: string, product?: Product): void {
  if (typeof window === "undefined") return
  const cart = getCart()
  const existing = cart.find(item => item.productId === productId)
  
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({ productId, quantity: 1, product })
  }
  
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new Event("cart-updated"))
}

export function removeFromCart(productId: string): void {
  if (typeof window === "undefined") return
  const cart = getCart().filter(item => item.productId !== productId)
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new Event("cart-updated"))
}

export function updateQuantity(productId: string, quantity: number): void {
  if (typeof window === "undefined") return
  const cart = getCart()
  const item = cart.find(item => item.productId === productId)
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
      window.dispatchEvent(new Event("cart-updated"))
    }
  }
}

export function clearCart(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CART_KEY)
  window.dispatchEvent(new Event("cart-updated"))
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const price = item.product?.price || 0
    return total + (price * item.quantity)
  }, 0)
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
