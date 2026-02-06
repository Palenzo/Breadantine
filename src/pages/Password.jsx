import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import ThreeBackground from '../components/ThreeBackground'
import './Password.css'

const Password = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState('')
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (password.toLowerCase() === 'samosa') {
      localStorage.setItem('valentine_password_correct', 'true')
      // Success animation
      createSuccessEffect()
      setTimeout(() => {
        navigate('/home')
      }, 1500)
    } else {
      setAttempts(prev => prev + 1)
      setError('Incorrect password. Think about our favorite snack! 🥟')
      setPassword('')
      
      if (attempts >= 2) {
        setShowHint(true)
      }
      
      // Shake animation
      const card = document.querySelector('.password-card')
      card?.classList.add('shake')
      setTimeout(() => card?.classList.remove('shake'), 500)
    }
  }

  const createSuccessEffect = () => {
    const container = document.querySelector('.password-page')
    for (let i = 0; i < 40; i++) {
      const emoji = document.createElement('div')
      emoji.className = 'floating-samosa'
      emoji.textContent = '🥟'
      emoji.style.left = `${Math.random() * 100}%`
      emoji.style.animationDelay = `${Math.random() * 0.5}s`
      container?.appendChild(emoji)
      
      setTimeout(() => emoji.remove(), 3000)
    }
  }

  return (
    <div className="password-page">
      <ThreeBackground type="hearts" intensity="low" />
      
      <motion.div
        className="password-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="password-card"
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <motion.div
            className="lock-icon"
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <Lock size={64} />
          </motion.div>

          <h1>Our Secret Memory 🔐</h1>
          <p className="romantic-text">
            "Remember the snack we shared on our first date?"
          </p>

          <form onSubmit={handleSubmit} className="password-form">
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the password..."
                className="password-input"
                autoFocus
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <motion.p
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            {showHint && (
              <motion.div
                className="hint-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <Sparkles size={20} className="hint-icon" />
                <p>
                  Hint: It's a crispy triangle filled with love... and spices! 🥟
                </p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="submit-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Unlock Our Journey 💖
            </motion.button>
          </form>

          <div className="samosas-floating">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="samosa-emoji"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                🥟
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Password
