import React, { useState } from 'react'
import DayPage from './DayPage'
import { motion } from 'framer-motion'

const PromiseDay = () => {
  const [flippedCards, setFlippedCards] = useState([])

  const promises = [
    { id: 1, icon: '�➡️❤️', front: 'Promise #1', back: 'I will never leave you - Through thick and thin, always together' },
    { id: 2, icon: '♾️', front: 'Promise #2', back: 'I will always love you - From this day to my last day' },
    { id: 3, icon: '😊', front: 'Promise #3', back: 'I will always make you happy - Your smile is my mission' },
    { id: 4, icon: '💪', front: 'Promise #4', back: 'I will make 6 packs - Getting fit for us (no pressure though 😂)' },
    { id: 5, icon: '🪑', front: 'Promise #5', back: 'I will buy you a gaming chair - Your comfort = my priority' },
    { id: 6, icon: '✈️', front: 'Promise #6', back: 'We will go to trips at least 2 this year - Making memories across places' },
    { id: 7, icon: '🍳', front: 'Promise #7', back: 'I will make you eat good food made by me from my hand - Chef Adi at your service' },
    { id: 8, icon: '🤝', front: 'Promise #8', back: 'I will always share everything with you - No secrets, complete transparency' },
    { id: 9, icon: '🛵', front: 'Promise #9', back: 'I will not speed ride scooty - Your safety > my thrill' },
    { id: 10, icon: '😭❌', front: 'Promise #10', back: 'I will not do randi rona - Staying strong for us 💪' }
  ]

  const toggleCard = (id) => {
    setFlippedCards(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <DayPage title="🤞 Promise Day" icon="🤞" bgColor="linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)" flowerType="roses">
      <div className="glass" style={{ padding: '3rem 2rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', color: '#2E7D32' }}>
          Our Commitments, Our Forever 🤝💕
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', textAlign: 'center', color: '#666' }}>
          Click each card to reveal my promises to you, Ayushi
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {promises.map(promise => (
            <motion.div
              key={promise.id}
              onClick={() => toggleCard(promise.id)}
              style={{
                position: 'relative',
                height: '200px',
                cursor: 'pointer',
                perspective: '1000px'
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s'
                }}
                animate={{
                  rotateY: flippedCards.includes(promise.id) ? 180 : 0
                }}
              >
                {/* Front */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                  borderRadius: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  padding: '1rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{promise.icon}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{promise.front}</div>
                  <div style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.8 }}>Click to reveal</div>
                </div>

                {/* Back */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #FF1744, #FF4081)',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  padding: '1.5rem',
                  transform: 'rotateY(180deg)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}>
                  <p style={{ fontSize: '1.1rem', textAlign: 'center', lineHeight: '1.6' }}>
                    {promise.back}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {flippedCards.length === promises.length && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '4rem',
              padding: '3rem 2rem',
              background: 'linear-gradient(135deg, rgba(255, 23, 68, 0.1), rgba(255, 64, 129, 0.1))',
              borderRadius: '20px',
              textAlign: 'center',
              border: '3px solid #FF1744'
            }}
          >
            <h3 style={{ fontSize: '2.5rem', color: '#FF1744', marginBottom: '1rem' }}>
              🎉 You've Revealed All My Promises! 🎉
            </h3>
            <p style={{ fontSize: '1.3rem', lineHeight: '2', maxWidth: '700px', margin: '0 auto' }}>
              These aren't just words, Ayushi. They're commitments from my heart.
              Every single promise I make to you, I intend to keep.
              You deserve nothing less than everything. 💖
            </p>
          </motion.div>
        )}
      </div>
    </DayPage>
  )
}

export default PromiseDay
