import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import Grid from 'gridfs-stream'
import path from 'path'
import { fileURLToPath } from 'url'
import Score from './models/Score.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = parseInt(process.argv[2], 10) || parseInt(process.env.SERVER_PORT, 10) || parseInt(process.env.PORT, 10) || 3001

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/valentine-ayushi'

const conn = mongoose.createConnection(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Initialize GridFS
let gfs, gridfsBucket
conn.once('open', () => {
  console.log('✅ Connected to MongoDB')
  
  // Initialize GridFS Stream
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  })
  
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('uploads')
})

// Also connect with mongoose for standard schemas
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Mongoose connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err))

// Log mongoose connection status
mongoose.connection.on('connected', () => {
  console.log('🔗 MongoDB connection established (mongoose.connection)')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error (mongoose.connection):', err)
})

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection disconnected')
})

// GridFS Storage Configuration
const storage = new GridFsStorage({
  url: MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads',
      metadata: {
        uploadedBy: req.body.uploadedBy || 'Adi',
        category: req.body.category || (file.mimetype.startsWith('image/') ? 'photo' : 'sound'),
        description: req.body.description || '',
        dayAssociated: req.body.dayAssociated || null,
        originalName: file.originalname
      }
    }
  }
})

const upload = multer({ storage })

// Media Metadata Schema (for easier querying)
const mediaSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  fileId: mongoose.Types.ObjectId,
  contentType: String,
  size: Number,
  category: {
    type: String,
    enum: ['photo', 'sound', 'other'],
    default: 'photo'
  },
  dayAssociated: {
    type: String,
    enum: ['rose', 'propose', 'chocolate', 'teddy', 'promise', 'hug', 'kiss', 'valentine', null],
    default: null
  },
  description: String,
  uploadedBy: {
    type: String,
    default: 'Adi'
  }
}, { timestamps: true })

const Media = mongoose.model('Media', mediaSchema)

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '❤️ Server is running' })
})

// Get high scores for a specific game
app.get('/api/scores/:gameType', async (req, res) => {
  try {
    const { gameType } = req.params
    const limit = parseInt(req.query.limit) || 10
    
    const scores = await Score.find({ gameType })
      .sort({ score: -1 })
      .limit(limit)
      .select('-__v')
    
    res.json({
      success: true,
      gameType,
      scores
    })
  } catch (error) {
    console.error('Error fetching scores:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scores'
    })
  }
})

// Get personal best for a player
app.get('/api/scores/:gameType/player/:playerName', async (req, res) => {
  try {
    const { gameType, playerName } = req.params
    
    const personalBest = await Score.findOne({ gameType, playerName })
      .sort({ score: -1 })
      .select('-__v')
    
    res.json({
      success: true,
      gameType,
      playerName,
      personalBest: personalBest || null
    })
  } catch (error) {
    console.error('Error fetching personal best:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch personal best'
    })
  }
})

// Save a new score
app.post('/api/scores', async (req, res) => {
  try {
    console.log('POST /api/scores body:', req.body)
    const { gameType, playerName, score, metadata } = req.body
    
    // Validation: allow zero scores (0 is a valid score)
    if (!gameType || score === undefined || score === null) {
      return res.status(400).json({
        success: false,
        error: 'gameType and score are required'
      })
    }

    if (typeof score !== 'number') {
      // try to coerce numeric strings
      const parsed = Number(score)
      if (Number.isFinite(parsed)) {
        req.body.score = parsed
      } else {
        return res.status(400).json({ success: false, error: 'Score must be a number' })
      }
    }

    if (req.body.score < 0) {
      return res.status(400).json({
        success: false,
        error: 'Score must be non-negative'
      })
    }
    
    const newScore = new Score({
      gameType,
      playerName: playerName || 'Ayushi',
      score,
      metadata: metadata || {}
    })
    
    await newScore.save()
    
    // Check if this is a new high score
    const highScores = await Score.find({ gameType })
      .sort({ score: -1 })
      .limit(1)
    
    const isHighScore = highScores.length > 0 && newScore.score >= highScores[0].score
    
    res.status(201).json({
      success: true,
      message: 'Score saved successfully',
      score: newScore,
      isHighScore
    })
  } catch (error) {
    console.error('Error saving score:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to save score'
    })
  }
})

// Get all-time leaderboard across all games
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    
    const allScores = await Score.find()
      .sort({ score: -1 })
      .limit(limit)
      .select('-__v')
    
    res.json({
      success: true,
      leaderboard: allScores
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    })
  }
})

