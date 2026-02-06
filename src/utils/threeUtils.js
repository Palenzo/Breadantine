// Three.js Scene Utilities
import * as THREE from 'three'

/**
 * Create a floating hearts particle system
 */
export const createHeartsParticles = (scene, count = 100) => {
  const heartsGroup = new THREE.Group()
  
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  
  // Draw heart shape
  ctx.fillStyle = '#FF1744'
  ctx.beginPath()
  ctx.moveTo(32, 20)
  ctx.bezierCurveTo(32, 12, 24, 8, 16, 8)
  ctx.bezierCurveTo(8, 8, 4, 12, 4, 20)
  ctx.bezierCurveTo(4, 28, 8, 32, 16, 40)
  ctx.lineTo(32, 56)
  ctx.lineTo(48, 40)
  ctx.bezierCurveTo(56, 32, 60, 28, 60, 20)
  ctx.bezierCurveTo(60, 12, 56, 8, 48, 8)
  ctx.bezierCurveTo(40, 8, 32, 12, 32, 20)
  ctx.fill()
  
  const texture = new THREE.CanvasTexture(canvas)
  
  for (let i = 0; i < count; i++) {
    const geometry = new THREE.PlaneGeometry(0.5, 0.5)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: Math.random() * 0.5 + 0.3
    })
    
    const heart = new THREE.Mesh(geometry, material)
    heart.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30
    )
    heart.rotation.z = Math.random() * Math.PI * 2
    heart.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.02 + 0.01,
        (Math.random() - 0.5) * 0.02
      ),
      rotationSpeed: (Math.random() - 0.5) * 0.02
    }
    
    heartsGroup.add(heart)
  }
  
  scene.add(heartsGroup)
  return heartsGroup
}

/**
 * Animate hearts particles
 */
export const animateHearts = (heartsGroup) => {
  heartsGroup.children.forEach((heart) => {
    heart.position.add(heart.userData.velocity)
    heart.rotation.z += heart.userData.rotationSpeed
    
    // Reset position if out of bounds
    if (heart.position.y > 15) {
      heart.position.y = -15
    }
    if (Math.abs(heart.position.x) > 15) {
      heart.position.x = (Math.random() - 0.5) * 30
    }
    if (Math.abs(heart.position.z) > 15) {
      heart.position.z = (Math.random() - 0.5) * 30
    }
  })
  
  heartsGroup.rotation.y += 0.0005
}

/**
 * Create starfield background
 */
export const createStarfield = (scene, count = 1000) => {
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const colors = []
  
  for (let i = 0; i < count; i++) {
    positions.push(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    )
    
    const color = new THREE.Color()
    color.setHSL(Math.random() * 0.1 + 0.9, 0.8, 0.8)
    colors.push(color.r, color.g, color.b)
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  
  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  })
  
  const stars = new THREE.Points(geometry, material)
  scene.add(stars)
  
  return stars
}

/**
 * Create romantic gradient background
 */
export const createRomanticBackground = (scene) => {
  const geometry = new THREE.SphereGeometry(50, 32, 32)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        vec3 color1 = vec3(1.0, 0.09, 0.27); // #FF1744
        vec3 color2 = vec3(1.0, 0.25, 0.51); // #FF4081
        vec3 color3 = vec3(1.0, 0.88, 0.91); // #FFE0E9
        
        float wave = sin(vUv.y * 3.14159 + time * 0.5) * 0.5 + 0.5;
        vec3 color = mix(color1, color2, vUv.y);
        color = mix(color, color3, wave * 0.3);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    side: THREE.BackSide
  })
  
  const sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)
  
  return sphere
}

/**
 * Create interactive light that follows mouse
 */
export const createInteractiveLight = (scene) => {
  const light = new THREE.PointLight(0xFF1744, 2, 50)
  light.position.set(0, 0, 10)
  scene.add(light)
  
  return light
}

/**
 * Update light position based on mouse
 */
export const updateInteractiveLight = (light, mouseX, mouseY) => {
  light.position.x = mouseX * 10
  light.position.y = mouseY * 10
}

/**
 * Create rose petals falling effect
 */
export const createRosePetals = (scene, count = 50) => {
  const petalsGroup = new THREE.Group()
  
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  
  // Draw petal shape
  ctx.fillStyle = '#FF1744'
  ctx.beginPath()
  ctx.ellipse(16, 16, 12, 16, 0, 0, Math.PI * 2)
  ctx.fill()
  
  const texture = new THREE.CanvasTexture(canvas)
  
  for (let i = 0; i < count; i++) {
    const geometry = new THREE.PlaneGeometry(0.3, 0.4)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: Math.random() * 0.4 + 0.4
    })
    
    const petal = new THREE.Mesh(geometry, material)
    petal.position.set(
      (Math.random() - 0.5) * 20,
      Math.random() * 20 + 10,
      (Math.random() - 0.5) * 10
    )
    petal.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        -(Math.random() * 0.02 + 0.01),
        (Math.random() - 0.5) * 0.01
      ),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      )
    }
    
    petalsGroup.add(petal)
  }
  
  scene.add(petalsGroup)
  return petalsGroup
}

/**
 * Animate rose petals
 */
export const animateRosePetals = (petalsGroup) => {
  petalsGroup.children.forEach((petal) => {
    petal.position.add(petal.userData.velocity)
    petal.rotation.x += petal.userData.rotationSpeed.x
    petal.rotation.y += petal.userData.rotationSpeed.y
    petal.rotation.z += petal.userData.rotationSpeed.z
    
    // Reset if fallen
    if (petal.position.y < -10) {
      petal.position.y = 20
      petal.position.x = (Math.random() - 0.5) * 20
    }
  })
}

