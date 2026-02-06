# 💖 Valentine's Day Interactive Website for Ayushi

A romantic 8-day journey through Valentine's Week, featuring interactive games, scroll-triggered stories, and personalized experiences—all built with Three.js, GSAP, and lots of love.

## 🌟 Overview

This is a progressive web experience where each day unlocks based on the real calendar date (February 7-14, 2025). Each day features unique interactive content, from games to stories to memories.

**Live Journey**: [https://valentine-ayushi.netlify.app](https://valentine-ayushi.netlify.app) *(deploy to your hosting)*

## 🗓️ The 8-Day Journey

| Date | Day | Experience | Technology |
|------|-----|------------|------------|
| **Feb 7** | 🌹 Rose Day | Flappy Bird-style game with 10 stages | Canvas 2D, Physics Engine |
| **Feb 8** | 💍 Propose Day | Scroll-activated love story (7 chapters) | GSAP ScrollTrigger |
| **Feb 9** | 🍫 Chocolate Day | Interactive chocolate collector (goal: 112) | Three.js particles |
| **Feb 10** | 🧸 Teddy Day | Blinkit-style delivery simulation | Timed UI stages |
| **Feb 11** | 🤝 Promise Day | Two-column promise board | LocalStorage persistence |
| **Feb 12** | 🤗 Hug Day | Photo gallery with memories | Polaroid styling |
| **Feb 13** | 💋 Kiss Day | Click speed challenge game | Real-time scoring |
| **Feb 14** | 💘 Valentine's Day | Grand finale with rickroll & real message | Multi-part surprise |

## 🎮 Features

### Core Mechanics
- **Date-based Unlocking**: Days automatically unlock based on the system date
- **Progress Tracking**: Dashboard shows unlocked/locked days with countdown timers
- **LocalStorage Persistence**: Saves game scores, promises, chocolate count, and visit history
- **Responsive Design**: Works on mobile, tablet, and desktop

### Interactive Elements
- **Three.js Backgrounds**: Dynamic particle systems (hearts, stars, roses, chocolates)
- **Games**: Flappy Love (10 stages), Kiss Clicker (10-second challenge)
- **Animations**: GSAP-powered scroll triggers, confetti explosions, fireworks
- **Audio**: Web Audio API for background music and sound effects
- **Easter Eggs**: Hidden interactions, Konami code, cheeky popups

### Design System
- **Glassmorphism**: Modern frosted glass aesthetic with backdrop filters
- **Color Palette**: Pink/red gradients (`#FF1744`, `#FF4081`, `#F50057`, `#FFD700`)
- **Typography**: Poppins (headings), Inter (body), Dancing Script (romantic)
- **Animations**: 20+ custom CSS animations (heartbeat, float, confetti, etc.)

## 📁 Project Structure

```
valentine-ayushi/
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Router & routes setup
│   ├── index.css              # Global styles & CSS variables
│   ├── App.css                # App-level styles
│   ├── components/
│   │   ├── ThreeBackground.jsx   # Three.js particle effects
│   │   ├── ThreeBackground.css
│   │   ├── Modal.jsx             # Reusable modal with close button
│   │   └── Modal.css
│   └── pages/
│       ├── Landing.jsx           # "Yes/No" proposal page
│       ├── Landing.css
│       ├── Password.jsx          # Password gate ("samosa")
│       ├── Password.css
│       ├── Dashboard.jsx         # 8-day dashboard
│       ├── Dashboard.css
│       └── days/
│           ├── DayPage.jsx       # Shared day page layout
│           ├── DayPage.css
│           ├── RoseDay.jsx       # Flappy Bird game
│           ├── ProposeDay.jsx    # Scroll story
│           ├── ChocolateDay.jsx  # 112 chocolates
│           ├── TeddyDay.jsx      # Blinkit delivery
│           ├── PromiseDay.jsx    # Promise board
│           ├── HugDay.jsx        # Photo gallery
│           ├── KissDay.jsx       # Click challenge
│           └── ValentineDay.jsx  # Grand finale
├── assets/
│   ├── photos/            # Photo gallery images
│   └── sounds/            # Audio files (optional)
├── index.html             # React app entry (single HTML)
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies & scripts
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone/Download the repository**
   ```bash
   git clone <your-repo-url>
   cd valentine-ayushi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Vite will automatically open `http://localhost:5173`
   - Or manually navigate to the URL shown in terminal

5. **Add your photos** (optional but recommended)
   - Place 8 photos in `assets/photos/` named `memory1.jpg` through `memory8.jpg`
   - Photos will appear in the Hug Day gallery

## 🎯 How to Use

### Unlocking Days
- Days unlock automatically based on your system date
- **Testing Mode**: To test all days, modify `unlockService.js`:
  ```javascript
  // Change this line (around line 16):
  isUnlocked(dayKey) {
    return true; // Force unlock all days for testing
  }
  ```

### Playing Games
- **Rose Day**: Press SPACE to jump, avoid obstacles, reach stage 10
- **Kiss Day**: Click the heart as fast as possible for 10 seconds

### Saving Data
All progress is saved automatically:
- Game high scores
- Chocolate count
- Promises (editable on Promise Day)
- Visit tracking

## 🛠️ Technologies Used

### Frontend Framework
- **React 18**: Modern component-based UI
- **React Router v6**: Client-side routing
- **Vite 5**: Lightning-fast build tool & dev server

### Libraries
- **Three.js 0.160**: 3D graphics and particle systems
- **GSAP 3.12**: Animation engine with ScrollTrigger
- **Framer Motion 11**: Smooth page transitions & animations
- **Lucide React**: Beautiful icon library

### Design
- **Glassmorphism**: Modern UI with frosted glass effects
- **CSS Variables**: Dynamic theming system
- **Responsive Design**: Mobile-first approach with clamp()

## 🎨 Customization Guide

### Chsrc/index.css` (CSS variables at top):
```css
:root {
  --primary: #FF1744;      /* Main pink */
  --secondary: #FF4081;    /* Lighter pink */
  --accent: #F50057;       /* Deep pink */
  --gold: #FFD700;         /* Gold accents */
}
```

### Modify Unlock Dates
Edit `src/pages/Dashboard.jsx` (daysData array):
```javascript
const daysData = [
  { id: 'rose_day', date: '2026-02-07', ... },
  { id: 'propose_day', date: '2026-02-08', ... },
  // ... change dates here
]
```

### Update Final Message
Edit `src/pages/days/ValentineDay.jsx` to customize the finale message>
```

## 📱 Mobile Optimization

- **Responsive Breakpoints**: 1200px, 768px, 480px
- **Touch-friendly**: Large tap targets (min 44x44px)
- **Performance**: Reduced particle counts on mobile
- **Viewport Units**: Fluid typography using clamp()

## 🐛 Troubleshooting

### Days Not Unlocking?
- Check your system date is correct
- Enable testing mode in `unlockService.js`
- Clear localStorage: `localStorage.clear()` in console

### Games Not Working?
- Check browser console for errors
- Ensure JavaScript is enabled
- Try a different browser (Chrome recommended)

### Three.js Not Loading?
- Check internet connection (CDN dependency)
- Use local Three.js file: Download from [threejs.org](https://threejs.org/)

### Photos Not Showing?
- Verify file paths in `assets/photos/`
- Check image formats (jpg, png, webp supported)
- Edit `src/pages/Dashboard.jsx` and modify `isUnlocked()` to return `true` for testing
- Clear localStorage: `localStorage.clear()` in browser console

### Vite Dev Server Not Starting?
- Ensure Node.js 18+ is installed
- Delete `node_modules` and run `npm install` again
- Try `npx vite` directly

### Build Errors?
- Check all imports are correct
- Ensure all dependencies are installed
- Run `npm run build` to see detailed errors
## 📊 LocalStorage Data

The site stores the following data locally:
```javascript
{
  "valentine_password_correct": true,
  "valentine_welcome_seen": true,
  "valentine_game_scores": { /* high scores */ },
  "valentine_chocolate_count": 112,
  "valentine_promises_ayushi": [ /* custom promises */ ],
  "valentine_visits": { /* page visit counts */ },
  "valentine_achievements": [ /* unlocked achievements */ ]
}
```

**To reset everything**: Open browser console and run:
```javascript
localStorage.clear();
location.reload();
```

## 🚢 Deployment
Build for Production
```bash
npm run build
```
This creates an optimized build in the `dist/` folder.

### Netlify (Recommended)
1. Run `npm run build`
2. Deploy the `dist` folder to [netlify.com](https://netlify.com)
3. Or connect your Git repo for auto-deployment

### Vercel
```bash
npm install -g vercel
vercel
```
Vercel will automatically detect Vite and build correctly.

### GitHub Pages
```bash
npm run build
# Deploy the dist/ folder to gh-pages branch
```

### Preview Build Locally
```bash
npm run preview
``host
- Example: `valentine.yourdomain.com`

## 📝 Credits
React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Three.js](https://threejs.org/) - WebGL 3D library
- [GSAP](https://greensock.com/gsap/) - Animation platform
- [Framer Motion](https://www.framer.com/motion/) - React animations
- [Lucide](https://lucide.dev/) - Icon library

- **Concept & Design**: Aditya
- **Development**: Aditya
- **Inspiration**: 8 years of memories
- **Special Thanks**: Samosas for being delicious

### Libraries Used
- [Three.js](https://threejs.org/) - WebGL 3D library
- [GSAP](https://greensock.com/gsap/) - Animation platform
- [Google Fonts](https://fonts.google.com/) - Typography

## 📄 License

This project is a personal gift and is not licensed for redistribution. 
Feel free to use the code structure for your own romantic projects! 💝

## 🤝 Support

For issues or questions:
- Check the troubleshooting section above
- Inspect browser console for errors
- Ensure all files are properly uploaded

## 🎉 Final Notes

This website was built from scratch with no templates—just pure code and love. 
Every line was written thinking about you, Ayushi. 

Here's to our journey together! 💖

---

**Last Updated**: February 2025  
**Version**: 1.0.0  
**Status**: Complete & Ready for Valentine's Day 💘
