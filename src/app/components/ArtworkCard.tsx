'use client'

import { useState, useEffect } from 'react'
import { urlFor } from '../../lib/sanityClient'

interface ArtworkCardProps {
  artwork: {
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
  onZoom?: (artwork: ArtworkCardProps['artwork']) => void
}

export default function ArtworkCard({ artwork, onZoom }: ArtworkCardProps) {
  const [showImage, setShowImage] = useState(false)

  // Randomly select initial state on component mount
  useEffect(() => {
    setShowImage(Math.random() > 0.5)
  }, [])

  const handleMouseEnter = () => {
    setShowImage(prev => !prev)
  }

  const handleCardClick = () => {
    if (artwork.mainImage && artwork.mainImage.asset && artwork.mainImage.asset._ref) {
      onZoom?.(artwork)
    }
  }

  // Check if we have a valid image
  const hasImage = artwork.mainImage && artwork.mainImage.asset && artwork.mainImage.asset._ref

  return (
    <div 
      className="aspect-[2/3] bg-white cursor-pointer transition-all duration-300 relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onClick={handleCardClick}
    >
      {showImage && hasImage ? (
        <div className="w-full h-full relative">
                      <img
              src={artwork.mainImage ? urlFor(artwork.mainImage).width(400).url() : ''}
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
                  <div className="w-full h-full flex items-start pointer-events-none">
          <h3 className="text-xs md:text-sm leading-none">
            {artwork.title}
          </h3>
        </div>
      )}
    </div>
  )
} 