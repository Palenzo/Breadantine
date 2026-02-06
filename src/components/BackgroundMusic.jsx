import { useEffect, useState, useRef } from 'react'
import './BackgroundMusic.css'

// Cloudinary audio URL for background music
const BACKGROUND_MUSIC_URL = 'https://res.cloudinary.com/dxfyyhhus/video/upload/v1770379980/valentine-ayushi/sounds/sound-1.mp3'

/**
 * Background Music Player Component
 * Loads and plays music from Cloudinary
 */
function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        // On first interaction, ensure volume is set
        if (!hasInteracted) {
          audioRef.current.volume = volume
          setHasInteracted(true)
        }
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (err) {
      console.error('Audio playback failed:', err)
      alert('Music playback was blocked by browser. Please click the play button!')
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  return (
    <div className="music-player">
      <audio 
        ref={audioRef}
        src={BACKGROUND_MUSIC_URL}
        loop
        preload="auto"
        muted={false}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => console.error('Audio error:', e)}
      />
      
      <div className="music-controls">
        <button 
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          <div className="music-icon">
            {isPlaying ? (
              <span className="icon-pause">⏸️</span>
            ) : (
              <span className="icon-play">▶️</span>
            )}
          </div>
          <div className="music-waves">
            <span className="wave"></span>
            <span className="wave"></span>
            <span className="wave"></span>
          </div>
        </button>
        
        <div className="volume-control">
          <span className="volume-icon">
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </span>
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
        <p className="music-title">
          Beautiful Love Beat
        </p>
        <p className="music-subtitle">
          Background Music - Made with ❤️ for Ayushi
        </p>
      </div>
    </div>
  )
}

export default BackgroundMusic
