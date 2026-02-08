import React, { useState, useEffect, useRef } from 'react'
import DayPage from './DayPage'
import { motion, AnimatePresence } from 'framer-motion'
import { unlockNextDay } from '../../utils/unlockSystem'

const ChocolateDay = () => {
  const [activeStory, setActiveStory] = useState(null)
  const [collectedChocolates, setCollectedChocolates] = useState([])
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [chocolateCount, setChocolateCount] = useState(0)
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)
  
  // Game states
  const [gameActive, setGameActive] = useState(false)
  const [gameScore, setGameScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [playerPosition, setPlayerPosition] = useState(50)
  const [fallingChocolates, setFallingChocolates] = useState([])
  const [gameTimeLeft, setGameTimeLeft] = useState(30)
  const [missedChocolates, setMissedChocolates] = useState(0)
  const gameLoopRef = useRef(null)
  const gameTimerRef = useRef(null)
  const gameAreaRef = useRef(null)

  const stories = [
    {
      id: 1,
      title: "The Corona Chronicles",
      icon: "🏠",
      color: "#FF6B9D",
      story: "During lockdown, I couldn't stay away. I rode all the way to your house just to see you, even from a distance. Left a chocolate at your gate like a secret admirer. You had to throw your slipper to bring it back! 😄 Social distancing couldn't keep my love away.",
      image: "🚪👟🍫",
      chocolate: "🍫"
    },
    {
      id: 2,
      title: "The Keventers Upgrade",
      icon: "🥤",
      color: "#C77DFF",
      story: "Remember when your chocolate dreams were just Dairy Milk? Then came Keventers. I loved seeing your face light up as your choices evolved - Lotus Biscoff, honey ice cream shakes... Making your taste premium became my favorite mission.",
      image: "🍫➡️🍪🍯🥤",
      chocolate: "🍫"
    },
    {
      id: 3,
      title: "The Choki Choki Delivery",
      icon: "📦",
      color: "#FF9F1C",
      story: "That time I delivered Choki Choki to your house and your family thought you were in love with the JioMart delivery guy! 😂 Little did they know it was me behind those surprise chocolate deliveries. Worth every confused look!",
      image: "📦💕❓",
      chocolate: "🍫"
    },
    {
      id: 4,
      title: "The Surprise Visits",
      icon: "🚶",
      color: "#06FFA5",
      story: "Random visits to Aakash, Momo Magic Cafe... anywhere you were, I'd show up with chocolates. Couldn't let a day pass without making sure you had something sweet, because nothing was sweeter than seeing your smile when you saw me.",
      image: "🏃💨🍫😊",
      chocolate: "🍫"
    },
    {
      id: 5,
      title: "The Belgian Waffle Blast",
      icon: "🧇",
      color: "#FFD93D",
      story: "Idk how many times Zomato and Swiggy se aapke liye itne saare waffles and cold coffees order kiye, ekdm meethi ho gyi ho tum! But seeing you enjoy those sweet treats made it all worth it. You turned every delivery into a mini celebration of our love.",
      image: "🧇🍫🥤🎉",
      chocolate: "🍫"
    }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('chocolate_day_collected')
    if (saved) {
      const parsed = JSON.parse(saved)
      setCollectedChocolates(parsed)
      setChocolateCount(parsed.length)
      if (parsed.length >= stories.length) {
        setShowCompletionMessage(true)
      }
    }
    
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('chocolate_catch_high_score')
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }
  }, [])

  // Game loop for falling chocolates
  useEffect(() => {
    if (!gameActive) return
    
    gameLoopRef.current = setInterval(() => {
      // Spawn new chocolate
      if (Math.random() < 0.25) {
        const newChocolate = {
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5,
          y: 0,
          speed: Math.random() * 0.8 + 0.8,
          type: Math.random() < 0.1 ? 'golden' : 'normal'
        }
        setFallingChocolates(prev => [...prev, newChocolate])
      }
      
      // Move chocolates down and check for misses
      setFallingChocolates(prev => {
        const updated = prev.map(choc => ({ ...choc, y: choc.y + choc.speed }))
        const missed = updated.filter(choc => choc.y >= 100)
        
        if (missed.length > 0) {
          setMissedChocolates(m => {
            const newMissed = m + missed.length
            if (newMissed >= 10) {
              setTimeout(() => endGame(newMissed), 100)
            }
            return newMissed
          })
        }
        
        return updated.filter(choc => choc.y < 100)
      })
    }, 150)
    
    return () => clearInterval(gameLoopRef.current)
  }, [gameActive])

  // Game timer
  useEffect(() => {
    if (!gameActive) return
    
    gameTimerRef.current = setInterval(() => {
      setGameTimeLeft(prev => {
        if (prev <= 1) {
          endGame(missedChocolates)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(gameTimerRef.current)
  }, [gameActive, missedChocolates])

  // Check collisions
  useEffect(() => {
    if (!gameActive) return
    
    fallingChocolates.forEach(choc => {
      if (choc.y > 85 && choc.y < 95) {
        const chocolateCenter = choc.x + 2.5
        const playerLeft = playerPosition - 5
        const playerRight = playerPosition + 5
        
        if (chocolateCenter >= playerLeft && chocolateCenter <= playerRight) {
          const points = choc.type === 'golden' ? 10 : 1
          setGameScore(prev => prev + points)
          setFallingChocolates(prev => prev.filter(c => c.id !== choc.id))
        }
      }
    })
  }, [fallingChocolates, playerPosition, gameActive])

  // Mouse/Touch controls
  useEffect(() => {
    if (!gameActive) return
    
    const handleMove = (clientX) => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect()
        const x = ((clientX - rect.left) / rect.width) * 100
        setPlayerPosition(Math.max(10, Math.min(90, x)))
      }
    }
    
    const handleMouseMove = (e) => handleMove(e.clientX)
    const handleTouchMove = (e) => {
      e.preventDefault()
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX)
      }
    }
    
    const gameArea = gameAreaRef.current
    if (gameArea) {
      gameArea.addEventListener('mousemove', handleMouseMove)
      gameArea.addEventListener('touchmove', handleTouchMove, { passive: false })
      
      return () => {
        gameArea.removeEventListener('mousemove', handleMouseMove)
        gameArea.removeEventListener('touchmove', handleTouchMove)
      }
    }
  }, [gameActive])

  const startGame = () => {
    setGameActive(true)
    setGameOver(false)
    setGameScore(0)
    setGameTimeLeft(30)
    setPlayerPosition(50)
    setFallingChocolates([])
    setMissedChocolates(0)
  }

  const endGame = (missedCount = missedChocolates) => {
    setGameActive(false)
    setGameOver(true)
    if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    if (gameTimerRef.current) clearInterval(gameTimerRef.current)
    
    // Update high score in localStorage
    if (gameScore > highScore) {
      setHighScore(gameScore)
      localStorage.setItem('chocolate_catch_high_score', gameScore.toString())
    }
  }

  const collectChocolate = (storyId) => {
    if (!collectedChocolates.includes(storyId)) {
      const newCollected = [...collectedChocolates, storyId]
      setCollectedChocolates(newCollected)
      setChocolateCount(newCollected.length)
      localStorage.setItem('chocolate_day_collected', JSON.stringify(newCollected))
      
      if (newCollected.length >= stories.length) {
        setShowCompletionMessage(true)
        try {
          unlockNextDay('chocolate')
        } catch (e) {
          console.log('Unlock error:', e)
        }
      }
    }
    setActiveStory(null)
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent("Blinkit karo na baby do kilo choclate, anal krungi, 69 krungi, kuch bhi krungi bas choclate dedo, tumse pyaar krti hu, choclate se bhi jyada")
    const phoneNumber = "919431271900"
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
    setShowWhatsAppModal(false)
  }

  const progress = (chocolateCount / stories.length) * 100

  return (
    <DayPage 
      title="🍫 Chocolate Day" 
      icon="🍫" 
      bgColor="linear-gradient(135deg, #FFF5E6 0%, #FFE4CC 100%)" 
      flowerType="flowers"
    >
      <div className="glass" style={{ 
        padding: '3rem 2rem', 
        marginTop: '2rem', 
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(139, 69, 19, 0.15)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{ 
            fontSize: '2.8rem', 
            background: 'linear-gradient(135deg, #8B4513, #D2691E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}>
            Our Chocolate Love Story
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#8B4513',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.8'
          }}>
            Every chocolate tells a story of how I kept finding ways to make you smile, 
            even when the world said stay apart. Click each memory to collect your chocolates! 💕
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div style={{ 
          width: '100%', 
          maxWidth: '600px',
          margin: '0 auto 3rem',
          padding: '0 1rem'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '0.5rem',
            color: '#8B4513',
            fontWeight: '600'
          }}>
            <span>Chocolates Collected</span>
            <span>{chocolateCount}/{stories.length}</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '20px', 
            background: 'rgba(139, 69, 19, 0.1)', 
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid rgba(139, 69, 19, 0.2)'
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #8B4513, #D2691E, #CD853F)',
                borderRadius: '10px',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Story Timeline */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => setActiveStory(story)}
              style={{
                background: `linear-gradient(135deg, ${story.color}15, ${story.color}25)`,
                borderRadius: '20px',
                padding: '2rem',
                cursor: 'pointer',
                border: collectedChocolates.includes(story.id) 
                  ? `3px solid ${story.color}` 
                  : '3px solid transparent',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: collectedChocolates.includes(story.id)
                  ? `0 8px 24px ${story.color}40`
                  : '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease'
              }}
            >
              {collectedChocolates.includes(story.id) && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    fontSize: '2rem'
                  }}
                >
                  ✨
                </motion.div>
              )}
              
              <div style={{ 
                fontSize: '4rem', 
                textAlign: 'center',
                marginBottom: '1rem',
                filter: collectedChocolates.includes(story.id) ? 'none' : 'grayscale(50%)'
              }}>
                {story.icon}
              </div>
              
              <h3 style={{ 
                fontSize: '1.5rem',
                color: story.color,
                textAlign: 'center',
                marginBottom: '1rem',
                fontWeight: '700'
              }}>
                {story.title}
              </h3>
              
              <div style={{
                fontSize: '2rem',
                textAlign: 'center',
                marginTop: '1rem',
                opacity: collectedChocolates.includes(story.id) ? 1 : 0.3
              }}>
                {story.image}
              </div>
              
              <div style={{
                textAlign: 'center',
                marginTop: '1rem',
                fontSize: '0.9rem',
                color: '#666',
                fontWeight: '600'
              }}>
                {collectedChocolates.includes(story.id) ? '✓ Collected' : 'Click to read'}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Story Modal */}
        <AnimatePresence>
          {activeStory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveStory(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '3rem',
                  maxWidth: '600px',
                  width: '100%',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  position: 'relative',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{
                  fontSize: '5rem',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  {activeStory.icon}
                </div>
                
                <h3 style={{
                  fontSize: '2rem',
                  color: activeStory.color,
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  fontWeight: '700'
                }}>
                  {activeStory.title}
                </h3>
                
                <p style={{
                  fontSize: '1.2rem',
                  lineHeight: '2',
                  color: '#333',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  {activeStory.story}
                </p>
                
                <div style={{
                  fontSize: '4rem',
                  textAlign: 'center',
                  marginBottom: '2rem'
                }}>
                  {activeStory.image}
                </div>
                
                {!collectedChocolates.includes(activeStory.id) ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => collectChocolate(activeStory.id)}
                    style={{
                      width: '100%',
                      padding: '1.2rem',
                      fontSize: '1.3rem',
                      background: `linear-gradient(135deg, ${activeStory.color}, ${activeStory.color}dd)`,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      boxShadow: `0 4px 15px ${activeStory.color}40`
                    }}
                  >
                    Collect Chocolate 🍫
                  </motion.button>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    color: activeStory.color,
                    fontWeight: '700'
                  }}>
                    ✨ Chocolate Collected! ✨
                  </div>
                )}
                
                <button
                  onClick={() => setActiveStory(null)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(0,0,0,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Message */}
        <AnimatePresence>
          {showCompletionMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                marginTop: '3rem',
                padding: '3rem',
                background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(255, 182, 193, 0.15))',
                borderRadius: '24px',
                border: '3px solid #FF69B4',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(255, 105, 180, 0.3)'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                🎉🍫💕🍫🎉
              </div>
              <h3 style={{ 
                fontSize: '2.5rem', 
                color: '#FF1744', 
                marginBottom: '1.5rem',
                fontWeight: '800'
              }}>
                All Chocolates Collected!
              </h3>
              <p style={{ 
                fontSize: '1.3rem', 
                lineHeight: '2',
                color: '#333',
                maxWidth: '700px',
                margin: '0 auto 2rem'
              }}>
                Ayushi, every chocolate I ever gave you was a piece of my heart. 
                From throwing slippers during lockdown to upgrading your Keventers game, 
                from confusing delivery guys to surprise cafe visits - 
                each moment was about making you smile. 
                You turned my simple gestures into our sweetest memories. 
                You're sweeter than all the chocolates in the world combined. 🍫💖
              </p>
              
              {/* Play Game Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                style={{
                  padding: '1.5rem 3rem',
                  fontSize: '1.5rem',
                  background: 'linear-gradient(135deg, #FF6B9D, #C77DFF)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  boxShadow: '0 8px 24px rgba(255, 107, 157, 0.4)'
                }}
              >
                🎮 Play Chocolate Catch Game!
              </motion.button>
              
              <div style={{ marginTop: '1.5rem', fontSize: '1.2rem', color: '#8B4513', fontWeight: '600' }}>
                High Score: {highScore} 🏆
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blinkit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 999
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowWhatsAppModal(true)}
            style={{
              padding: '1.2rem 2rem',
              fontSize: '1.3rem',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '700',
              boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>💚</span>
            Blinkit Karu?
          </motion.button>
        </motion.div>

        {/* WhatsApp Modal */}
        <AnimatePresence>
          {showWhatsAppModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWhatsAppModal(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001,
                padding: '1rem'
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '3rem',
                  maxWidth: '500px',
                  width: '100%',
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                  🍫📱💕
                </div>
                
                <h3 style={{
                  fontSize: '2rem',
                  color: '#25D366',
                  marginBottom: '1rem',
                  fontWeight: '700'
                }}>
                  Missing Those Sweet Surprises?
                </h3>
                
                <p style={{
                  fontSize: '1.1rem',
                  color: '#666',
                  marginBottom: '2rem',
                  lineHeight: '1.8'
                }}>
                  Send me a message and let's relive those chocolate delivery days! 
                  Just like old times - but faster with Blinkit! 😄
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openWhatsApp}
                  style={{
                    width: '100%',
                    padding: '1.2rem',
                    fontSize: '1.3rem',
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)'
                  }}
                >
                  💚 Open WhatsApp
                </motion.button>
                
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    background: 'transparent',
                    color: '#999',
                    border: '2px solid #ddd',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Maybe Later
                </button>
                
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(0,0,0,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint for incomplete collection */}
        {!showCompletionMessage && chocolateCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: '3rem',
              padding: '1.5rem',
              background: 'rgba(139, 69, 19, 0.05)',
              borderRadius: '16px',
              textAlign: 'center',
              color: '#8B4513',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}
          >
            💡 Click on each story to relive the memory and collect all the chocolates!
          </motion.div>
        )}

        {/* Chocolate Catching Game */}
        <AnimatePresence>
          {gameActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.95)',
                zIndex: 2000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
              }}
            >
              {/* Game Header */}
              <div style={{
                position: 'absolute',
                top: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '2rem',
                fontSize: '1.5rem',
                color: 'white',
                fontWeight: '700',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <div>Score: {gameScore}</div>
                <div>Time: {gameTimeLeft}s</div>
                <div style={{ color: missedChocolates >= 7 ? '#FF6B6B' : 'white' }}>Missed: {missedChocolates}/10</div>
                <div>High: {highScore}</div>
              </div>

              {/* Game Area */}
              <div 
                ref={gameAreaRef}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '800px',
                  height: '500px',
                  background: 'linear-gradient(135deg, #FFF5E6 0%, #FFE4CC 100%)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '5px solid #8B4513',
                  cursor: 'none',
                  touchAction: 'none'
                }}>
                {/* Falling Chocolates */}
                {fallingChocolates.map(choc => (
                  <motion.div
                    key={choc.id}
                    style={{
                      position: 'absolute',
                      left: `${choc.x}%`,
                      top: `${choc.y}%`,
                      fontSize: choc.type === 'golden' ? '3rem' : '2.5rem',
                      pointerEvents: 'none'
                    }}
                  >
                    {choc.type === 'golden' ? '⭐🍫' : '🍫'}
                  </motion.div>
                ))}

                {/* Player Basket */}
                <motion.div
                  animate={{ left: `${playerPosition}%` }}
                  transition={{ duration: 0.1 }}
                  style={{
                    position: 'absolute',
                    bottom: '5%',
                    transform: 'translateX(-50%)',
                    fontSize: '4rem',
                    pointerEvents: 'none'
                  }}
                >
                  🧺
                </motion.div>

                {/* Instructions */}
                <div style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#8B4513',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  width: '90%'
                }}>
                  🖱️ Move cursor/finger to control basket | 🍫 = 1pt | ⭐🍫 = 10pts | Miss 10 = Game Over!
                </div>
              </div>



              {/* Quit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={endGame}
                style={{
                  marginTop: '1rem',
                  padding: '1rem 2rem',
                  fontSize: '1.2rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Quit Game
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Modal */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2001,
                padding: '1rem'
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '3rem',
                  maxWidth: '500px',
                  width: '100%',
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                  {missedChocolates >= 10 ? '💔🍫' : gameScore > highScore ? '🏆🎉' : '🍫💝'}
                </div>
                
                <h3 style={{
                  fontSize: '2.5rem',
                  color: missedChocolates >= 10 ? '#FF6B6B' : gameScore > highScore ? '#FFD700' : '#FF6B9D',
                  marginBottom: '1rem',
                  fontWeight: '800'
                }}>
                  {missedChocolates >= 10 ? 'Too Many Misses!' : gameScore > highScore ? 'NEW HIGH SCORE!' : 'Game Over!'}
                </h3>
                
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: '#8B4513',
                  marginBottom: '1rem'
                }}>
                  {gameScore} Points
                </div>
                
                <div style={{
                  fontSize: '1.2rem',
                  color: '#666',
                  marginBottom: '1rem'
                }}>
                  Previous High Score: {highScore}
                </div>
                
                {missedChocolates >= 10 && (
                  <div style={{
                    fontSize: '1.1rem',
                    color: '#FF6B6B',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    background: 'rgba(255, 107, 107, 0.1)',
                    borderRadius: '8px'
                  }}>
                    You missed {missedChocolates} chocolates! 💔
                  </div>
                )}
                
                <input
                  type="text"
                  placeholder="Enter your name (optional)"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    borderRadius: '12px',
                    border: '2px solid #ddd',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}
                />
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveGameScore}
                  style={{
                    width: '100%',
                    padding: '1.2rem',
                    fontSize: '1.3rem',
                    background: 'linear-gradient(135deg, #FF6B9D, #C77DFF)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    boxShadow: '0 4px 15px rgba(255, 107, 157, 0.4)'
                  }}
                >
                  💾 Save Score
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  style={{
                    width: '100%',
                    padding: '1.2rem',
                    fontSize: '1.3rem',
                    background: 'linear-gradient(135deg, #06FFA5, #00D4AA)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    boxShadow: '0 4px 15px rgba(6, 255, 165, 0.4)'
                  }}
                >
                  🔄 Play Again
                </motion.button>
                
                <button
                  onClick={() => setGameOver(false)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    background: 'transparent',
                    color: '#999',
                    border: '2px solid #ddd',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DayPage>
  )
}

export default ChocolateDay
