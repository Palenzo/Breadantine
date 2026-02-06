import mongoose from 'mongoose'

const scoreSchema = new mongoose.Schema({
  gameType: {
    type: String,
    required: true,
    enum: ['flappy-love', 'kiss-clicker', 'chocolate-clicker']
  },
  playerName: {
    type: String,
    required: true,
    default: 'Ayushi'
  },
  score: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object,
    default: {}
  }
}, { timestamps: true })

const Score = mongoose.model('Score', scoreSchema)

export default Score