// Get statistics for a specific game
app.get('/api/stats/:gameType', async (req, res) => {
  try {
    const { gameType } = req.params
    
    const stats = await Score.aggregate([
      { $match: { gameType } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          highestScore: { $max: '$score' },
          averageScore: { $avg: '$score' },
          lowestScore: { $min: '$score' }
        }
      }
    ])
    
    res.json({
      success: true,
      gameType,
      stats: stats[0] || {
        totalGames: 0,
        highestScore: 0,
        averageScore: 0,
        lowestScore: 0
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    })
  }
})

// Delete all scores (admin/testing only)
app.delete('/api/scores/reset/:gameType', async (req, res) => {
  try {
    const { gameType } = req.params
    const { confirm } = req.query
    
    if (confirm !== 'yes') {
      return res.status(400).json({
        success: false,
        error: 'Please confirm reset by adding ?confirm=yes'
      })
    }
    
    const result = await Score.deleteMany({ gameType })
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} scores for ${gameType}`
    })
  } catch (error) {
    console.error('Error resetting scores:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to reset scores'
    })
  }
})

// ==================== MEDIA ROUTES ====================

// Upload media files (photos/sounds)
app.post('/api/media/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      })
    }

    // Save metadata to Media collection
    const media = new Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileId: req.file.id,
      contentType: req.file.contentType,
      size: req.file.size,
      category: req.file.metadata.category,
      dayAssociated: req.body.dayAssociated || null,
      description: req.body.description || '',
      uploadedBy: req.body.uploadedBy || 'Adi'
    })

    await media.save()

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: req.file.id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        contentType: req.file.contentType,
        size: req.file.size,
        category: req.file.metadata.category,
        url: `/api/media/${req.file.filename}`
      }
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to upload file'
    })
  }
})

// Upload multiple files at once
app.post('/api/media/upload-multiple', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      })
    }

    const mediaRecords = []

    for (const file of req.files) {
      const media = new Media({
        filename: file.filename,
        originalName: file.originalname,
        fileId: file.id,
        contentType: file.contentType,
        size: file.size,
        category: file.metadata.category,
        dayAssociated: req.body.dayAssociated || null,
        description: req.body.description || '',
        uploadedBy: req.body.uploadedBy || 'Adi'
      })

      await media.save()
      mediaRecords.push({
        id: file.id,
        filename: file.filename,
        originalName: file.originalname,
        url: `/api/media/${file.filename}`
      })
    }

    res.status(201).json({
      success: true,
      message: `${req.files.length} files uploaded successfully`,
      files: mediaRecords
    })
  } catch (error) {
    console.error('Error uploading files:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to upload files'
    })
  }
})

// Get all media (with filters)
app.get('/api/media', async (req, res) => {
  try {
    const { category, dayAssociated } = req.query
    const filter = {}
    
    if (category) filter.category = category
    if (dayAssociated) filter.dayAssociated = dayAssociated

    const media = await Media.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v')

    res.json({
      success: true,
      count: media.length,
      media: media.map(m => ({
        ...m.toObject(),
        url: `/api/media/${m.filename}`
      }))
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch media'
    })
  }
})

// Get media file by filename
app.get('/api/media/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename })

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      })
    }

    // Check if file is image or audio
    if (file.contentType.startsWith('image/') || file.contentType.startsWith('audio/')) {
      // Set proper content type
      res.set('Content-Type', file.contentType)
      res.set('Content-Disposition', `inline; filename="${file.metadata?.originalName || file.filename}"`)
      
      // Stream file from GridFS
      const readStream = gridfsBucket.openDownloadStreamByName(req.params.filename)
      readStream.pipe(res)
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type'
      })
    }
  } catch (error) {
    console.error('Error retrieving file:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve file'
    })
  }
})

// Get media by ID
app.get('/api/media/id/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found'
      })
    }

    res.json({
      success: true,
      media: {
        ...media.toObject(),
        url: `/api/media/${media.filename}`
      }
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch media'
    })
  }
})

// Delete media by ID
app.delete('/api/media/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)

    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'Media not found'
      })
    }

    // Delete from GridFS
    await gridfsBucket.delete(media.fileId)

    // Delete metadata
    await Media.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Media deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting media:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete media'
    })
  }
})

// Get media stats
app.get('/api/media/stats/overview', async (req, res) => {
  try {
    const stats = await Media.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      }
    ])

    const totalStats = await Media.aggregate([
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      }
    ])

    res.json({
      success: true,
      stats: {
        byCategory: stats,
        total: totalStats[0] || { totalFiles: 0, totalSize: 0 }
      }
    })
  } catch (error) {
    console.error('Error fetching media stats:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch media stats'
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`💖 Valentine's Day API ready for Ayushi!`)
})
