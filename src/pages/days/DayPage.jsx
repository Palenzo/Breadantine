import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ThreeBackground from '../../components/ThreeBackground'
import UnlockService from '../../services/unlockService'
import { VALENTINE_DAYS } from '../../utils/unlockSystem'
import './DayPage.css'

const DayPage = ({ title, icon, children, bgColor = '#FFF0F5', flowerType = 'hearts' }) => {
  const navigate = useNavigate()

  // Derive day id from title by matching the known day names (titles include emoji)
  const dayMatch = VALENTINE_DAYS.find(d => title && title.includes(d.name))
  const dayId = dayMatch ? dayMatch.id : null
  const isUnlocked = dayId ? UnlockService.isUnlocked(dayId) : true

  return (
    <div className="day-page" style={{ background: bgColor }}>
      <ThreeBackground type={flowerType} intensity="low" />
      
      <button className="back-btn" onClick={() => navigate('/home')}>
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className="day-content">
        <div className="day-header">
          <div className="day-header-icon">{icon}</div>
          <h1 className="day-header-title">{title}</h1>
        </div>
        
        {isUnlocked ? children : (
          <div className="locked-overlay">
            <div className="locked-card">
              <div className="lock-emoji">🔒</div>
              <h3>Locked</h3>
              <p>This day is locked. Complete previous days to unlock it.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DayPage
