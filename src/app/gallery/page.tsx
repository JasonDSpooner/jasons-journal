"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"
import { Sidebar } from "@/components/Sidebar"

interface GalleryImage {
  id: string
  url: string
  prompt: string
  createdAt: string
}

export default function Gallery() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [images, setImages] = useState<GalleryImage[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gallery-images")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  const saveImages = (newImages: GalleryImage[]) => {
    setImages(newImages)
    localStorage.setItem("gallery-images", JSON.stringify(newImages))
  }

  const deleteImage = (id: string) => {
    const newImages = images.filter(img => img.id !== id)
    saveImages(newImages)
    if (selectedImage?.id === id) setSelectedImage(null)
  }

  const clearAll = () => {
    if (confirm("Delete all images?")) {
      saveImages([])
      setSelectedImage(null)
    }
  }

  return (
    <div className={`min-h-screen ${t.bg} transition-colors flex`}>
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
          <h1 className={`text-xl font-bold ${t.text}`}>Gallery</h1>
          <div className="flex items-center gap-4">
            {images.length > 0 && (
              <button onClick={clearAll} className="text-red-500 text-sm hover:underline">Clear All</button>
            )}
            <Link href="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard →</Link>
          </div>
        </nav>

        <div className="container mx-auto p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${t.text}`}>My Images ({images.length})</h2>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No images yet</p>
              <p className="mt-2">Generate images in Journal to add them here</p>
              <Link href="/journal" className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg">Go to Journal</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className={`${t.card} p-2 rounded-xl shadow-sm border ${t.border} relative group`}>
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition z-10"
                  >
                    ×
                  </button>
                  <button onClick={() => setSelectedImage(img)} className="w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.prompt} className="rounded-lg w-full aspect-square object-cover" />
                    <p className="text-xs text-gray-500 mt-2 truncate">{img.prompt}</p>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50" onClick={() => setSelectedImage(null)}>
          <div className="max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage.url} alt={selectedImage.prompt} className="max-w-full max-h-[80vh] rounded-lg" />
            <p className="text-white text-center mt-4">{selectedImage.prompt}</p>
            <p className="text-gray-400 text-center text-sm">{selectedImage.createdAt}</p>
          </div>
        </div>
      )}
    </div>
  )
}
