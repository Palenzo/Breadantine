import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Heart, Lock, Unlock, TrendingUp, Award, Clock } from 'lucide-react'
import ThreeBackground from '../components/ThreeBackground'
import Modal from '../components/Modal'
import BackgroundMusic from '../components/BackgroundMusic'
import { 
  VALENTINE_DAYS, 
  isDayUnlocked, 
  getProgress, 
  getDaysUntilUnlock,
  getNextDayToUnlock,
  markDayVisited,
  wasDayVisited,
  getAchievements,
  incrementHeartClicks,
  checkHeartEasterEgg,
  getRelationshipDuration
} from '../utils/unlockSystem'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [heartClicks, setHeartClicks] = useState(0)
  const [achievements, setAchievements] = useState([])
  const [relationshipDuration, setRelationshipDuration] = useState(null)

  useEffect(() => {
    // Check if password was entered
    const passwordCorrect = localStorage.getItem('valentine_password_correct')
    if (!passwordCorrect) {
      navigate('/password')
      return
    }

    // Show welcome modal once
    const welcomeSeen = localStorage.getItem('valentine_welcome_seen')
    if (!welcomeSeen) {
      setTimeout(() => {
        setWelcomeOpen(true)
        localStorage.setItem('valentine_welcome_seen', 'true')
      }, 500)
    }

    // Load achievements
    setAchievements(getAchievements())
    
    // Get relationship duration
    setRelationshipDuration(getRelationshipDuration())
  }, [navigate])

  const handleDayClick = (day) => {
    if (isDayUnlocked(day.date)) {
      markDayVisited(day.id)
      navigate(day.path)
    }
  }

  const handleHeartClick = () => {
    const clicks = incrementHeartClicks()
    setHeartClicks(clicks)
    
    if (checkHeartEasterEgg()) {
      // Unlock Memory Lane
      alert('🎉 Memory Lane Unlocked! Check the sidebar!')
    }
  }

  const handleCloseWelcome = () => {
    setWelcomeOpen(false)
  }

  const progress = getProgress()
  const nextDay = getNextDayToUnlock()

  return (
    <div className="dashboard-page">
      <ThreeBackground type="galaxy" intensity="medium" />
      <BackgroundMusic />
      
      <div className="dashboard-container">
        {/* Header */}
        <motion.header 
          className="dashboard-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <motion.div
            className="header-hearts"
            onClick={handleHeartClick}
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.9 }}
          >
            ❤️
          </motion.div>
          
          <div className="header-content">
            <h1 className="dashboard-title">
              Adi's Valentine Journey to Ayushi's Heart
            </h1>
            <p className="dashboard-subtitle">
              8 Days of Love • February 7-14, 2026
            </p>
          </div>

          <motion.button
            className="achievements-btn"
            onClick={() => setShowAchievements(!showAchievements)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Award size={24} />
            <span>{achievements.length}</span>
          </motion.button>
        </motion.header>

        {/* Progress Section */}
        <motion.div 
          className="progress-section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="progress-header">
            <span className="progress-label">
              <TrendingUp size={18} />
              Journey Progress
            </span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          
          <div className="progress-bar-container">
            <motion.div 
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
            >
              <div className="progress-shimmer"></div>
            </motion.div>
          </div>

          {nextDay && (
            <div className="next-unlock-info">
              <Clock size={16} />
              <span>
                Next unlock: {nextDay.name} in {getDaysUntilUnlock(nextDay.date)} {getDaysUntilUnlock(nextDay.date) === 1 ? 'day' : 'days'}
              </span>
            </div>
          )}
        </motion.div>

        {/* Relationship Stats */}
        {relationshipDuration && (
          <motion.div
            className="relationship-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="stat-card">
              <span className="stat-value">{relationshipDuration.days}</span>
              <span className="stat-label">Days Together</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{relationshipDuration.months}</span>
              <span className="stat-label">Months of Love</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">∞</span>
              <span className="stat-label">Forever</span>
            </div>
          </motion.div>
        )}

        {/* Days Grid */}
        <div className="days-grid">
          {VALENTINE_DAYS.map((day, index) => {
            const unlocked = isDayUnlocked(day.date)
            const visited = wasDayVisited(day.id)
            const daysUntil = getDaysUntilUnlock(day.date)

            return (
              <motion.div
                key={day.id}
                className={`day-card ${unlocked ? 'unlocked' : 'locked'} ${visited ? 'visited' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                whileHover={unlocked ? { 
                  scale: 1.05, 
                  boxShadow: `0 20px 40px ${day.color}40`
                } : {}}
                onClick={() => handleDayClick(day)}
                style={{ 
                  borderColor: unlocked ? day.color : '#ccc',
                  cursor: unlocked ? 'pointer' : 'not-allowed'
                }}
              >
                {/* Lock/Unlock Icon */}
                <div className="card-status-icon">
                  {unlocked ? (
                    <Unlock size={20} style={{ color: day.color }} />
                  ) : (
                    <Lock size={20} style={{ color: '#999' }} />
                  )}
                </div>

                {/* Visited Badge */}
                {visited && (
                  <motion.div
                    className="visited-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    ✓
                  </motion.div>
                )}

                {/* Day Icon */}
                <motion.div 
                  className="day-icon"
                  animate={unlocked ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: unlocked ? Infinity : 0,
                    repeatDelay: 1
                  }}
                >
                  <span style={{ fontSize: '3rem', filter: unlocked ? 'none' : 'grayscale(100%)' }}>
                    {day.icon}
                  </span>
                </motion.div>

                {/* Day Info */}
                <div className="day-info">
                  <div className="day-date">
                    {day.date < 10 ? `0${day.date}` : day.date} Feb
                  </div>
                  <h3 className="day-name" style={{ color: unlocked ? day.color : '#666' }}>
                    {day.name}
                  </h3>
                  <p className="day-description">
                    {day.description}
                  </p>
                </div>

                {/* Locked Overlay */}
                {!unlocked && (
                  <div className="locked-overlay">
                    <Lock size={32} />
                    <p>Unlocks in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}</p>
                  </div>
                )}

                {/* Hover Hint */}
                {unlocked && !visited && (
                  <div className="hover-hint">
                    Click to explore →
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Achievements Panel */}
        <AnimatePresence>
          {showAchievements && (
            <motion.div
              className="achievements-panel"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="achievements-header">
                <h3>Achievements</h3>
                <button onClick={() => setShowAchievements(false)}>×</button>
              </div>
              <div className="achievements-list">
                {achievements.length > 0 ? (
                  achievements.map((achievement, idx) => (
                    <motion.div
                      key={achievement.id}
                      className="achievement-item"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <span className="achievement-icon">{achievement.icon}</span>
                      <span className="achievement-name">{achievement.name}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="no-achievements">Start exploring to unlock achievements!</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Welcome Modal */}
      <Modal isOpen={welcomeOpen} onClose={handleCloseWelcome}>
        <div className="welcome-modal-content">
          <motion.div
            className="welcome-hearts"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            💖
          </motion.div>
          
          <h2>Hey Ayushi 💖</h2>
          <p>
            Welcome to Adi's Valentine gift!
          </p>
          <p>
            This is a very special gift I have prepared for you. There are multiple sections 
            that will open on the date of the day - for example, Rose Day section will unlock 
            on Rose Day.
          </p>
          <p>
            There may be games and loving stories. You can enjoy them to your fullest.
          </p>
          <p className="welcome-signature">
            With all my love,<br />
            <strong>Your Adi ❤️</strong>
          </p>
          
          <motion.button
            className="welcome-close-btn"
            onClick={handleCloseWelcome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Begin! ✨
          </motion.button>
        </div>
      </Modal>
    </div>
  )
}

export default Dashboard
