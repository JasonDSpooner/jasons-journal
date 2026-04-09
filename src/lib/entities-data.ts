import { FriendProject, Product } from "./entities"

export const entities: FriendProject[] = [
  {
    id: "friend-1",
    slug: "sarah-artist",
    name: "Sarah Chen",
    type: "friend",
    tagline: "Digital Artist & Illustrator",
    description: "Creating whimsical digital illustrations that blend traditional art styles with modern technology. Specializing in character design and world-building.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&h=400&fit=crop",
    layout: "gallery",
    theme: {
      primary: "from-pink-500 to-purple-500",
      accent: "pink"
    },
    links: {
      website: "https://sarahchen.art",
      instagram: "sarahdraws"
    },
    products: [
      {
        id: "sc-art-pack-1",
        name: "Character Design Bundle",
        description: "20 unique character designs with expressions and poses",
        price: 2499,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
        digital: true,
        downloadUrl: "/downloads/sarah-character-bundle.zip"
      },
      {
        id: "sc-art-pack-2",
        name: "Background Assets Pack",
        description: "30 customizable background scenes for your projects",
        price: 1999,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        digital: true,
        downloadUrl: "/downloads/sarah-backgrounds.zip"
      }
    ],
    active: true,
    createdAt: "2024-01-15"
  },
  {
    id: "project-1",
    slug: "open-canvas",
    name: "Open Canvas",
    type: "project",
    tagline: "Collaborative Art Platform",
    description: "An open-source platform for artists to collaborate on digital murals and community art projects. Built with Next.js and real-time WebSocket connections.",
    avatar: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=400&fit=crop",
    layout: "portfolio",
    theme: {
      primary: "from-blue-500 to-cyan-500",
      accent: "blue"
    },
    links: {
      website: "https://opencanvas.app",
      github: "jasondspooner/open-canvas"
    },
    active: true,
    createdAt: "2024-03-20"
  },
  {
    id: "friend-2",
    slug: "marcus-dev",
    name: "Marcus Williams",
    type: "friend",
    tagline: "Full-Stack Developer",
    description: "Building developer tools and productivity apps. Passionate about developer experience and clean code.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=400&fit=crop",
    layout: "blog",
    theme: {
      primary: "from-green-500 to-emerald-500",
      accent: "green"
    },
    links: {
      website: "https://marcusdev.io",
      github: "marcuswilliams",
      twitter: "marcuscodes"
    },
    active: true,
    createdAt: "2024-02-10"
  },
  {
    id: "project-2",
    slug: "coloring-collective",
    name: "Coloring Collective",
    type: "project",
    tagline: "Community Coloring Pages",
    description: "A growing collection of adult coloring pages created by our community. Download, print, and share your creations.",
    avatar: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=200&h=200&fit=crop",
    banner: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&h=400&fit=crop",
    layout: "store",
    theme: {
      primary: "from-orange-500 to-yellow-500",
      accent: "orange"
    },
    links: {
      website: "https://coloringcollective.com"
    },
    products: [
      {
        id: "cc-mega-pack",
        name: "Mega Coloring Bundle",
        description: "100 intricate coloring pages - mandalas, animals, nature",
        price: 1499,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop",
        digital: true,
        downloadUrl: "/downloads/coloring-mega-pack.zip"
      },
      {
        id: "cc-monthly-sub",
        name: "Monthly Coloring Subscription",
        description: "Get 10 new designs every month",
        price: 499,
        image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=300&fit=crop",
        digital: true
      }
    ],
    active: true,
    createdAt: "2024-04-05"
  }
]

export function getEntityBySlug(slug: string): FriendProject | undefined {
  return entities.find(e => e.slug === slug)
}

export function getEntitiesByType(type: "friend" | "project"): FriendProject[] {
  return entities.filter(e => e.type === type && e.active)
}
