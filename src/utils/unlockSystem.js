// Date unlock system for Valentine's Days
export const VALENTINE_DAYS = [
  {
    id: 'rose',
    name: 'Rose Day',
    date: 7,
    month: 1, // February (0-indexed)
    description: 'Exchanging roses to express love',
    icon: '🌹',
    path: '/days/rose-day',
    color: '#FF1744'
  },
  {
    id: 'propose',
    name: 'Propose Day',
    date: 8,
    month: 1,
    description: 'Confessing feelings',
    icon: '💍',
    path: '/days/propose-day',
    color: '#FF4081'
  },
  {
    id: 'chocolate',
    name: 'Chocolate Day',
    date: 9,
    month: 1,
    description: 'Sharing sweet moments',
    icon: '🍫',
    path: '/days/chocolate-day',
    color: '#795548'
  },
  {
    id: 'teddy',
    name: 'Teddy Day',
    date: 10,
    month: 1,
    description: 'Comfort and care',
    icon: '🧸',
    path: '/days/teddy-day',
    color: '#FF94C2'
  },
  {
    id: 'promise',
    name: 'Promise Day',
    date: 11,
    month: 1,
    description: 'Meaningful commitments',
    icon: '🤞',
    path: '/days/promise-day',
    color: '#9C27B0'
  },
  {
    id: 'hug',
    name: 'Hug Day',
    date: 12,
    month: 1,
    description: 'Emotional support',
    icon: '🤗',
    path: '/days/hug-day',
    color: '#E91E63'
  },
  {
    id: 'kiss',
    name: 'Kiss Day',
    date: 13,
    month: 1,
    description: 'Deepening connections',
    icon: '💋',
    path: '/days/kiss-day',
    color: '#F50057'
  },
  {
    id: 'valentine',
    name: "Valentine's Day",
    date: 14,
    month: 1,
    description: 'The grand finale',
    icon: '💘',
    path: '/days/valentine-day',
    color: '#FF1744'
  }
]

/**
 * Check if a specific day is unlocked
 * @param {number} dayDate - The date to check (7-14)
 * @returns {boolean}
 */
import UnlockService from '../services/unlockService'

export const isDayUnlocked = (dayOrDate) => {
  // Accept either day id (string) or date number
  let dayObj = null

  if (typeof dayOrDate === 'string') {
    dayObj = VALENTINE_DAYS.find(d => d.id === dayOrDate)
  } else if (typeof dayOrDate === 'number') {
    dayObj = VALENTINE_DAYS.find(d => d.date === dayOrDate)
  }

  // If we couldn't map, fallback to false
  if (!dayObj) return false

  // If explicitly unlocked in localStorage, honor it
  if (UnlockService.isUnlocked(dayObj.id)) return true

  // Date-based unlocking fallback: use IST (UTC+5:30) so days open at 00:00 IST
  const now = new Date()
  // Compute current time in IST by shifting UTC to +5:30
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  const istOffsetMs = 5.5 * 60 * 60 * 1000
  const istNow = new Date(utc + istOffsetMs)
  const currentMonth = istNow.getMonth()
  const currentDate = istNow.getDate()

  // If not February, allow all in DEV; otherwise compute days until next Feb
  if (currentMonth !== 1) {
    if (import.meta.env && import.meta.env.DEV) return true
    // Fallback: compare against local date in IST by projecting to next Feb
    return currentDate >= dayObj.date
  }

  return currentDate >= dayObj.date
}

/**
 * Get all unlocked days
 * @returns {Array} Array of unlocked days
 */
export const getUnlockedDays = () => {
  return VALENTINE_DAYS.filter(day => isDayUnlocked(day.id))
}

/**
 * Get all locked days
 * @returns {Array} Array of locked days
 */
export const getLockedDays = () => {
  return VALENTINE_DAYS.filter(day => !isDayUnlocked(day.id))
}

/**
 * Get days until a specific date unlocks
 * @param {number} dayDate - The date to check
 * @returns {number} Number of days until unlock
 */
