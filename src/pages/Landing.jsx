import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Heart, Sparkles, Music, VolumeX } from 'lucide-react'
import ThreeBackground from '../components/ThreeBackground'
import { getRandomLoveQuote } from '../utils/unlockSystem'
import './Landing.css'

const Landing = () => {
  const navigate = useNavigate()
  const [noAttempts, setNoAttempts] = useState(0)
  const [noButtonVisible, setNoButtonVisible] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [loveQuote, setLoveQuote] = useState('')
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    setLoveQuote(getRandomLoveQuote())
  }, [])

  const handleYes = () => {
    setShowConfetti(true)
    createHeartExplosion()
    
    // Add confetti celebration
    createConfetti()
    
    // Play success sound (optional)
    playSuccessSound()
    
    setTimeout(() => {
      navigate('/password')
    }, 1500)
  }

  const handleNoHover = () => {
    setNoAttempts(prev => prev + 1)
    
    if (noAttempts >= 8) {
      // After 8 attempts, fade it out completely
      setNoButtonVisible(false)
      createSadParticles()
      return
    }

    // Move button to random position
    const button = document.querySelector('.btn-no')
    if (button) {
      const maxX = window.innerWidth - 200
      const maxY = window.innerHeight - 120
      const randomX = Math.max(20, Math.random() * maxX)
      const randomY = Math.max(100, Math.random() * maxY)
      
      button.style.position = 'fixed'
      button.style.left = `${randomX}px`
      button.style.top = `${randomY}px`
      button.style.transition = 'all 0.3s ease'
    }
  }

  const handleNoClick = (e) => {
    e.preventDefault()
    // Don't allow clicking, just trigger hover
    handleNoHover()
  }

  const createHeartExplosion = () => {
    const container = document.querySelector('.landing-page')
    for (let i = 0; i < 50; i++) {
      const heart = document.createElement('div')
      heart.className = 'floating-heart-explosion'
      heart.textContent = ['❤️', '💖', '💕', '💗', '💝'][Math.floor(Math.random() * 5)]
      heart.style.left = `${50 + (Math.random() - 0.5) * 40}%`
      heart.style.top = `${50 + (Math.random() - 0.5) * 40}%`
      heart.style.animationDelay = `${Math.random() * 0.3}s`
      heart.style.fontSize = `${Math.random() * 30 + 20}px`
      container?.appendChild(heart)
      
      setTimeout(() => heart.remove(), 2000)
    }
  }

  const createConfetti = () => {
    const container = document.querySelector('.landing-page')
    const colors = ['#FF1744', '#FF4081', '#F50057', '#FFD700', '#FF94C2']
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.left = `${Math.random() * 100}%`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = `${Math.random() * 0.5}s`
      confetti.style.animationDuration = `${Math.random() * 2 + 1}s`
      container?.appendChild(confetti)
      
      setTimeout(() => confetti.remove(), 3000)
    }
  }

  const createSadParticles = () => {
    const container = document.querySelector('.landing-page')
    for (let i = 0; i < 10; i++) {
      const sad = document.createElement('div')
      sad.className = 'sad-particle'
      sad.textContent = '😢'
      sad.style.left = `${Math.random() * 100}%`
      sad.style.top = `${Math.random() * 100}%`
      container?.appendChild(sad)
      
      setTimeout(() => sad.remove(), 2000)
    }
  }

  const playSuccessSound = () => {
    // Optional: Add sound effect
    try {
      const audio = new Audio('/sounds/success.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch (e) {}
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsMusicPlaying(!isMusicPlaying)
    }
  }

  return (
    <div className="landing-page">
      <ThreeBackground type="hearts" intensity="high" />
      
      {showConfetti && <div className="confetti-overlay" />}
      
      <motion.div 
        className="landing-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="hearts-decoration"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          💕
        </motion.div>

        <motion.h1 
          className="main-question"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
        >
          Will You Be My<br />
          <span className="gradient-text">Valentine?</span>
        </motion.h1>

        <motion.p 
          className="sub-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Ayushi, my queen, my everything... ✨
        </motion.p>

        <motion.div 
          className="love-quote"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {loveQuote}
        </motion.div>

        <motion.div 
          className="buttons-container"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.button
            className="btn-yes"
            onClick={handleYes}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={32} fill="#fff" />
            <span>Yes! 💖</span>
          </motion.button>

          <AnimatePresence>
            {noButtonVisible && (
              <motion.button
                className="btn-no"
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                onClick={handleNoClick}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileTap={{ scale: 0.9 }}
              >
                <span>No 😢</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {noAttempts > 3 && noButtonVisible && (
          <motion.p
            className="hint-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            The "No" button is shy... just like I was before asking you out! 😊
          </motion.p>
        )}

        {!noButtonVisible && (
          <motion.p
            className="no-disappeared-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Guess "No" wasn't an option after all! 😘✨
          </motion.p>
        )}

        <motion.div
          className="sparkles-decoration"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <Sparkles size={40} />
        </motion.div>
      </motion.div>

      {/* Optional background music */}
      <audio ref={audioRef} loop>
        <source src="/sounds/romantic-background.mp3" type="audio/mpeg" />
      </audio>

      <button className="music-toggle" onClick={toggleMusic}>
        {isMusicPlaying ? <Music size={24} /> : <VolumeX size={24} />}
      </button>
    </div>
  )
}

export default Landing
