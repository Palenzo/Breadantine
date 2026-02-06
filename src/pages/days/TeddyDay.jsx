import React, { useState } from 'react'
import DayPage from './DayPage'
import { motion } from 'framer-motion'

const TeddyDay = () => {
  const [hugged, setHugged] = useState(false)
  const [hugCount, setHugCount] = useState(0)

  const handleHug = () => {
    setHugged(true)
    setHugCount(prev => prev + 1)
    setTimeout(() => setHugged(false), 1000)
  }

  return (
    <DayPage title="🧸 Teddy Day" icon="🧸" bgColor="linear-gradient(135deg, #FFF0F5 0%, #E6F3FF 100%)" flowerType="lotus">
      <div className="glass" style={{ padding: '3rem 2rem', marginTop: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#8B4513' }}>
          Doorbell to Cuddles 🧸💕
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: '#666' }}>
          Click the teddy to give it a virtual hug!
        </p>

        <motion.div
          onClick={handleHug}
          style={{
            fontSize: '15rem',
            cursor: 'pointer',
            userSelect: 'none',
            margin: '2rem auto'
          }}
          animate={hugged ? {
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, -10, 0]
          } : {
            scale: [1, 1.05, 1]
          }}
          transition={hugged ? {
            duration: 0.5
          } : {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          whileHover={{ scale: 1.1 }}
        >
          🧸
        </motion.div>

        {hugged && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: '3rem',
              marginTop: '1rem'
            }}
          >
            💕 Hugged! 💕
          </motion.div>
        )}

        <div style={{ marginTop: '2rem', fontSize: '1.3rem', color: '#FF1744', fontWeight: 'bold' }}>
          Hugs Given: {hugCount} 🤗
        </div>

        <div className="glass" style={{ 
          marginTop: '4rem', 
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.5)'
        }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#FF1744' }}>From Doorbell to Cuddles 💖</h3>
          <p style={{ fontSize: '1.2rem', lineHeight: '2', maxWidth: '600px', margin: '0 auto' }}>
            Remember that first time I rang your doorbell? I was so nervous, Ayushi.
            But you welcomed me with that beautiful smile of yours.
            From that awkward hello to these comfortable cuddles,
            every moment has been magical. This teddy represents the warmth and comfort
            you bring into my life. Just like this teddy, I want to be there for you always,
            ready to give you the biggest hugs whenever you need them. 🧸💕
          </p>
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '15px', background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1))' }}>
          <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#FF6F00' }}>💭 Fun Memory</h4>
          <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#555' }}>
            "That day when you hugged the teddy I gave you and smiled - that became my favorite memory.
            Seeing you happy is all I ever want." 🥰
          </p>
        </div>
      </div>
    </DayPage>
  )
}

export default TeddyDay
