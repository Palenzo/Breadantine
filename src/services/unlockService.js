// Simple unlock service using localStorage
const STORAGE_KEY = 'valentine_day_unlocks_v1'

const DEFAULT_ORDER = [
  'rose',
  'kiss',
  'chocolate',
  'teddy',
  'hug',
  'promise',
  'propose',
  'valentine'
]

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { unlocked: {}, order: DEFAULT_ORDER }
    return JSON.parse(raw)
  } catch (e) {
    return { unlocked: {}, order: DEFAULT_ORDER }
  }
}

function write(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const UnlockService = {
  getOrder() {
    return read().order || DEFAULT_ORDER
  },
  getAll() {
    const s = read()
    return s.unlocked || {}
  },
  isUnlocked(key) {
    const s = read()
    return Boolean(s.unlocked && s.unlocked[key])
  },
  unlock(key) {
    const s = read()
    s.unlocked = s.unlocked || {}
    s.unlocked[key] = true
    write(s)
  },
  lock(key) {
    const s = read()
    s.unlocked = s.unlocked || {}
    delete s.unlocked[key]
    write(s)
  },
  unlockNext(currentKey) {
    const s = read()
    const order = s.order || DEFAULT_ORDER
    const idx = order.indexOf(currentKey)
    if (idx === -1) return
    const next = order[idx + 1]
    if (next) {
      s.unlocked = s.unlocked || {}
      s.unlocked[next] = true
      write(s)
      return next
    }
    return null
  }
}

export default UnlockService
