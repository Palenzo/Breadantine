import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ThreeBackground from '../../components/ThreeBackground'
import './DayPage.css'

const DayPage = ({ title, icon, children, bgColor = '#FFF0F5', flowerType = 'hearts' }) => {
  const navigate = useNavigate()

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
        
        {children}
      </div>
    </div>
  )
}

export default DayPage
