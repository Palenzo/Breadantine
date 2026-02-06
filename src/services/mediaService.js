// Media Service - API calls for photos and sounds stored in MongoDB
const API_BASE_URL = 'http://localhost:3000/api'

/**
 * Fetch all media files with optional filters
 * @param {Object} filters - { category: 'photo'|'sound', dayAssociated: 'rose'|'hug'|... }
 * @returns {Promise<Array>} Array of media objects
 */
export const getAllMedia = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    
    if (filters.category) params.append('category', filters.category)
    if (filters.dayAssociated) params.append('dayAssociated', filters.dayAssociated)
    
    const url = `${API_BASE_URL}/media${params.toString() ? `?${params.toString()}` : ''}`
    const response = await fetch(url)
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch media')
    }
    
    return data.media.map(item => ({
      ...item,
      fullUrl: `${API_BASE_URL}${item.url}`
    }))
  } catch (error) {
    console.error('Error fetching media:', error)
    return []
  }
}

/**
 * Fetch all photos
 * @param {string} dayAssociated - Optional: filter by day (e.g., 'hug')
 * @returns {Promise<Array>} Array of photo objects
 */
export const getAllPhotos = async (dayAssociated = null) => {
  const filters = { category: 'photo' }
  if (dayAssociated) filters.dayAssociated = dayAssociated
  return getAllMedia(filters)
}

/**
 * Fetch all sounds
 * @returns {Promise<Array>} Array of sound objects
 */
export const getAllSounds = async () => {
  return getAllMedia({ category: 'sound' })
}

/**
 * Fetch photos for Hug Day gallery
 * @returns {Promise<Array>} Array of photo objects with full URLs
 */
export const getHugDayPhotos = async () => {
  return getAllPhotos('hug')
}

/**
 * Fetch media by ID
 * @param {string} id - Media ID
 * @returns {Promise<Object>} Media object
 */
export const getMediaById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/media/id/${id}`)
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch media')
    }
    
    return {
      ...data.media,
      fullUrl: `${API_BASE_URL}${data.media.url}`
    }
  } catch (error) {
    console.error('Error fetching media by ID:', error)
    return null
  }
}

/**
 * Get media statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getMediaStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/media/stats/overview`)
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch stats')
    }
    
    return data.stats
  } catch (error) {
    console.error('Error fetching media stats:', error)
    return null
  }
}

/**
 * Upload a new media file
 * @param {File} file - File to upload
 * @param {Object} metadata - { dayAssociated, description, uploadedBy }
 * @returns {Promise<Object>} Uploaded file info
 */
export const uploadMedia = async (file, metadata = {}) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    if (metadata.dayAssociated) formData.append('dayAssociated', metadata.dayAssociated)
    if (metadata.description) formData.append('description', metadata.description)
    if (metadata.uploadedBy) formData.append('uploadedBy', metadata.uploadedBy)
    
    const response = await fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to upload file')
    }
    
    return {
      ...data.file,
      fullUrl: `${API_BASE_URL}${data.file.url}`
    }
  } catch (error) {
    console.error('Error uploading media:', error)
    throw error
  }
}

/**
 * Upload multiple files at once
 * @param {FileList|Array<File>} files - Files to upload
 * @param {Object} metadata - { dayAssociated, description, uploadedBy }
 * @returns {Promise<Array>} Array of uploaded file info
 */
export const uploadMultipleMedia = async (files, metadata = {}) => {
  try {
    const formData = new FormData()
    
    Array.from(files).forEach(file => {
      formData.append('files', file)
    })
    
    if (metadata.dayAssociated) formData.append('dayAssociated', metadata.dayAssociated)
    if (metadata.description) formData.append('description', metadata.description)
    if (metadata.uploadedBy) formData.append('uploadedBy', metadata.uploadedBy)
    
    const response = await fetch(`${API_BASE_URL}/media/upload-multiple`, {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to upload files')
    }
    
    return data.files.map(file => ({
      ...file,
      fullUrl: `${API_BASE_URL}${file.url}`
    }))
  } catch (error) {
    console.error('Error uploading multiple files:', error)
    throw error
  }
}

/**
 * Delete media by ID
 * @param {string} id - Media ID to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteMedia = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/media/${id}`, {
      method: 'DELETE'
    })
    
    const data = await response.json()
    return data.success
  } catch (error) {
    console.error('Error deleting media:', error)
    return false
  }
}

/**
 * Preload images for better performance
 * @param {Array<string>} imageUrls - Array of image URLs
 * @returns {Promise<Array>} Promise that resolves when all images are loaded
 */
export const preloadImages = (imageUrls) => {
  return Promise.all(
    imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(url)
        img.onerror = reject
        img.src = url
      })
    })
  )
}

/**
 * Get the first sound file (for background music)
 * @returns {Promise<Object|null>} Sound object or null
 */
export const getBackgroundMusic = async () => {
  try {
    const sounds = await getAllSounds()
    return sounds.length > 0 ? sounds[0] : null
  } catch (error) {
    console.error('Error fetching background music:', error)
    return null
  }
}

export default {
  getAllMedia,
  getAllPhotos,
  getAllSounds,
  getHugDayPhotos,
  getMediaById,
  getMediaStats,
  uploadMedia,
  uploadMultipleMedia,
  deleteMedia,
  preloadImages,
  getBackgroundMusic
}
