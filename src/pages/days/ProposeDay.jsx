import React, { useEffect, useRef } from 'react'
import DayPage from './DayPage'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const ProposeDay = () => {
  const storyRef = useRef(null)

  useEffect(() => {
    const sections = gsap.utils.toArray('.story-section')
    
    sections.forEach((section) => {
      gsap.fromTo(section,
        { 
          opacity: 0, 
          y: 100,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
            scrub: 1
          }
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const storyParts = [
    {
      emoji: '�',
      title: 'The Nervous Morning',
      text: 'It was a day like no other. My heart was racing. The boys were hyping me up: "Bro, she sees something in you. You\'re so lucky to have her in that place."'
    },
    {
      emoji: '🍽️',
      title: 'Lunch Time Courage',
      text: 'Lunch time. She came back from lunch. This was it. No turning back.'
    },
    {
      emoji: '💬',
      title: 'Three Words',
      text: 'I walked up to her, my voice shaking... "I love you." Then I ran back to my seat like my life depended on it 😂'
    },
    {
      emoji: '⏰',
      title: 'The Longest Wait',
      text: 'The whole day felt like eternity. Every minute was an hour. Would she say yes?'
    },
    {
      emoji: '👥',
      title: 'The Friend\'s Message',
      text: 'Her friend came to me the next day: "She accepted you!" But I wasn\'t convinced...'
    },
    {
      emoji: '🧪',
      title: 'Chemistry Lab Confirmation',
      text: 'I had to hear it from her. Chemistry lab. I asked directly. And... HOLA! She said YES! 💚'
    },
    {
      emoji: '🤒',
      title: 'Love Fever',
      text: 'Amigo, I got fever for the whole day from excitement! Best fever ever! 🤒❤️'
    },
    {
      emoji: '✨',
      title: 'And That\'s How It Began',
      text: 'From that nervous proposal to this beautiful journey... every moment has been magical.'
    }
  ]

  return (
    <DayPage title="💍 Propose Day" icon="💍" bgColor="linear-gradient(135deg, #FFF0F5 0%, #FFE4E8 100%)" flowerType="cherry">
      <div ref={storyRef} style={{ padding: '2rem 1rem', minHeight: '200vh' }}>
        <motion.div 
          className="glass" 
          style={{ 
            padding: '3rem 2rem', 
            textAlign: 'center', 
            marginBottom: '4rem',
            position: 'sticky',
            top: '20px',
            zIndex: 1
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#FF1744' }}>
            The Day That Changed Everything 💍
          </h2>
          <p style={{ fontSize: '1.3rem', color: '#666' }}>
            Scroll down to relive the most important day of our love story
          </p>
          <div style={{ marginTop: '1rem', fontSize: '2rem', animation: 'bounce 2s infinite' }}>
            ↓
          </div>
        </motion.div>

        {storyParts.map((part, index) => (
          <div
            key={index}
            className="story-section glass"
            style={{
              padding: '3rem 2rem',
              margin: '8rem auto',
              maxWidth: '700px',
              textAlign: 'center',
              opacity: 0
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{part.emoji}</div>
            <h3 style={{ 
              fontSize: '2rem', 
              marginBottom: '1.5rem', 
              color: '#FF1744',
              fontFamily: 'var(--font-elegant)'
            }}>
              {part.title}
            </h3>
            <p style={{ 
              fontSize: '1.3rem', 
              lineHeight: '2',
              color: '#333'
            }}>
              {part.text}
            </p>
          </div>
        ))}

        <motion.div
          className="glass"
          style={{
            padding: '4rem 2rem',
            margin: '6rem auto',
            maxWidth: '800px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255, 23, 68, 0.1), rgba(255, 64, 129, 0.1))'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#FF1744' }}>
            She Said YES! 💚
          </h2>
          <p style={{ fontSize: '1.5rem', lineHeight: '2', marginBottom: '2rem' }}>
            And that moment, Ayushi, became the most beautiful moment of my life.
            The chemistry lab will forever be our special place. 🧪💚
          </p>
          <p style={{ fontSize: '1.3rem', fontStyle: 'italic' }}>
            "And that's how our forever began..." ✨
          </p>
          <div style={{ fontSize: '4rem' }}>💖✨🌹💍💕</div>
        </motion.div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(20px); }
          }
        `}</style>
      </div>
    </DayPage>
  )
}

export default ProposeDay