export const getDaysUntilUnlock = (dayDate) => {
  // Use IST for consistent unlocking (UTC+5:30)
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  const istOffsetMs = 5.5 * 60 * 60 * 1000
  const istNow = new Date(utc + istOffsetMs)
  const currentMonth = istNow.getMonth()
  const currentDate = istNow.getDate()

  if (currentMonth !== 1) {
    // Calculate days until next February in IST
    const nextFebruary = new Date(istNow.getFullYear() + 1, 1, dayDate)
    const diff = nextFebruary - istNow
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  if (currentDate >= dayDate) {
    return 0
  }

  return dayDate - currentDate
}

/**
 * Get next day to unlock
 * @returns {Object|null} Next day object or null if all unlocked
 */
export const getNextDayToUnlock = () => {
  const locked = getLockedDays()
  return locked.length > 0 ? locked[0] : null
}

/**
 * Programmatically unlock the next day after `dayId` and return the unlocked id
 */
export const unlockNextDay = (dayId) => {
  return UnlockService.unlockNext(dayId)
}

export const getUnlockOrder = () => {
  return UnlockService.getOrder()
}

/**
 * Get progress percentage
 * @returns {number} Progress from 0 to 100
 */
export const getProgress = () => {
  const unlocked = getUnlockedDays().length
  const total = VALENTINE_DAYS.length
  return Math.round((unlocked / total) * 100)
}

/**
 * Save day visit to localStorage
 * @param {string} dayId - ID of the day visited
 */
export const markDayVisited = (dayId) => {
  const visited = getVisitedDays()
  if (!visited.includes(dayId)) {
    visited.push(dayId)
    localStorage.setItem('valentine_visited_days', JSON.stringify(visited))
  }
}

/**
 * Get all visited days
 * @returns {Array} Array of visited day IDs
 */
export const getVisitedDays = () => {
  const visited = localStorage.getItem('valentine_visited_days')
  return visited ? JSON.parse(visited) : []
}

/**
 * Check if day was visited
 * @param {string} dayId - ID of the day to check
 * @returns {boolean}
 */
export const wasDayVisited = (dayId) => {
  return getVisitedDays().includes(dayId)
}

/**
 * Get achievement badges
 * @returns {Array} Array of earned badges
 */
export const getAchievements = () => {
  const visited = getVisitedDays()
  const achievements = []
  
  if (visited.length >= 1) {
    achievements.push({ id: 'first_step', name: 'First Step', icon: '👣' })
  }
  if (visited.length >= 4) {
    achievements.push({ id: 'halfway', name: 'Halfway There', icon: '⭐' })
  }
  if (visited.length >= 8) {
    achievements.push({ id: 'completionist', name: 'Love Journey Complete', icon: '👑' })
  }
  if (visited.includes('rose')) {
    achievements.push({ id: 'rose_collector', name: 'Rose Collector', icon: '🌹' })
  }
  if (visited.includes('chocolate')) {
    achievements.push({ id: 'chocolate_lover', name: 'Chocolate Lover', icon: '🍫' })
  }
  if (visited.includes('kiss')) {
    achievements.push({ id: 'kiss_master', name: 'Kiss Master', icon: '💋' })
  }
  
  return achievements
}

/**
 * Get countdown to next meeting
 * This is a placeholder - customize with actual date
 */
export const getCountdownToMeeting = () => {
  const nextMeeting = new Date('2026-03-15') // Customize this date
  const now = new Date()
  const diff = nextMeeting - now
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return { days, hours, minutes }
}

/**
 * Calculate relationship duration
 * Started: August 27, 2019 ❤️
 */
export const getRelationshipDuration = () => {
  const startDate = new Date('2019-08-27') // Adi + Ayushi ❤️
  const now = new Date()
  const diff = now - startDate
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)
  
  return { days, months, years }
}

/**
 * Easter egg: Check if hearts clicked 5 times
 */
export const checkHeartEasterEgg = () => {
  const count = parseInt(localStorage.getItem('valentine_heart_clicks') || '0')
  if (count >= 5) {
    localStorage.setItem('valentine_memory_lane_unlocked', 'true')
    return true
  }
  return false
}

/**
 * Increment heart clicks
 */
export const incrementHeartClicks = () => {
  const count = parseInt(localStorage.getItem('valentine_heart_clicks') || '0')
  localStorage.setItem('valentine_heart_clicks', (count + 1).toString())
  return count + 1
}

/**
 * Check if Memory Lane is unlocked
 */
export const isMemoryLaneUnlocked = () => {
  return localStorage.getItem('valentine_memory_lane_unlocked') === 'true'
}

/**
 * Love quotes for random display
 */
export const getLoveQuotes = () => {
  return [
    "Every pixel on this page was coded thinking of you 💖",
    "112 chocolates, infinite love ∞",
    "Even mycode has a crush on you 😊",
    "Loading love... 100% complete ✨",
    "Compiling emotions... Success! ❤️",
    "Error: Cannot stop loving you 💝",
    "You're the CSS to my HTML 💕",
    "Together we're better than any framework 🌟"
  ]
}

/**
 * Get random love quote
 */
export const getRandomLoveQuote = () => {
  const quotes = getLoveQuotes()
  return quotes[Math.floor(Math.random() * quotes.length)]
}

/**
 * Get time-based theme
 */
export const getTimeBasedTheme = () => {
  const hour = new Date().getHours()
  
  if (hour >= 22 || hour < 6) {
    return 'night' // Special midnight theme
  } else if (hour >= 18) {
    return 'evening' // Purple/romantic
  } else if (hour >= 12) {
    return 'afternoon' // Warm colors
  } else {
    return 'morning' // Light and hopeful
  }
}

/**
 * Check if night mode should be active
 */
export const isNightMode = () => {
  const hour = new Date().getHours()
  return hour >= 22 || hour < 6
}

export default {
  VALENTINE_DAYS,
  isDayUnlocked,
  getUnlockedDays,
  getLockedDays,
  getDaysUntilUnlock,
  getNextDayToUnlock,
  getProgress,
  markDayVisited,
  getVisitedDays,
  wasDayVisited,
  getAchievements,
  getCountdownToMeeting,
  getRelationshipDuration,
  checkHeartEasterEgg,
  incrementHeartClicks,
  isMemoryLaneUnlocked,
  getLoveQuotes,
  getRandomLoveQuote,
  getTimeBasedTheme,
  isNightMode
}
