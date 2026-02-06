import React, { useState, useEffect, useRef } from 'react'
import DayPage from './DayPage'
import { motion } from 'framer-motion'
import ScoreService from '../../services/scoreService'
import { unlockNextDay } from '../../utils/unlockSystem'

const RoseDay = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [birdY, setBirdY] = useState(250)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [obstacles, setObstacles] = useState([])
  const [serverConnected, setServerConnected] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [leaderboard, setLeaderboard] = useState([])
  const gameLoopRef = useRef(null)

  useEffect(() => {
    // Check server connection
    ScoreService.checkHealth().then(setServerConnected)
    
    // Load high score from MongoDB or localStorage
    const loadHighScore = async () => {
      const personalBest = await ScoreService.getPersonalBest('flappy-love')
      if (personalBest && personalBest.score) {
        setHighScore(personalBest.score)
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem('rose_day_high_score')
        if (saved) setHighScore(parseInt(saved))
      }
    }
    
    loadHighScore()
    // load leaderboard
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      const data = await ScoreService.getHighScores('flappy-love', 10)
      // ScoreService returns { scores: [...] } or array depending on endpoint
      if (Array.isArray(data)) setLeaderboard(data)
      else if (data && data.scores) setLeaderboard(data.scores)
    } catch (err) {
      console.error('Failed to load leaderboard', err)
    }
  }

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setBirdY(250)
    setBirdVelocity(0)
    setObstacles([
      { x: 500, gapY: 220, passed: false },
      { x: 800, gapY: 280, passed: false },
      { x: 1100, gapY: 180, passed: false }
    ])
  }

  const jump = () => {
    if (!gameOver && gameStarted) {
      setBirdVelocity(-6) // Gentler jump (was -8)
    }
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    gameLoopRef.current = setInterval(() => {
      // Update bird position
      setBirdY(y => {
        const newY = y + birdVelocity
        if (newY < 0 || newY > 480) {
          setGameOver(true)
          return y
        }
        return newY
      })

      setBirdVelocity(v => v + 0.35) // Gentler gravity (was 0.5)

      // Update obstacles
      setObstacles(obs => {
        const newObs = obs.map(o => {
          const newX = o.x - 2 // Slower movement (was 3)
          
          // Check collision (wider gap, more forgiving)
          if (newX < 100 && newX > 20) {
            if (birdY < o.gapY - 80 || birdY > o.gapY + 80) { // Wider gap (was 60)
              setGameOver(true)
            }
          }

          // Check if passed
          if (newX < 50 && !o.passed) {
            setScore(s => {
              const newScore = s + 1
              if (newScore > highScore) {
                setHighScore(newScore)
                // Save to both MongoDB and localStorage
                ScoreService.saveScore('flappy-love', newScore, 'Ayushi', {
                  timestamp: new Date().toISOString()
                })
                localStorage.setItem('rose_day_high_score', newScore.toString())
              }
              return newScore
            })
            return { ...o, x: newX, passed: true }
          }

          return { ...o, x: newX }
        })

        // Reset obstacle when off screen
        return newObs.map(o => o.x < -100 ? { ...o, x: 900, gapY: Math.random() * 250 + 100, passed: false } : o)
      })
    }, 1000 / 60)

    return () => clearInterval(gameLoopRef.current)
  }, [gameStarted, gameOver, birdVelocity, birdY, highScore])

  return (
    <DayPage title="🌹 Rose Day" icon="🌹" bgColor="linear-gradient(135deg, #FFE4E8 0%, #FFF0F5 100%)" flowerType="roses">
      <div className="glass" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Flappy Love: Adi's Journey to Win Ayushi 💕</h2>
        
        {/* Server Status Indicator */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '0.9rem', color: serverConnected ? '#4CAF50' : '#999' }}>
          {serverConnected ? '✅ Online Leaderboard Active' : '📴 Offline Mode (Scores saved locally)'}
        </div>
        
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '600px', 
          height: '500px', 
          margin: '0 auto',
          background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '3px solid #FF1744'
        }}
        onClick={jump}
        >
          {/* Score Display */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, color: '#FF1744', fontWeight: 'bold', fontSize: '24px' }}>
            Score: {score} | High: {highScore}
          </div>

          {/* Bird */}
          {gameStarted && (
            <div style={{
              position: 'absolute',
              left: '50px',
              top: `${birdY}px`,
              width: '40px',
              height: '40px',
              fontSize: '32px',
              transition: 'transform 0.1s',
              transform: `rotate(${birdVelocity * 3}deg)`
            }}>
              💕
            </div>
          )}

          {/* Obstacles */}
          {obstacles.map((obs, i) => (
            <React.Fragment key={i}>
              {/* Top obstacle */}
              <div style={{
                position: 'absolute',
                left: `${obs.x}px`,
                top: 0,
                width: '60px',
                height: `${obs.gapY - 80}px`, // Wider gap (was 60)
                background: 'linear-gradient(to right, #FF1744, #FF4081)',
                borderRadius: '0 0 8px 8px'
              }} />
              
              {/* Bottom obstacle */}
              <div style={{
                position: 'absolute',
                left: `${obs.x}px`,
                bottom: 0,
                width: '60px',
                height: `${500 - (obs.gapY + 80)}px`, // Wider gap (was 60)
                background: 'linear-gradient(to right, #FF1744, #FF4081)',
                borderRadius: '8px 8px 0 0'
              }} />
            </React.Fragment>
          ))}

          {/* Start/Game Over Screen */}
          {(!gameStarted || gameOver) && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20
            }}>
              <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '2rem' }}>
                {gameOver ? `Game Over! Score: ${score}` : 'Flappy Love'}
              </h3>
              <p style={{ color: 'white', marginBottom: '2rem', textAlign: 'center', padding: '0 20px' }}>
                {gameOver ? 'Click to try again!' : 'Help Adi navigate through obstacles to reach Ayushi! Click to jump!'}
              </p>
              <motion.button
                className="btn btn-yes"
                onClick={(e) => {
                  e.stopPropagation()
                  startGame()
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}
              >
                {gameOver ? '🔄 Play Again' : '🎮 Start Game'}
              </motion.button>
              {gameOver && (
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <input
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    style={{ padding: '0.6rem', fontSize: '1rem', borderRadius: '8px', marginRight: '0.5rem' }}
                  />
                  <motion.button
                    className="btn"
                    onClick={async (ev) => {
                      ev.stopPropagation()
                      const name = playerName.trim() || 'Anonymous'
                      const payload = { gameType: 'flappy-love', score, playerName: name, metadata: { timestamp: new Date().toISOString() } }
                      console.log('Saving score payload', payload)
                      const res = await ScoreService.saveScore(payload.gameType, payload.score, payload.playerName, payload.metadata)
                      console.log('Saved score response', res)
                      try { unlockNextDay('rose') } catch (e) {}
                      // refresh leaderboard
                      loadLeaderboard()
                    }}
                    whileHover={{ scale: 1.05 }}
                    style={{ padding: '0.6rem 1rem' }}
                  >
                    Save Score
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Story Section */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h3 style={{ color: '#FF1744', marginBottom: '1rem' }}>Adi's Journey to Win Ayushi 🌹</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto' }}>
            Just like this game, winning your heart wasn't easy, Ayushi. 
            There were obstacles, challenges, and moments where I could have given up.
            But every time I saw your smile, I knew I had to keep going.
            You're worth every effort, every jump, every attempt. 
            This rose represents my journey - persistent, passionate, and always moving forward towards you. 🌹💕
          </p>
        </div>

          {/* Leaderboard Pane */}
          <div style={{ marginTop: '2rem', maxWidth: '700px', margin: '2rem auto' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Leaderboard</h4>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
              <motion.button className="btn" onClick={loadLeaderboard}>Refresh</motion.button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '10px', padding: '1rem' }}>
              <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {leaderboard && leaderboard.length > 0 ? leaderboard.map((s, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    <strong>{s.playerName || s.player || 'Anon'}</strong>: {s.score}
                  </li>
                )) : <li>No scores yet</li>}
              </ol>
            </div>
          </div>
      </div>
    </DayPage>
  )
}

export default RoseDay
