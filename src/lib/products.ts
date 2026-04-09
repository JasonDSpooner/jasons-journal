import { Product } from "./cart"

export const products: Product[] = [
  {
    id: "dev-bundle",
    name: "Developer Starter Bundle",
    description: "Essential tools and templates to kickstart your development workflow. Includes VS Code settings, Zsh config, and Git aliases.",
    price: 2900,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    category: "digital",
    downloadable: "/downloads/dev-bundle.zip"
  },
  {
    id: "coloring-pages",
    name: "Premium Coloring Pages Pack",
    description: "50 intricate adult coloring pages with mandala, nature, and abstract designs. Instant download PDF.",
    price: 997,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop",
    category: "digital",
    downloadable: "/downloads/coloring-pages.pdf"
  },
  {
    id: "mechanical-keyboard",
    name: "Mechanical Keyboard Kit",
    description: "65% hot-swappable mechanical keyboard with RGB backlighting. Cherry MX compatible switches included.",
    price: 14900,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=300&fit=crop",
    category: "physical"
  },
  {
    id: "desk-mat",
    name: "Premium Desk Mat XL",
    description: "Extra-large desk mat (90x40cm) with stitched edges. Water-resistant surface, anti-slip base.",
    price: 3500,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    category: "physical"
  },
  {
    id: "journaling-guide",
    name: "Digital Journaling Guide",
    description: "Comprehensive guide to building a daily journaling habit. Includes prompts, templates, and habit tracking.",
    price: 1497,
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop",
    category: "digital",
    downloadable: "/downloads/journaling-guide.pdf"
  },
  {
    id: "webcam-light",
    name: "Ring Light for Video Calls",
    description: "10-inch LED ring light with tripod stand. USB powered, adjustable brightness, perfect for remote work.",
    price: 4500,
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&h=300&fit=crop",
    category: "physical"
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: "digital" | "physical"): Product[] {
  return products.filter(p => p.category === category)
}
