// API service for MongoDB backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ScoreService {
  /**
   * Save a new score to the database
   */
  static async saveScore(gameType, score, playerName = 'Ayushi', metadata = {}) {
    try {
      const response = await fetch(`${API_URL}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameType,
          playerName,
          score,
          metadata
        })
      })
      
      const text = await response.text()
      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        data = { success: false, error: text }
      }

      if (!response.ok) {
        const serverMsg = data && data.error ? data.error : response.statusText
        throw new Error(`Failed to save score: ${serverMsg}`)
      }

      return data
    } catch (error) {
      console.error('Error saving score:', error)
      // Fallback to localStorage if server is unavailable
      this.saveToLocalStorage(gameType, score, playerName)
      return { success: false, error: error.message, fallback: 'localStorage' }
    }
  }

  /**
   * Get high scores for a specific game
   */
  static async getHighScores(gameType, limit = 10) {
    try {
      const response = await fetch(`${API_URL}/scores/${gameType}?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch scores')
      }
      
      const data = await response.json()
      return data.scores || []
    } catch (error) {
      console.error('Error fetching scores:', error)
      // Fallback to localStorage
      return this.getFromLocalStorage(gameType)
    }
  }

  /**
   * Get personal best for a player
   */
  static async getPersonalBest(gameType, playerName = 'Ayushi') {
    try {
      const safeName = encodeURIComponent(playerName)
      const response = await fetch(`${API_URL}/scores/${gameType}/player/${safeName}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch personal best')
      }
      
      const data = await response.json()
      return data.personalBest
    } catch (error) {
      console.error('Error fetching personal best:', error)
      return this.getFromLocalStorage(gameType)
    }
  }

  /**
   * Get game statistics
   */
  static async getStats(gameType) {
    try {
      const response = await fetch(`${API_URL}/stats/${gameType}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      
      const data = await response.json()
      return data.stats
    } catch (error) {
      console.error('Error fetching stats:', error)
      return null
    }
  }

  /**
   * Get overall leaderboard
   */
  static async getLeaderboard(limit = 20) {
    try {
      const response = await fetch(`${API_URL}/leaderboard?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
      }
      
      const data = await response.json()
      return data.leaderboard || []
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
  }

  /**
   * Check server health
   */
  static async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/health`)
      const data = await response.json()
      return data.status === 'ok'
    } catch (error) {
      return false
    }
  }

  // ==================== LocalStorage Fallback ====================

  /**
   * Save score to localStorage as fallback
   */
  static saveToLocalStorage(gameType, score, playerName) {
    const key = `${gameType}_high_score`
    const currentHigh = parseInt(localStorage.getItem(key) || '0')
    
    if (score > currentHigh) {
      localStorage.setItem(key, score.toString())
    }
    
    // Also save to history
    const historyKey = `${gameType}_history`
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]')
    history.push({
      playerName,
      score,
      date: new Date().toISOString()
    })
    
    // Keep only last 50 scores
    if (history.length > 50) {
      history.shift()
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history))
  }

  /**
   * Get scores from localStorage
   */
  static getFromLocalStorage(gameType) {
    const key = `${gameType}_high_score`
    const score = parseInt(localStorage.getItem(key) || '0')
    
    return {
      score,
      playerName: 'Ayushi',
      date: new Date().toISOString()
    }
  }

  /**
   * Get score history from localStorage
   */
  static getHistoryFromLocalStorage(gameType) {
    const historyKey = `${gameType}_history`
    return JSON.parse(localStorage.getItem(historyKey) || '[]')
  }
}

export default ScoreService
