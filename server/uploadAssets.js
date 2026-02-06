import mongoose from 'mongoose'
import { GridFsStorage } from 'multer-gridfs-storage'
import Grid from 'gridfs-stream'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/valentine-ayushi'

// Media Metadata Schema
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

// Connect to MongoDB
const conn = await mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

console.log('✅ Connected to MongoDB')

// Initialize GridFS
const gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
  bucketName: 'uploads'
})

const gfs = Grid(mongoose.connection.db, mongoose.mongo)
gfs.collection('uploads')

// Function to get content type from file extension
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg'
  }
  return types[ext] || 'application/octet-stream'
}

// Function to upload a single file
async function uploadFile(filePath, category, dayAssociated = null, description = '') {
  return new Promise((resolve, reject) => {
    const filename = path.basename(filePath)
    const newFilename = `${Date.now()}-${filename}`
    const contentType = getContentType(filename)

    // Create read stream
    const readStream = fs.createReadStream(filePath)

    // Create write stream to GridFS
    const uploadStream = gridfsBucket.openUploadStream(newFilename, {
      contentType: contentType,
      metadata: {
        uploadedBy: 'Adi',
        category: category,
        description: description,
        dayAssociated: dayAssociated,
        originalName: filename
      }
    })

    readStream.pipe(uploadStream)

    uploadStream.on('finish', async () => {
      try {
        // Get file size
        const stats = fs.statSync(filePath)

        // Save metadata
        const media = new Media({
          filename: newFilename,
          originalName: filename,
          fileId: uploadStream.id,
          contentType: contentType,
          size: stats.size,
          category: category,
          dayAssociated: dayAssociated,
          description: description,
          uploadedBy: 'Adi'
        })

        await media.save()

        console.log(`✅ Uploaded: ${filename} (${(stats.size / 1024).toFixed(2)} KB)`)
        resolve({
          filename: newFilename,
          originalName: filename,
          size: stats.size,
          fileId: uploadStream.id
        })
      } catch (error) {
        reject(error)
      }
    })

    uploadStream.on('error', (error) => {
      console.error(`❌ Error uploading ${filename}:`, error)
      reject(error)
    })
  })
}

// Main upload function
async function uploadAllAssets() {
  try {
    console.log('\n🚀 Starting asset upload to MongoDB...\n')

    const assetsPath = path.join(__dirname, '..', 'assets')
    const photosPath = path.join(assetsPath, 'photos')
    const soundsPath = path.join(assetsPath, 'sounds')

    let totalUploaded = 0
    let totalSize = 0

    // Upload photos
    console.log('📸 Uploading photos...')
    if (fs.existsSync(photosPath)) {
      const photos = fs.readdirSync(photosPath).filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext)
      })

      for (const photo of photos) {
        try {
          const result = await uploadFile(
            path.join(photosPath, photo),
            'photo',
            'hug', // Assign to hug day (photo gallery)
            'Beautiful memory with Ayushi'
          )
          totalUploaded++
          totalSize += result.size
        } catch (error) {
          console.error(`Failed to upload ${photo}:`, error.message)
        }
      }
    }

    // Upload sounds
    console.log('\n🎵 Uploading sounds...')
    if (fs.existsSync(soundsPath)) {
      const sounds = fs.readdirSync(soundsPath).filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ['.mp3', '.wav', '.ogg'].includes(ext)
      })

      for (const sound of sounds) {
        try {
          const result = await uploadFile(
            path.join(soundsPath, sound),
            'sound',
            null, // Can be used for background music
            'Background music for Valentine\'s Day'
          )
          totalUploaded++
          totalSize += result.size
        } catch (error) {
          console.error(`Failed to upload ${sound}:`, error.message)
        }
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✨ Upload Complete!`)
    console.log(`📊 Total files uploaded: ${totalUploaded}`)
    console.log(`💾 Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`)
    console.log('='.repeat(50) + '\n')

    // Display stats
    const stats = await Media.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      }
    ])

    console.log('📈 Database Stats:')
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} files (${(stat.totalSize / (1024 * 1024)).toFixed(2)} MB)`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error during upload:', error)
    process.exit(1)
  }
}

// Run the upload
uploadAllAssets()
