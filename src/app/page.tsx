'use client'

import { useState, useEffect } from 'react'
import { client } from '../sanity/lib/client'
import { urlFor } from '../lib/sanityClient'
import ArtworkCard from './components/ArtworkCard'
import './portfolio.css'

interface Artwork {
  _id: string
  title: string
  slug: { current: string }
  mainImage?: {
    asset: {
      _ref: string
    }
  }
}

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(false)


  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const query = `*[_type == "artwork"] {
          _id,
          title,
          slug,
          mainImage
        }`
        const data = await client.fetch(query)
        setArtworks(data)
      } catch (error) {
        console.error('Error fetching artworks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [])

  // Track when all images are loaded
  useEffect(() => {
    if (!loading && artworks.length > 0) {
      const artworksWithImages = artworks.filter(artwork => 
        artwork.mainImage && artwork.mainImage.asset && artwork.mainImage.asset._ref
      )
      
      if (artworksWithImages.length === 0) {
        // No images to load, show cards immediately
        setImagesLoaded(true)
        return
      }

      let loadedCount = 0
      const totalImages = artworksWithImages.length

      const handleImageLoad = () => {
        loadedCount++
        
        if (loadedCount === totalImages) {
          // All images loaded, trigger fade in after a delay to ensure it starts after info card
          setTimeout(() => {
            setImagesLoaded(true)
          }, 1000) // 300ms (info card delay) + 700ms additional delay
        }
      }

      // Preload all images
      artworksWithImages.forEach(artwork => {
        const img = new Image()
        img.onload = handleImageLoad
        img.onerror = handleImageLoad // Count errors as loaded to avoid hanging
        img.src = urlFor(artwork.mainImage!).width(400).url()
      })
    }
  }, [loading, artworks])



  return (
    <main className="min-h-screen bg-white p-4 md:p-8 portfolio-container">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Grid - 2 columns on mobile, 6 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {/* Contact Information - First Grid Position - Fade in after 300ms */}
          <div className={`aspect-[2/3] bg-white flex flex-col justify-start transition-opacity duration-700 ease-in-out ${
            !loading ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transitionDelay: !loading ? '300ms' : '0ms'
          }}>
            <div className="p-2">
              <h1 className="text-xs md:text-sm leading-none">Marco Basta</h1>
              <p className="text-xs md:text-sm leading-none">Artist and Teacher</p>
              <p className="text-xs md:text-sm leading-none">+39 3490867743</p>
              <p className="text-xs md:text-sm leading-none">info@marcobasta.com</p>
            </div>
          </div>

          {/* Artwork Cards - Fade in after images load */}
          {artworks.length > 0 ? (
            artworks.map((artwork) => (
              <div
                key={artwork._id}
                className={`transition-opacity duration-700 ease-in-out ${
                  imagesLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ArtworkCard artwork={artwork} />
              </div>
            ))
          ) : (
            <div className={`col-span-1 md:col-span-5 text-center py-8 transition-opacity duration-700 ease-in-out ${
              imagesLoaded ? 'opacity-100' : 'opacity-0'
            }`}>
              <p>No artwork uploaded yet. Please add some artwork in the Sanity Studio.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
