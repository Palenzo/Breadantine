import React, { useState, useEffect } from 'react'
import DayPage from './DayPage'
import { motion, AnimatePresence } from 'framer-motion'

const HugDay = () => {
  const [hugs, setHugs] = useState(0)
  const [isHugging, setIsHugging] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [totalHugs, setTotalHugs] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('hug_day_total')
    if (saved) setTotalHugs(parseInt(saved))
  }, [])

  const sendHug = () => {
    setIsHugging(true)
    setShowHearts(true)
    const newHugs = hugs + 1
    const newTotal = totalHugs + 1
    setHugs(newHugs)
    setTotalHugs(newTotal)
    localStorage.setItem('hug_day_total', newTotal.toString())

    setTimeout(() => {
      setIsHugging(false)
      setShowHearts(false)
    }, 2000)
  }

  return (
    <DayPage title="🤗 Hug Day" icon="🤗" bgColor="linear-gradient(135deg, #FFF0F5 0%, #FFE4E8 100%)" flowerType="cherry">
      <div className="glass" style={{ padding: '3rem 2rem', marginTop: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#F57C00' }}>
          Every Distance Needs Warmth 🤗💕
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: '#666' }}>
          Even when we're apart, virtual hugs keep us close
        </p>

        <div style={{ position: 'relative', margin: '3rem auto', maxWidth: '500px' }}>
          <motion.button
            onClick={sendHug}
            className="btn"
            style={{
              fontSize: '8rem',
              padding: '2rem 3rem',
              background: isHugging ? 'linear-gradient(135deg, #FF1744, #FF4081)' : 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isHugging ? {
              scale: [1, 1.2, 1],
              rotate: [0, -20, 20, -20, 0]
            } : {}}
          >
            🤗
          </motion.button>

          <AnimatePresence>
            {showHearts && (
              <div>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 1,
                      x: 0,
                      y: 0,
                      scale: 0
                    }}
                    animate={{ 
                      opacity: 0,
                      x: (Math.random() - 0.5) * 300,
                      y: -Math.random() * 200,
                      scale: 1
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.05
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      fontSize: '2rem',
                      pointerEvents: 'none'
                    }}
                  >
                    💕
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <div className="glass" style={{ 
            padding: '2rem',
            display: 'inline-block',
            minWidth: '300px',
            background: 'rgba(255, 255, 255, 0.8)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#F57C00' }}>
              Hugs Sent Today
            </div>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#FF1744' }}>
              {hugs} 🤗
            </div>
            <div style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
              Total Hugs Ever: {totalHugs}
            </div>
          </div>
        </div>

        <motion.div
          className="glass"
          style={{
            marginTop: '4rem',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.5)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#FF1744' }}>Distance Can't Diminish Our Love 💖</h3>
          <p style={{ fontSize: '1.2rem', lineHeight: '2', maxWidth: '600px', margin: '0 auto' }}>
            Ayushi, even when we're miles apart, I want you to feel my warmth.
            Every hug I send is filled with all the love in my heart.
            No distance is too great when it comes to showing you how much you mean to me.
            These virtual hugs are just a preview of all the real ones waiting for you. 🤗💕
          </p>
        </motion.div>

        <div style={{ marginTop: '2rem', fontSize: '1.1rem', color: '#666', fontStyle: 'italic' }}>
          💡 Click the hug button to send virtual warmth to Ayushi!
        </div>
      </div>
    </DayPage>
  )
}

export default HugDay
