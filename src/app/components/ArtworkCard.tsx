'use client'

import { useState, useEffect } from 'react'
import { urlFor } from '../../sanity/lib/client'

interface ArtworkCardProps {
  artwork: {
    _id: string
    title: string
    slug: { current: string }
    mainImage?: {
      asset: {
        _ref: string
      }
    }
  }
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [showImage, setShowImage] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  // Randomly select initial state on component mount
  useEffect(() => {
    setShowImage(Math.random() > 0.5)
  }, [])

  const handleMouseEnter = () => {
    if (!isZoomed) {
      setShowImage(prev => !prev)
    }
  }

  const handleCardClick = () => {
    if (artwork.mainImage && artwork.mainImage.asset && artwork.mainImage.asset._ref) {
      setIsZoomed(true)
    }
  }

  const handleZoomClick = () => {
    setIsZoomed(false)
  }

  // Check if we have a valid image
  const hasImage = artwork.mainImage && artwork.mainImage.asset && artwork.mainImage.asset._ref

  return (
    <>
      <div 
        className="aspect-[2/3] bg-white cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onClick={handleCardClick}
      >
        {showImage && hasImage ? (
          <div className="w-full h-full relative">
            <img
              src={urlFor(artwork.mainImage).width(400).url()}
              alt={artwork.title}
              className="w-full h-auto max-h-full object-contain object-top pointer-events-none"
            />
          </div>
        ) : showImage && !hasImage ? (
          <div className="w-full h-full bg-white flex items-center justify-center">
            <div className="text-center pointer-events-none">
              <div className="text-4xl mb-2">🖼️</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full p-2 flex items-start pointer-events-none">
            <h3 className="text-xs md:text-sm leading-none">
              {artwork.title}
            </h3>
          </div>
        )}
      </div>

      {/* Fullscreen Modal - Always rendered but controlled by opacity */}
      {/* Duplicate image with color blend mode - positioned behind grey layer */}
      <div 
        className={`fixed inset-0 w-full h-full z-40 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
          isZoomed && hasImage ? 'opacity-100 delay-600' : 'opacity-0 pointer-events-none'
        }`}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <img
          src={urlFor(artwork.mainImage).width(1200).url()}
          alt={artwork.title}
          className="max-w-[95vw] md:max-w-[70vw] max-h-[90vh] object-contain mx-auto mix-blend-color"
          style={{ maxHeight: '90vh', objectFit: 'contain' }}
        />
      </div>
      {/* Grey background layer with luminosity blend mode */}
      <div 
        className={`fixed inset-0 w-full h-full bg-[#DAD7D7] mix-blend-luminosity z-41 transition-opacity duration-300 ease-in-out ${
          isZoomed && hasImage ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <div 
        className={`fixed inset-0 w-full h-full bg-black bg-opacity-90 z-50 flex items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out ${
          isZoomed && hasImage ? 'opacity-100 delay-[1200ms]' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleZoomClick}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <img
          src={urlFor(artwork.mainImage).width(1200).url()}
          alt={artwork.title}
          className={`max-w-[95vw] md:max-w-[70vw] max-h-[90vh] object-contain mx-auto transition-opacity duration-300 ease-in-out ${
            isZoomed && hasImage ? 'opacity-100 delay-[1200ms]' : 'opacity-0'
          }`}
          style={{ maxHeight: '90vh', objectFit: 'contain' }}
        />
      </div>
    </>
  )
} 