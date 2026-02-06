import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Password from './pages/Password'
import Dashboard from './pages/Dashboard'
import BackgroundMusic from './components/BackgroundMusic'
import RoseDay from './pages/days/RoseDay'
import ProposeDay from './pages/days/ProposeDay'
import ChocolateDay from './pages/days/ChocolateDay'
import TeddyDay from './pages/days/TeddyDay'
import PromiseDay from './pages/days/PromiseDay'
import HugDay from './pages/days/HugDay'
import KissDay from './pages/days/KissDay'
import ValentineDay from './pages/days/ValentineDay'
import './App.css'

function App() {
  return (
    <Router>
      <BackgroundMusic />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/password" element={<Password />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/days/rose-day" element={<RoseDay />} />
          <Route path="/days/propose-day" element={<ProposeDay />} />
          <Route path="/days/chocolate-day" element={<ChocolateDay />} />
          <Route path="/days/teddy-day" element={<TeddyDay />} />
          <Route path="/days/promise-day" element={<PromiseDay />} />
          <Route path="/days/hug-day" element={<HugDay />} />
          <Route path="/days/kiss-day" element={<KissDay />} />
          <Route path="/days/valentine-day" element={<ValentineDay />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default App
