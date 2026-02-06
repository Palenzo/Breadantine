import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './ThreeBackground.css'

const ThreeBackground = ({ type = 'hearts', intensity = 'normal' }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.position.z = 5

    // Create flower/particle textures based on type
    const createFlowerTexture = (flowerType) => {
      const canvas = document.createElement('canvas')
      canvas.width = 64
      canvas.height = 64
      const ctx = canvas.getContext('2d')
      
      if (flowerType === 'flowers' || flowerType === 'roses' || flowerType === 'cherry' || flowerType === 'lotus' || flowerType === 'sunflower') {
        // Draw beautiful flower
        const centerX = 32, centerY = 32
        const petalCount = flowerType === 'sunflower' ? 12 : flowerType === 'lotus' ? 8 : 5
        const petalRadius = flowerType === 'sunflower' ? 16 : 12
        
        // Petals
        for (let i = 0; i < petalCount; i++) {
          const angle = (i * 2 * Math.PI) / petalCount
          ctx.save()
          ctx.translate(centerX, centerY)
          ctx.rotate(angle)
          
          const gradient = ctx.createRadialGradient(0, -petalRadius, 0, 0, -petalRadius, petalRadius)
          
          if (flowerType === 'roses') {
            gradient.addColorStop(0, 'rgba(255, 23, 68, 0.9)')
            gradient.addColorStop(1, 'rgba(255, 64, 129, 0.3)')
          } else if (flowerType === 'cherry') {
            gradient.addColorStop(0, 'rgba(255, 182, 193, 0.9)')
            gradient.addColorStop(1, 'rgba(255, 192, 203, 0.3)')
          } else if (flowerType === 'lotus') {
            gradient.addColorStop(0, 'rgba(255, 240, 245, 0.9)')
            gradient.addColorStop(1, 'rgba(255, 182, 193, 0.3)')
          } else if (flowerType === 'sunflower') {
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)')
            gradient.addColorStop(1, 'rgba(255, 165, 0, 0.3)')
          } else {
            gradient.addColorStop(0, 'rgba(255, 64, 129, 0.9)')
            gradient.addColorStop(1, 'rgba(245, 0, 87, 0.3)')
          }
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.ellipse(0, -petalRadius, petalRadius * 0.6, petalRadius, 0, 0, 2 * Math.PI)
          ctx.fill()
          ctx.restore()
        }
        
        // Center
        const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 6)
        if (flowerType === 'sunflower') {
          centerGradient.addColorStop(0, 'rgba(139, 69, 19, 1)')
          centerGradient.addColorStop(1, 'rgba(160, 82, 45, 0.8)')
        } else {
          centerGradient.addColorStop(0, 'rgba(255, 215, 0, 1)')
          centerGradient.addColorStop(1, 'rgba(255, 193, 7, 0.8)')
        }
        ctx.fillStyle = centerGradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI)
        ctx.fill()
      } else {
        // Hearts
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
        gradient.addColorStop(0, 'rgba(255, 23, 68, 0.9)')
        gradient.addColorStop(1, 'rgba(255, 64, 129, 0.3)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(32, 32, 24, 0, 2 * Math.PI)
        ctx.fill()
      }
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return texture
    }

    // Particle system
    const particleCount = intensity === 'high' ? 500 : intensity === 'low' ? 200 : 350
    const particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const rotations = new Float32Array(particleCount)

    // Color palettes for different flower types
    const colorPalettes = {
      roses: [0xFF1744, 0xFF4081, 0xF50057, 0xFF69B4],
      cherry: [0xFFB6C1, 0xFFC0CB, 0xFFE4E1, 0xFFF0F5],
      lotus: [0xFFF0F5, 0xFFB6C1, 0xF8BBD0, 0xFFFFFF],
      sunflower: [0xFFD700, 0xFFA500, 0xFFE4B5, 0xFFEFD5],
      flowers: [0xFF1744, 0xFF4081, 0xF50057, 0xFFD700, 0xFFB6C1],
      hearts: [0xFF1744, 0xFF4081, 0xF50057, 0xFFD700]
    }
    
    const colorPalette = colorPalettes[type] || colorPalettes.hearts

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20

      const color = new THREE.Color()
      color.setHex(colorPalette[Math.floor(Math.random() * colorPalette.length)])
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = Math.random() * 0.5 + 0.2
      rotations[i] = Math.random() * Math.PI * 2
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const flowerTexture = createFlowerTexture(type)

    const particleMaterial = new THREE.PointsMaterial({
      size: type.includes('flower') || type === 'roses' || type === 'cherry' || type === 'lotus' || type === 'sunflower' ? 0.3 : 0.15,
      map: flowerTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    })

    const particleSystem = new THREE.Points(particles, particleMaterial)
    scene.add(particleSystem)

    // Animation
    let animationId
    const animate = () => {
      particleSystem.rotation.y += 0.0003
      particleSystem.rotation.x += 0.0001

      const positions = particleSystem.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        // Gentle floating motion
        positions[i + 1] += Math.sin(Date.now() * 0.0005 + i) * 0.002
        // Slight horizontal sway
        positions[i] += Math.cos(Date.now() * 0.0003 + i) * 0.001
      }
      particleSystem.geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      particleMaterial.dispose()
      particles.dispose()
      flowerTexture.dispose()
    }
  }, [type, intensity])

  return <canvas ref={canvasRef} className="three-background" />
}

export default ThreeBackground