/**
 * Create chocolate rain
 */
export const createChocolates = (scene, count = 30) => {
  const chocolatesGroup = new THREE.Group()
  
  for (let i = 0; i < count; i++) {
    const geometry = new THREE.BoxGeometry(0.4, 0.3, 0.2)
    const material = new THREE.MeshStandardMaterial({
      color: 0x4B2D1F,
      metalness: 0.3,
      roughness: 0.7
    })
    
    const chocolate = new THREE.Mesh(geometry, material)
    chocolate.position.set(
      (Math.random() - 0.5) * 20,
      Math.random() * 20 - 10,
      (Math.random() - 0.5) * 10
    )
    chocolate.userData = {
      velocity: -(Math.random() * 0.05 + 0.03),
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      initialY: chocolate.position.y
    }
    
    chocolatesGroup.add(chocolate)
  }
  
  scene.add(chocolatesGroup)
  return chocolatesGroup
}

/**
 * Spawn new chocolate at click position
 */
export const spawnChocolate = (scene, chocolatesGroup, x, y, camera) => {
  const vector = new THREE.Vector3(x, y, 0.5)
  vector.unproject(camera)
  
  const geometry = new THREE.BoxGeometry(0.4, 0.3, 0.2)
  const material = new THREE.MeshStandardMaterial({
    color: 0x4B2D1F,
    metalness: 0.3,
    roughness: 0.7
  })
  
  const chocolate = new THREE.Mesh(geometry, material)
  chocolate.position.copy(vector)
  chocolate.position.z = 0
  chocolate.userData = {
    velocity: -0.1,
    rotationSpeed: (Math.random() - 0.5) * 0.1,
    spawned: true
  }
  
  chocolatesGroup.add(chocolate)
  
  // Remove after falling
  setTimeout(() => {
    chocolatesGroup.remove(chocolate)
    geometry.dispose()
    material.dispose()
  }, 5000)
}

/**
 * Animate chocolates
 */
export const animateChocolates = (chocolatesGroup) => {
  chocolatesGroup.children.forEach((chocolate) => {
    chocolate.position.y += chocolate.userData.velocity
    chocolate.rotation.y += chocolate.userData.rotationSpeed
    
    if (chocolate.position.y < -15 && !chocolate.userData.spawned) {
      chocolate.position.y = 15
      chocolate.position.x = (Math.random() - 0.5) * 20
    }
  })
}

/**
 * Create constellation for initials
 */
export const createConstellation = (scene, initials = 'A+A') => {
  const starsGroup = new THREE.Group()
  const linesGroup = new THREE.Group()
  
  // Define star positions for letters
  const positions = {
    'A': [
      [0, 2], [1, 0], [2, 2], [-1, 1], [1, 1]
    ],
    '+': [
      [4, 1], [5, 1], [6, 1], [5, 0], [5, 2]
    ],
    'A2': [
      [8, 2], [9, 0], [10, 2], [8, 1], [10, 1]
    ]
  }
  
  const allPositions = [
    ...positions['A'],
    ...positions['+'],
    ...positions['A2']
  ]
  
  // Create stars
  allPositions.forEach((pos) => {
    const geometry = new THREE.SphereGeometry(0.15, 16, 16)
    const material = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.9
    })
    
    const star = new THREE.Mesh(geometry, material)
    star.position.set(pos[0] - 5, pos[1], -5)
    starsGroup.add(star)
  })
  
  // Create connecting lines
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.5
  })
  
  // Connect stars for each letter
  const connections = [
    [0, 4, 1], [1, 2], [4, 3], // First A
    [5, 6, 7, 8, 9, 8, 6], // +
    [10, 14, 11], [11, 12], [14, 13] // Second A
  ]
  
  connections.forEach(conn => {
    const points = conn.map(i => starsGroup.children[i].position)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(geometry, lineMaterial)
    linesGroup.add(line)
  })
  
  scene.add(starsGroup)
  scene.add(linesGroup)
  
  return { stars: starsGroup, lines: linesGroup }
}

/**
 * Create pulsing heart
 */
export const createPulsingHeart = (scene, color = 0xFF1744) => {
  const shape = new THREE.Shape()
  
  const x = 0, y = 0
  shape.moveTo(x + 0.5, y + 0.5)
  shape.bezierCurveTo(x + 0.5, y + 0.25, x + 0.25, y, x, y)
  shape.bezierCurveTo(x - 0.5, y, x - 0.5, y + 0.5, x - 0.5, y + 0.5)
  shape.bezierCurveTo(x - 0.5, y + 0.75, x - 0.25, y + 1, x, y + 1.25)
  shape.bezierCurveTo(x + 0.25, y + 1, x + 0.5, y + 0.75, x + 0.5, y + 0.5)
  shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.5, y + 0.25, x + 0.5, y + 0.5)
  
  const geometry = new THREE.ShapeGeometry(shape)
  const material = new THREE.MeshBasicMaterial({ color })
  
  const heart = new THREE.Mesh(geometry, material)
  heart.scale.set(2, 2, 1)
  
  scene.add(heart)
  return heart
}

/**
 * Animate pulsing heart
 */
export const animatePulsingHeart = (heart, time) => {
  const scale = 2 + Math.sin(time * 2) * 0.2
  heart.scale.set(scale, scale, 1)
  heart.rotation.z = Math.sin(time) * 0.1
}

export default {
  createHeartsParticles,
  animateHearts,
  createStarfield,
  createRomanticBackground,
  createInteractiveLight,
  updateInteractiveLight,
  createRosePetals,
  animateRosePetals,
  createChocolates,
  spawnChocolate,
  animateChocolates,
  createConstellation,
  createPulsingHeart,
  animatePulsingHeart
}
