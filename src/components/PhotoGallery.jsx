import { useEffect, useState } from 'react'
import { getHugDayPhotos, getBackgroundMusic } from '../../services/mediaService'
import './PhotoGallery.css'

/**
 * Photo Gallery Component for Hug Day
 * Fetches and displays photos from MongoDB
 */
function PhotoGallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    try {
      setLoading(true)
      const photoData = await getHugDayPhotos()
      
      if (photoData.length === 0) {
        setError('No photos found. Make sure to run "npm run upload-assets" first!')
      } else {
        setPhotos(photoData)
      }
    } catch (err) {
      console.error('Error loading photos:', err)
      setError('Failed to load photos. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
  }

  const navigatePhoto = (direction) => {
    const currentIndex = photos.findIndex(p => p._id === selectedPhoto._id)
    let newIndex = currentIndex + direction
    
    if (newIndex < 0) newIndex = photos.length - 1
    if (newIndex >= photos.length) newIndex = 0
    
    setSelectedPhoto(photos[newIndex])
  }

  if (loading) {
    return (
      <div className="photo-gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading our beautiful memories... 💖</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="photo-gallery-error">
        <p>❌ {error}</p>
        <button onClick={loadPhotos}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="photo-gallery-container">
      <div className="gallery-header">
        <h2>Our Beautiful Moments</h2>
        <p>Every hug tells a story, every photo holds a memory 💑</p>
        <div className="photo-count">
          {photos.length} precious memories
        </div>
      </div>

      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <div 
            key={photo._id} 
            className="photo-card"
            onClick={() => openPhotoModal(photo)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="photo-wrapper">
              <img 
                src={photo.fullUrl} 
                alt={photo.description || 'Memory with Ayushi'}
                loading="lazy"
              />
              <div className="photo-overlay">
                <span className="photo-icon">🔍</span>
              </div>
            </div>
            
            {photo.description && (
              <div className="photo-caption">
                <p>{photo.description}</p>
              </div>
            )}
            
            <div className="photo-date">
              {new Date(photo.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="photo-modal" onClick={closePhotoModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closePhotoModal}>
              ✕
            </button>
            
            <button 
              className="modal-nav modal-nav-left" 
              onClick={() => navigatePhoto(-1)}
            >
              ‹
            </button>
            
            <div className="modal-image-wrapper">
              <img 
                src={selectedPhoto.fullUrl} 
                alt={selectedPhoto.description || 'Memory'}
              />
            </div>
            
            <button 
              className="modal-nav modal-nav-right" 
              onClick={() => navigatePhoto(1)}
            >
              ›
            </button>
            
            {selectedPhoto.description && (
              <div className="modal-description">
                <p>{selectedPhoto.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotoGallery
