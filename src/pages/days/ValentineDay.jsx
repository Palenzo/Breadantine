import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Camera, Sparkles, Music, Star, Gift } from 'lucide-react'
import ThreeBackground from '../../components/ThreeBackground'
import './ValentineDay.css'

// Cloudinary photo URLs - All 12 photos of Adi & Ayushi
const PHOTOS = [
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379832/valentine-ayushi/photos/photo-1.jpg',
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379835/valentine-ayushi/photos/photo-2.jpg',
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379839/valentine-ayushi/photos/photo-3.jpg',
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379843/valentine-ayushi/photos/photo-4.jpg',
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379845/valentine-ayushi/photos/photo-5.jpg',
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379848/valentine-ayushi/photos/photo-6.jpg',
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379853/valentine-ayushi/photos/photo-7.jpg',
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379904/valentine-ayushi/photos/photo-8.jpg',
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379909/valentine-ayushi/photos/photo-9.jpg',
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379911/valentine-ayushi/photos/photo-10.jpg',
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379915/valentine-ayushi/photos/photo-11.jpg',
  'https://res.cloudinary.com/dxfyyhhus/image/upload/v1770379919/valentine-ayushi/photos/photo-12.jpg'
]

const MEMORY_CARDS = [
  {
    icon: Camera,
    title: 'Our First Photo',
    description: 'The moment I knew you were special',
    color: '#FF1744',
    photoIndex: 0
  },
  {
    icon: Sparkles,
    title: 'Your Smile',
    description: 'The most beautiful sight in my world',
    color: '#FF4081',
    photoIndex: 1
  },
  {
    icon: Heart,
    title: 'Together',
    description: 'Every moment with you is a treasure',
    color: '#E91E63',
    photoIndex: 2
  },
  {
    icon: Gift,
    title: 'First Gift',
    description: 'Your reaction made my heart flutter',
    color: '#F50057',
    photoIndex: 3
  },
  {
    icon: Star,
    title: 'Celebrations',
    description: 'Making every day special with you',
    color: '#FFD700',
    photoIndex: 4
  },
  {
    icon: Sparkles,
    title: 'Stargazing',
    description: 'Finding infinity in your eyes',
    color: '#9C27B0',
    photoIndex: 5
  },
  {
    icon: Heart,
    title: 'Love Letters',
    description: 'Words from my heart to yours',
    color: '#E91E63',
    photoIndex: 6
  },
  {
    icon: Music,
    title: 'Our Song',
    description: 'The melody of our love story',
    color: '#FF4081',
    photoIndex: 7
  },
  {
    icon: Camera,
    title: 'Adventure',
    description: 'Creating memories together',
    color: '#00BCD4',
    photoIndex: 8
  },
  {
    icon: Heart,
    title: 'Late Nights',
    description: 'Talking until sunrise',
    color: '#9C27B0',
    photoIndex: 9
  },
  {
    icon: Star,
    title: 'Dreams',
    description: 'Building our future together',
    color: '#FFD700',
    photoIndex: 10
  },
  {
    icon: Heart,
    title: 'Forever',
    description: 'My promise to you',
    color: '#FF1744',
    photoIndex: 11
  }
]

const ValentineDay = () => {
  const navigate = useNavigate()
  const [selectedCard, setSelectedCard] = useState(null)
  const [showRickroll, setShowRickroll] = useState(false)
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false)
  const [confettiActive, setConfettiActive] = useState(false)

  useEffect(() => {
    // After 2 seconds, show rickroll popup
    const rickrollTimer = setTimeout(() => {
      setShowRickroll(true)
    }, 2000)

    return () => clearTimeout(rickrollTimer)
  }, [])

  const handleBack = () => {
    navigate('/dashboard')
  }

  const handleCardClick = (card) => {
    setSelectedCard(card)
  }

  const closeModal = () => {
    setSelectedCard(null)
  }

  const handleRickrollClose = () => {
    setShowRickroll(false)
    // Show WhatsApp popup after closing rickroll
    setTimeout(() => {
      setShowWhatsAppPopup(true)
      setConfettiActive(true)
    }, 500)
  }

  const handleWhatsAppSend = () => {
    const message = "I love you Ayushi! Happy Valentine's Day! ❤️"
    const phoneNumber = '' // Add Ayushi's phone number here
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="valentine-day-page">
      <ThreeBackground type="romanticBackground" intensity="high" />
      
      {confettiActive && <div className="confetti-shower" />}

      {/* Header */}
      <motion.header 
        className="valentine-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          className="back-button"
          onClick={handleBack}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={24} />
        </motion.button>
        
        <div className="header-content">
          <motion.h1 
            className="valentine-title"
            animate={{
              scale: [1, 1.05, 1],
              color: ['#FF1744', '#FF4081', '#FF1744']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            Our Beautiful Memories 📸
          </motion.h1>
          <p className="valentine-subtitle">
            Celebrating our love on Valentine's Day ❤️
          </p>
        </div>
      </motion.header>

      {/* Memory Cards Grid */}
      <div className="memories-container">
        <div className="memories-grid">
          {MEMORY_CARDS.map((card, index) => {
            const IconComponent = card.icon
            return (
              <motion.div
                key={index}
                className="memory-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: `0 20px 40px ${card.color}40`
                }}
                onClick={() => handleCardClick(card)}
                style={{ borderColor: card.color }}
              >
                <motion.div 
                  className="card-icon-wrapper"
                  style={{ background: `${card.color}22` }}
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                >
                  <IconComponent size={48} style={{ color: card.color }} />
                </motion.div>
                
                <h3 className="card-title" style={{ color: card.color }}>
                  {card.title}
                </h3>
                <p className="card-description">{card.description}</p>
                
                <motion.div 
                  className="card-hover-hint"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  Click to view photo
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="photo-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="photo-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal}>×</button>
              
              <div className="modal-content">
                <motion.img
                  src={PHOTOS[selectedCard.photoIndex]}
                  alt={selectedCard.title}
                  className="modal-photo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
                
                <div className="modal-info">
                  <div className="modal-icon-wrapper" style={{ background: `${selectedCard.color}22` }}>
                    <selectedCard.icon size={32} style={{ color: selectedCard.color }} />
                  </div>
                  <h2 style={{ color: selectedCard.color }}>{selectedCard.title}</h2>
                  <p>{selectedCard.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rickroll Popup */}
      <AnimatePresence>
        {showRickroll && (
          <motion.div
            className="rickroll-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="rickroll-modal"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <h2>🎵 Never Gonna Give You Up! 🎵</h2>
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Rick Astley - Never Gonna Give You Up"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <p>😂 Gotcha! But seriously, I'll never give you up! ❤️</p>
              <motion.button
                className="rickroll-close-btn"
                onClick={handleRickrollClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Close (I love this song! 😆)
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Popup */}
      <AnimatePresence>
        {showWhatsAppPopup && (
          <motion.div
            className="whatsapp-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="whatsapp-modal"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="whatsapp-icon">💚</div>
              <h2>Send Your Love! 💕</h2>
              <p>
                Why not send Ayushi a sweet Valentine's message right now?
              </p>
              <div className="whatsapp-buttons">
                <motion.button
                  className="whatsapp-send-btn"
                  onClick={handleWhatsAppSend}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💚 Send WhatsApp Message
                </motion.button>
                <motion.button
                  className="whatsapp-close-btn"
                  onClick={() => setShowWhatsAppPopup(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Maybe Later
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Message */}
      <motion.div 
        className="final-message"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <h2>Happy Valentine's Day, My Love! 💕</h2>
        <p>
          Every day with you is Valentine's Day, but today is extra special.
          Thank you for being my everything. I love you to the moon and back! 🌙✨
        </p>
        <p className="signature">— Your Adi ❤️</p>
      </motion.div>
    </div>
  )
}

export default ValentineDay
