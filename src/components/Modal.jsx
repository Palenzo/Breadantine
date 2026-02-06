import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import './Modal.css'

const Modal = ({ isOpen, onClose, children, title, className = '' }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`modal-content ${className}`}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
          
          {title && <h2 className="modal-title">{title}</h2>}
          
          <div className="modal-body">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Modal
