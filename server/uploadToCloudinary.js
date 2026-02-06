import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadAssets = async () => {
  try {
    console.log('🚀 Starting Cloudinary upload...\n');

    // Upload photos
    const photosDir = path.join(__dirname, '../assets/photos');
    const photoFiles = fs.readdirSync(photosDir).filter(f => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
    );

    console.log(`📸 Found ${photoFiles.length} photos to upload\n`);

    const photoUrls = [];
    for (let i = 0; i < photoFiles.length; i++) {
      const file = photoFiles[i];
      const filePath = path.join(photosDir, file);
      
      console.log(`[${i + 1}/${photoFiles.length}] Uploading ${file}...`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'valentine-ayushi/photos',
        public_id: `photo-${i + 1}`,
        resource_type: 'image',
        overwrite: true
      });
      
      photoUrls.push({
        url: result.secure_url,
        publicId: result.public_id,
        filename: file,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      });
      
      console.log(`   ✅ Uploaded: ${result.secure_url}\n`);
    }

    // Upload sound files
    const soundsDir = path.join(__dirname, '../assets/sounds');
    let soundFiles = [];
    
    if (fs.existsSync(soundsDir)) {
      soundFiles = fs.readdirSync(soundsDir).filter(f => 
        /\.(mp3|wav|ogg|m4a)$/i.test(f)
      );
      
      console.log(`\n🎵 Found ${soundFiles.length} audio files to upload\n`);
    }

    const soundUrls = [];
    for (let i = 0; i < soundFiles.length; i++) {
      const file = soundFiles[i];
      const filePath = path.join(soundsDir, file);
      
      console.log(`[${i + 1}/${soundFiles.length}] Uploading ${file}...`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'valentine-ayushi/sounds',
        public_id: `sound-${i + 1}`,
        resource_type: 'video', // Cloudinary uses 'video' for audio files
        overwrite: true
      });
      
      soundUrls.push({
        url: result.secure_url,
        publicId: result.public_id,
        filename: file,
        format: result.format,
        size: result.bytes,
        duration: result.duration
      });
      
      console.log(`   ✅ Uploaded: ${result.secure_url}\n`);
    }

    // Save URLs to a JSON file for reference
    const outputData = {
      uploadedAt: new Date().toISOString(),
      photos: photoUrls,
      sounds: soundUrls
    };

    const outputPath = path.join(__dirname, 'cloudinary-urls.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

    console.log('\n✨ Upload Summary:');
    console.log(`📸 Photos uploaded: ${photoUrls.length}`);
    console.log(`🎵 Sounds uploaded: ${soundUrls.length}`);
    console.log(`💾 URLs saved to: ${outputPath}`);
    console.log('\n🎉 All assets uploaded successfully to Cloudinary!\n');

    // Display all photo URLs
    console.log('📸 Photo URLs:');
    photoUrls.forEach((photo, index) => {
      console.log(`${index + 1}. ${photo.url}`);
    });

    if (soundUrls.length > 0) {
      console.log('\n🎵 Sound URLs:');
      soundUrls.forEach((sound, index) => {
        console.log(`${index + 1}. ${sound.url}`);
      });
    }

  } catch (error) {
    console.error('❌ Error uploading to Cloudinary:', error);
    process.exit(1);
  }
};

uploadAssets();
