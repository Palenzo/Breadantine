import { useEffect, useState } from 'react'
import './BackgroundMusic.css'

// Cloudinary audio URL for background music
const BACKGROUND_MUSIC_URL = 'https://res.cloudinary.com/dxfyyhhus/video/upload/v1770379980/valentine-ayushi/sounds/sound-1.mp3'

// Create a singleton audio instance on window so it persists across mounts
function getGlobalAudio() {
  if (typeof window === 'undefined') return null
  if (!window.__valentine_bg_audio) {
    const a = new Audio(BACKGROUND_MUSIC_URL)
    a.loop = true
    a.preload = 'auto'
    a.volume = 0.3
    window.__valentine_bg_audio = a
  }
  return window.__valentine_bg_audio
}

/**
 * Background Music Player Component
 * Reuses a single audio element across the app so music continues across pages
 */
function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const audio = getGlobalAudio()

  useEffect(() => {
    if (!audio) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)

    // sync initial state
    setIsPlaying(!audio.paused && !audio.ended)
    audio.volume = volume

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [audio])

  useEffect(() => {
    if (audio) audio.volume = volume
  }, [audio, volume])

  const togglePlay = async () => {
    if (!audio) return
    try {
      if (isPlaying) {
        audio.pause()
      } else {
        await audio.play()
      }
    } catch (err) {
      console.error('Audio playback failed:', err)
      alert('Music playback was blocked by browser. Please interact to enable audio.')
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  return (
    <div className="music-player">
      <div className="music-controls">
        <button
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          <div className="music-icon">{isPlaying ? '⏸️' : '▶️'}</div>
        </button>

        <div className="volume-control">
          <span className="volume-icon">{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>

      <div className="music-info">
        <p className="music-title">Beautiful Love Beat</p>
        <p className="music-subtitle">Background Music - Made with ❤️ for Ayushi</p>
      </div>
    </div>
  )
}

export default BackgroundMusic
