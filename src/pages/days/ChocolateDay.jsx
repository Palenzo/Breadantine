import React, { useState, useEffect, useRef } from 'react'
import DayPage from './DayPage'
import { motion, AnimatePresence } from 'framer-motion'
import ScoreService from '../../services/scoreService'

const ChocolateDay = () => {
  // legacy click counter removed; using `chocolates` as primary counter
  const [floatingHearts, setFloatingHearts] = useState([])
  const [showMessage, setShowMessage] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [bonusTarget, setBonusTarget] = useState(null)
  const bonusTimerRef = useRef(null)
  const [playerName, setPlayerName] = useState('')
  const [leaderboard, setLeaderboard] = useState([])
  // Game state for Chocolate Factory Tycoon
  const TOTAL_TIME = 120 // seconds
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [running, setRunning] = useState(false)
  const [autoRate, setAutoRate] = useState(0) // chocolates per second
  const [levels, setLevels] = useState({ maker: 0, mixer: 0, wrapper: 0, turbo: 0, heartShaper: 0 })
  const [chocolates, setChocolates] = useState(0)
  const [goldens, setGoldens] = useState([])
  const gameTimerRef = useRef(null)
  const autoIntervalRef = useRef(null)
  const goldenTimerRef = useRef(null)

  const loveMessages = [
    "I love your smile ❤️",
    "I love how you laugh 💕",
    "I love your kindness 💖",
    "I love your eyes ✨",
    "I love talking to you 💬",
    "I love your intelligence 🧠",
    "I love your heart ❤️",
    "I love your passion 🔥",
    "I love everything about you 💝",
    "You're my everything 👑",
    "You make me complete 💫",
    "You're my queen 👸",
    "Forever yours 💍",
    "You're my best friend 🤝",
    "You're my soulmate 💞",
    "I cherish you always 🌹",
    "You're irreplaceable 💎",
    "My heart belongs to you 💓",
    "You're my dream come true 🌟",
    "Together forever 🔐"
  ]

  const handleClick = (e) => {
    if (chocolates >= 112) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Add floating heart
    const heartId = Date.now() + Math.random()
    setFloatingHearts(prev => [...prev, { id: heartId, x, y }])

    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== heartId))
    }, 1000)

    const newCount = chocolates + 1
    setChocolates(newCount)

    // If we hit completion, save score
    if (newCount >= 112) {
      ScoreService.saveScore('chocolate-clicker', newCount, 'Ayushi').then(r => console.log('Saved chocolate completion', r))
    }

    // Show message every 10
    if (newCount % 10 === 0 && newCount <= 112) {
      const messageIndex = Math.floor(newCount / 10) - 1
      setCurrentMessage(loveMessages[messageIndex % loveMessages.length])
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    }

    // Save progress
    localStorage.setItem('chocolate_day_clicks', newCount.toString())
  }

  useEffect(() => {
    const saved = localStorage.getItem('chocolate_day_clicks')
    if (saved) setChocolates(parseInt(saved))
    // start bonus target cycle
    bonusTimerRef.current = setInterval(() => {
      // spawn a bonus target at a random position within 300x300 area
      const x = Math.random() * 300 + 50
      const y = Math.random() * 200 + 20
      setBonusTarget({ id: Date.now(), x, y })
      // remove after 3s
      setTimeout(() => setBonusTarget(null), 3000)
    }, 8000)
    return () => clearInterval(bonusTimerRef.current)
  }, [])

  // Calculate autoRate whenever levels change
  useEffect(() => {
    const base = (levels.maker * 1) + (levels.mixer * 3) + (levels.wrapper * 5) + (levels.turbo * 10)
    setAutoRate(base)
  }, [levels])

  // Auto-generation interval
  useEffect(() => {
    if (!running) return
    if (autoIntervalRef.current) clearInterval(autoIntervalRef.current)
    autoIntervalRef.current = setInterval(() => {
      setChocolates(c => c + autoRate)
    }, 1000)
    return () => clearInterval(autoIntervalRef.current)
  }, [running, autoRate])

  // Game timer
  useEffect(() => {
    if (!running) return
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(gameTimerRef.current)
          endGame()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(gameTimerRef.current)
  }, [running])

  // Golden chocolate spawns during CHAOS (last 30s)
  useEffect(() => {
    if (!running) return
    if (timeLeft <= 30) {
      // start golden spawns
      if (!goldenTimerRef.current) {
        goldenTimerRef.current = setInterval(() => {
          const id = Date.now() + Math.random()
          setGoldens(g => [...g, { id, x: Math.random() * 320 + 20, y: Math.random() * 220 + 40 }])
          // auto remove after 6s
          setTimeout(() => setGoldens(g => g.filter(x => x.id !== id)), 6000)
        }, 800)
      }
    } else {
      if (goldenTimerRef.current) {
        clearInterval(goldenTimerRef.current)
        goldenTimerRef.current = null
      }
    }
    return () => {
      if (goldenTimerRef.current) {
        clearInterval(goldenTimerRef.current)
        goldenTimerRef.current = null
      }
    }
  }, [timeLeft, running])

  const resetGame = () => {
    setTimeLeft(TOTAL_TIME)
    setRunning(false)
    setLevels({ maker: 0, mixer: 0, wrapper: 0, turbo: 0, heartShaper: 0 })
    setAutoRate(0)
    setChocolates(0)
    setGoldens([])
    setGoldens([])
  }

  const startGame = () => {
    resetGame()
    setRunning(true)
  }

  const endGame = async () => {
    setRunning(false)
    // Finalize count: stop at 112 goal
    const final = Math.min(112, chocolates)
    // If goal reached -> save and unlock message
    if (final >= 112) {
      await ScoreService.saveScore('chocolate-clicker', final, 'Ayushi')
      console.log('Goal achieved saved', final)
    } else {
      await ScoreService.saveScore('chocolate-clicker', chocolates, 'Ayushi')
      console.log('Game ended, saved partial', chocolates)
    }
  }

  const currentPhase = () => {
    if (timeLeft > 90) return 'Phase 1: Manual Harvest'
    if (timeLeft > 60) return 'Phase 2: First Upgrade'
    if (timeLeft > 30) return 'Phase 3: Factory Mode'
    return 'Phase 4: CHAOS'
  }

  const buyUpgrade = (type) => {
    const costs = {
      maker: 20,
      mixer: 50,
      wrapper: 120,
      turbo: 300,
      heartShaper: 250
    }
    const cost = Math.floor(costs[type] * Math.pow(1.5, levels[type]))
    if (chocolates >= cost) {
      setChocolates(c => c - cost)
      setLevels(l => ({ ...l, [type]: l[type] + 1 }))
    }
  }

  const clickBean = () => {
    // clicking yields 1 chocolate, heart shaper doubles value
    const value = 1 * (levels.heartShaper > 0 ? 2 : 1)
    setChocolates(c => c + value)
    // small floating heart effect
    const heartId = Date.now() + Math.random()
    setFloatingHearts(prev => [...prev, { id: heartId, x: 160 + Math.random() * 80, y: 120 + Math.random() * 40 }])
    setTimeout(() => setFloatingHearts(prev => prev.filter(h => h.id !== heartId)), 900)
  }

  const collectGolden = (id) => {
    setGoldens(g => g.filter(x => x.id !== id))
    setChocolates(c => c + 10)
  }

  const loadLeaderboard = async () => {
    try {
      const data = await ScoreService.getHighScores('chocolate-clicker', 10)
      if (Array.isArray(data)) setLeaderboard(data)
      else if (data && data.scores) setLeaderboard(data.scores)
    } catch (err) {
      console.error('Failed loading chocolate leaderboard', err)
    }
  }

  const progress = (chocolates / 112) * 100

  return (
    <DayPage title="🍫 Chocolate Day" icon="🍫" bgColor="linear-gradient(135deg, #FFF5E6 0%, #FFE4CC 100%)" flowerType="flowers">
      <div className="glass" style={{ padding: '3rem 2rem', marginTop: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: '#8B4513' }}>
          Chocolate Factory Tycoon — Build a chocolate empire for Ayushi
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ color: '#666' }}>Time: <strong>{timeLeft}s</strong></div>
          <div style={{ color: '#666' }}>{currentPhase()}</div>
          <div style={{ color: '#666' }}>Auto: <strong>{autoRate}/s</strong></div>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          width: '100%', 
          height: '30px', 
          background: '#F0E6DC', 
          borderRadius: '15px',
          overflow: 'hidden',
          marginBottom: '2rem',
          border: '2px solid #8B4513'
        }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #8B4513, #D2691E)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          >
            {chocolates > 0 && `${chocolates}/112`}
          </motion.div>
        </div>

        {/* Chocolate Factory UI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '900px', margin: '1.5rem auto' }}>
          <div style={{ padding: '1rem' }}>
            <div style={{ fontSize: '5rem', cursor: running ? 'default' : 'pointer' }} onClick={() => { if (!running) startGame(); else clickBean() }}>
              🍫
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '1.4rem' }}>Chocolates: <strong>{chocolates}</strong></div>
              <div style={{ marginTop: '0.5rem' }}>
                <motion.button className="btn" onClick={() => clickBean()} disabled={!running} style={{ marginRight: '0.5rem' }}>Click Cocoa (+{levels.heartShaper>0?2:1})</motion.button>
                <motion.button className="btn" onClick={() => { if (!running) startGame(); else resetGame() }} style={{ marginLeft: '0.5rem' }}>{running ? 'Reset' : 'Start'}</motion.button>
              </div>
            </div>

            {/* Floating Hearts */}
            <AnimatePresence>
              {floatingHearts.map(heart => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 1, x: heart.x, y: heart.y, scale: 0 }}
                  animate={{ opacity: 0, y: heart.y - 100, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  style={{ position: 'absolute', fontSize: '2rem', pointerEvents: 'none', zIndex: 10 }}
                >
                  💕
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.7)', borderRadius: '12px' }}>
            <h4 style={{ marginTop: 0 }}>Upgrades</h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>🍫 Chocolate Maker (1/s)</div>
                <div>
                  <motion.button className="btn" onClick={() => buyUpgrade('maker')}>Buy ({Math.floor(20 * Math.pow(1.5, levels.maker))})</motion.button>
                  <span style={{ marginLeft: '0.5rem' }}>Lv {levels.maker}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>🏭 Auto-mixer (3/s)</div>
                <div>
                  <motion.button className="btn" onClick={() => buyUpgrade('mixer')}>Buy ({Math.floor(50 * Math.pow(1.5, levels.mixer))})</motion.button>
                  <span style={{ marginLeft: '0.5rem' }}>Lv {levels.mixer}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>📦 Wrapper (5/s)</div>
                <div>
                  <motion.button className="btn" onClick={() => buyUpgrade('wrapper')}>Buy ({Math.floor(120 * Math.pow(1.5, levels.wrapper))})</motion.button>
                  <span style={{ marginLeft: '0.5rem' }}>Lv {levels.wrapper}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>🚀 Turbo (10/s)</div>
                <div>
                  <motion.button className="btn" onClick={() => buyUpgrade('turbo')}>Buy ({Math.floor(300 * Math.pow(1.5, levels.turbo))})</motion.button>
                  <span style={{ marginLeft: '0.5rem' }}>Lv {levels.turbo}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>💝 Heart Shaper (2x)</div>
                <div>
                  <motion.button className="btn" onClick={() => buyUpgrade('heartShaper')}>Buy ({Math.floor(250 * Math.pow(1.5, levels.heartShaper))})</motion.button>
                  <span style={{ marginLeft: '0.5rem' }}>Lv {levels.heartShaper}</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>Goal: 112 chocolates — Extra become Love Points</div>
          </div>
        </div>

        {/* Save Score + Leaderboard */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <input placeholder="Your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', marginRight: '0.5rem' }} />
            <motion.button onClick={async () => {
              const name = playerName.trim() || 'Anonymous'
              const payload = { gameType: 'chocolate-clicker', score: chocolates, playerName: name }
              console.log('Saving score payload', payload)
              const res = await ScoreService.saveScore(payload.gameType, payload.score, payload.playerName)
              console.log('Saved chocolate score', res)
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

        {/* Message Display */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              style={{
                padding: '1.5rem 2rem',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                borderRadius: '20px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                marginTop: '2rem',
                boxShadow: '0 8px 20px rgba(255, 215, 0, 0.4)'
              }}
            >
              {currentMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Message */}
        {chocolates >= 112 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '3rem',
              padding: '2rem',
              background: 'linear-gradient(135deg, rgba(255, 23, 68, 0.1), rgba(255, 64, 129, 0.1))',
              borderRadius: '20px',
              border: '3px solid #FF1744'
            }}
          >
            <h3 style={{ fontSize: '2rem', color: '#FF1744', marginBottom: '1rem' }}>
              🎉 You Collected All 112 Chocolates! 🎉
            </h3>
            <p style={{ fontSize: '1.3rem', lineHeight: '2' }}>
              Ayushi, I've said "I love you" 112 times and counting, 
              but even that number can't capture how much you mean to me.
              Every chocolate represents a moment, a feeling, a reason why you're my everything.
              Sweet like chocolate, warm like your smile - that's how you make my life. 🍫💖
            </p>
          </motion.div>
        )}

        {/* Instructions */}
        {chocolates < 112 && (
          <div style={{ marginTop: '2rem', color: '#666', fontSize: '1.1rem' }}>
            <p>💡 Tip: Click the chocolate to collect pieces!</p>
            <p>Get special messages every 10 chocolates! 💕</p>
          </div>
        )}
      </div>
    </DayPage>
  )
}

export default ChocolateDay
