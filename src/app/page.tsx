'use client'

import { useState, useEffect } from 'react'
import { sanityClient, urlFor } from '../lib/sanityClient'
import ArtworkCard from './components/ArtworkCard'
import './portfolio.css'

interface Artwork {
  _id: string
  title: string
  slug: {
    current: string
  }
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
  const [loadedImages, setLoadedImages] = useState(0)
  const [zoomedArtwork, setZoomedArtwork] = useState<Artwork | null>(null)
  const [showGreyLayer, setShowGreyLayer] = useState(false)
  const [showColorImage, setShowColorImage] = useState(false)
  const [showFinalModal, setShowFinalModal] = useState(false)

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const query = `*[_type == "artwork"] {
          _id,
          title,
          slug,
          mainImage
        }`
        const data = await sanityClient.fetch(query)
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
        setLoadedImages(loadedCount)
        
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
        img.src = artwork.mainImage ? urlFor(artwork.mainImage).width(400).url() : ''
      })
    }
  }, [loading, artworks])

  const handleZoom = (artwork: Artwork) => {
    setZoomedArtwork(artwork)
    
    // Show grey layer after 600ms with fade in
    setTimeout(() => {
      setShowGreyLayer(true)
    }, 0)
    
    // Show color image after 1200ms
    setTimeout(() => {
      setShowColorImage(true)
    }, 600)
    
    // Show final modal after 1800ms
    setTimeout(() => {
      setShowFinalModal(true)
    }, 1200)
  }

  const handleCloseZoom = () => {
    // Fade out everything together
    setShowFinalModal(false)
    setShowColorImage(false)
    setShowGreyLayer(false)
    setTimeout(() => {
      setZoomedArtwork(null)
    }, 300)
  }

  return (
    <main className="min-h-screen bg-white p-4 md:p-8 portfolio-container">
      <div className="max-w-7xl mx-auto">
        {/* Responsive Grid - 2 columns on mobile, 6 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
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
            artworks.map((artwork, index) => (
              <div
                key={artwork._id}
                className={`transition-opacity duration-700 ease-in-out ${
                  imagesLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ArtworkCard artwork={artwork} onZoom={handleZoom} />
              </div>
            ))
          ) : (
            <div className={`col-span-1 sm:col-span-5 text-center py-8 transition-opacity duration-700 ease-in-out ${
              imagesLoaded ? 'opacity-100' : 'opacity-0'
            }`}>
              <p>No artwork uploaded yet. Please add some artwork in the Sanity Studio.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal at page level */}
      {zoomedArtwork && zoomedArtwork.mainImage && (
        <>
                    {/* Grey background layer with luminosity blend mode - appears immediately */}
          <div 
            className={`fixed inset-0 w-full h-full bg-[#DAD7D7] mix-blend-luminosity z-40 transition-opacity duration-300 ease-in-out ${
              showGreyLayer ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          
          {/* First image with color blend mode - appears after 600ms */}
          <div 
            className={`fixed inset-0 w-full h-full z-41 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
              showColorImage ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <img
              src={urlFor(zoomedArtwork.mainImage).width(1200).url()}
              alt={zoomedArtwork.title}
              className="max-w-[95vw] md:max-w-[70vw] max-h-[90vh] object-contain mx-auto mix-blend-color shadow-none"
              style={{ maxWidth: '95vw', maxHeight: '90vh', objectFit: 'contain', boxShadow: 'none' }}
            />
          </div>
          
          {/* Final modal with click to close - appears after 1200ms */}
          <div 
            className={`fixed inset-0 w-full h-full z-50 flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out ${
              showFinalModal ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleCloseZoom}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <img
              src={urlFor(zoomedArtwork.mainImage).width(1200).url()}
              alt={zoomedArtwork.title}
              className="max-w-[95vw] md:max-w-[70vw] max-h-[90vh] object-contain mx-auto transition-opacity duration-300 ease-in-out shadow-none"
              style={{ maxWidth: '95vw', maxHeight: '90vh', objectFit: 'contain', boxShadow: 'none' }}
            />
          </div>
        </>
      )}
    </main>
  )
}
