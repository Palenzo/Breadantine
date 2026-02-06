import React, { useState, useEffect, useRef } from 'react'
import DayPage from './DayPage'
import { motion } from 'framer-motion'
import ScoreService from '../../services/scoreService'
import { AnimatePresence } from 'framer-motion'

const KissDay = () => {
  const [kisses, setKisses] = useState(0)
  const [kissesPerClick, setKissesPerClick] = useState(1)
  const [autoKisses, setAutoKisses] = useState(0)
  const [upgrades, setUpgrades] = useState({
    doubleClick: 0,
    autoKisser: 0,
    megaKiss: 0
  })
  const [streak, setStreak] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [showCombo, setShowCombo] = useState(false)
  const lastClickRef = useRef(0)
  const [playerName, setPlayerName] = useState('')
  const [leaderboard, setLeaderboard] = useState([])

  const upgradeCosts = {
    doubleClick: Math.floor(10 * Math.pow(1.5, upgrades.doubleClick)),
    autoKisser: Math.floor(50 * Math.pow(2, upgrades.autoKisser)),
    megaKiss: Math.floor(100 * Math.pow(2.5, upgrades.megaKiss))
  }

  useEffect(() => {
    const saved = localStorage.getItem('kiss_day_kisses')
    if (saved) setKisses(parseInt(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('kiss_day_kisses', kisses.toString())
  }, [kisses])

  useEffect(() => {
    if (autoKisses > 0) {
      const interval = setInterval(() => {
        setKisses(k => k + autoKisses)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [autoKisses])

  const handleKiss = () => {
    const now = Date.now()
    const diff = now - lastClickRef.current
    lastClickRef.current = now

    // Streak multiplier: quick clicks within 1s increase streak
    if (diff <= 1000) {
      setStreak(s => {
        const next = s + 1
        const nextMultiplier = 1 + Math.min(4, Math.floor(next / 5))
        setMultiplier(nextMultiplier)
        setShowCombo(true)
        setTimeout(() => setShowCombo(false), 700)
        return next
      })
    } else {
      setStreak(1)
      setMultiplier(1)
    }

    // Apply multiplier
    setKisses(k => {
      const gained = kissesPerClick * multiplier
      const next = k + gained

      // Console log small debug
      // Save milestone scores
      if (next >= 100 && k < 100) {
        ScoreService.saveScore('kiss-clicker', next, 'Ayushi').then(r => console.log('Saved kiss milestone 100', r))
      }
      if (next >= 500 && k < 500) {
        ScoreService.saveScore('kiss-clicker', next, 'Ayushi').then(r => console.log('Saved kiss milestone 500', r))
      }
      if (next >= 1000 && k < 1000) {
        ScoreService.saveScore('kiss-clicker', next, 'Ayushi').then(r => console.log('Saved kiss milestone 1000', r))
      }

      return next
    })
  }

  const loadLeaderboard = async () => {
    try {
      const data = await ScoreService.getHighScores('kiss-clicker', 10)
      if (Array.isArray(data)) setLeaderboard(data)
      else if (data && data.scores) setLeaderboard(data.scores)
    } catch (err) {
      console.error('Failed loading leaderboard', err)
    }
  }

  const buyUpgrade = (type) => {
    const cost = upgradeCosts[type]
    if (kisses >= cost) {
      setKisses(k => k - cost)
      setUpgrades(u => ({ ...u, [type]: u[type] + 1 }))

      if (type === 'doubleClick') {
        setKissesPerClick(k => k + 1)
      } else if (type === 'autoKisser') {
        setAutoKisses(a => a + 1)
      } else if (type === 'megaKiss') {
        setKissesPerClick(k => k + 5)
      }
    }
  }

  return (
    <DayPage title="💋 Kiss Day" icon="💋" bgColor="linear-gradient(135deg, #FFEBEE 0%, #FFF0F5 100%)" flowerType="sunflower">
      <div className="glass" style={{ padding: '3rem 2rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', color: '#C2185B' }}>
          Click Chemistry Challenge 💋💕
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center', color: '#666' }}>
          Generate kisses and unlock romantic upgrades!
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div className="glass" style={{ padding: '1.5rem', minWidth: '200px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: '#C2185B', marginBottom: '0.5rem' }}>Total Kisses</div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#FF1744' }}>{kisses} 💋</div>
          </div>
          <div className="glass" style={{ padding: '1.5rem', minWidth: '200px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: '#C2185B', marginBottom: '0.5rem' }}>Per Click</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF4081' }}>+{kissesPerClick}</div>
          </div>
          <div className="glass" style={{ padding: '1.5rem', minWidth: '200px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: '#C2185B', marginBottom: '0.5rem' }}>Auto/Second</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF4081' }}>+{autoKisses}</div>
          </div>
        </div>

        {/* Kiss Button */}
        <motion.button
          onClick={handleKiss}
          style={{
            fontSize: '10rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            margin: '2rem auto',
            display: 'block'
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          💋
        </motion.button>

        {/* Combo/Streak display */}
        {showCombo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', marginTop: '-1rem', fontSize: '1.4rem', color: '#FF4081' }}
          >
            🔥 Combo x{multiplier} — Streak {streak}
          </motion.div>
        )}

        {/* Upgrades */}
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#C2185B' }}>Upgrades 🎁</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            
            <div className="glass" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💕 Double Click</div>
              <div style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>+1 kiss per click</div>
              <div style={{ marginBottom: '1rem' }}>Level: {upgrades.doubleClick}</div>
              <motion.button
                onClick={() => buyUpgrade('doubleClick')}
                className="btn"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  opacity: kisses >= upgradeCosts.doubleClick ? 1 : 0.5,
                  cursor: kisses >= upgradeCosts.doubleClick ? 'pointer' : 'not-allowed'
                }}
                whileHover={kisses >= upgradeCosts.doubleClick ? { scale: 1.05 } : {}}
                disabled={kisses < upgradeCosts.doubleClick}
              >
                Buy ({upgradeCosts.doubleClick} 💋)
              </motion.button>
            </div>

            <div className="glass" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💖 Auto Kisser</div>
              <div style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>+1 kiss per second</div>
              <div style={{ marginBottom: '1rem' }}>Level: {upgrades.autoKisser}</div>
              <motion.button
                onClick={() => buyUpgrade('autoKisser')}
                className="btn"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  opacity: kisses >= upgradeCosts.autoKisser ? 1 : 0.5,
                  cursor: kisses >= upgradeCosts.autoKisser ? 'pointer' : 'not-allowed'
                }}
                whileHover={kisses >= upgradeCosts.autoKisser ? { scale: 1.05 } : {}}
                disabled={kisses < upgradeCosts.autoKisser}
              >
                Buy ({upgradeCosts.autoKisser} 💋)
              </motion.button>
            </div>

            <div className="glass" style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💝 Mega Kiss</div>
              <div style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>+5 kisses per click</div>
              <div style={{ marginBottom: '1rem' }}>Level: {upgrades.megaKiss}</div>
              <motion.button
                onClick={() => buyUpgrade('megaKiss')}
                className="btn"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  opacity: kisses >= upgradeCosts.megaKiss ? 1 : 0.5,
                  cursor: kisses >= upgradeCosts.megaKiss ? 'pointer' : 'not-allowed'
                }}
                whileHover={kisses >= upgradeCosts.megaKiss ? { scale: 1.05 } : {}}
                disabled={kisses < upgradeCosts.megaKiss}
              >
                Buy ({upgradeCosts.megaKiss} 💋)
              </motion.button>
            </div>
          </div>
        </div>

        {kisses >= 1000 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '4rem',
              padding: '2rem',
              background: 'linear-gradient(135deg, rgba(255, 23, 68, 0.1), rgba(255, 64, 129, 0.1))',
              borderRadius: '20px',
              textAlign: 'center',
              border: '3px solid #FF1744'
            }}
          >
            <h3 style={{ fontSize: '2rem', color: '#FF1744', marginBottom: '1rem' }}>🎉 1000+ Kisses! 🎉</h3>
            <p style={{ fontSize: '1.3rem', lineHeight: '2' }}>
              Ayushi, if I could, I'd give you infinite kisses every single day.
              Each one filled with love, passion, and devotion. You deserve all the love in the world! 💋💖
            </p>
          </motion.div>
        )}
        {/* Save Score + Leaderboard */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <input placeholder="Your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', marginRight: '0.5rem' }} />
            <motion.button onClick={async () => {
              const name = playerName.trim() || 'Anonymous'
              const payload = { gameType: 'kiss-clicker', score: kisses, playerName: name }
              console.log('Saving score payload', payload)
              const res = await ScoreService.saveScore(payload.gameType, payload.score, payload.playerName)
              console.log('Saved kiss score', res)
              loadLeaderboard()
            }} className="btn">Save Score</motion.button>
          </div>

          <div style={{ maxWidth: '700px', margin: '1rem auto', background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '10px' }}>
            <h4>Leaderboard</h4>
            <ol>
              {leaderboard && leaderboard.length > 0 ? leaderboard.map((s, i) => (
                <li key={i}><strong>{s.playerName || s.player || 'Anon'}</strong>: {s.score}</li>
              )) : <li>No scores</li>}
            </ol>
            <motion.button className="btn" onClick={loadLeaderboard}>Refresh</motion.button>
          </div>
        </div>
      </div>
    </DayPage>
  )
}

export default KissDay
