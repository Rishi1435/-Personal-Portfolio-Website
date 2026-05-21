# Rishi Pediredla — Full Stack Developer Portfolio

A premium, cinematic personal portfolio website built with a custom **Black & Emerald Green** aesthetic. Designed with modern web technologies including **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, and **react-scroll-parallax**.

---

## 🚀 Key Features & Animations

### 1. Cinematic Visual Atmosphere
- **Pure Black (#000000) Theme**: High contrast UI with sleek dark components and deep charcoal hover states.
- **Emerald Green (#00C853) Accents**: Smooth radial glow gradients in corners that pulse gently over time.
- **Header Text-Behind-Photo Effect**: Rishi's name rendered in giant, bold display font (*Space Grotesk*) situated *behind* a central overlapping profile photo with a pulsing active glow ring.

### 2. High-Performance Follower Cursor
- Built on an HTML5 `<canvas>` using a custom `requestAnimationFrame` loop.
- Features a trailing follower dot (150ms lerp delay) that generates floating, drifting, and fading emerald particles.
- **Auto-Disabled on Mobile & Touch**: Excludes itself automatically on touch screens to preserve system performance and layout.

### 3. Typographic macOS Terminal Section
- A responsive, glassmorphism macOS-style window card featuring window controls.
- Integrates a scroll-triggered sequential typing typewriter engine using `react-intersection-observer`.
- Types out standard bash commands (`whoami`, `cat about.md`, `cat experience.json`) character-by-character and outputs files/logs before showing an idle blinking command prompt.

### 4. Interactive Skills Arsenal
- Category-grouped skills displayed as floating circular orbs.
- Staggered translateY floating oscillation speeds (custom CSS keyframes) giving a dynamic hovering look.
- Amplified emerald shadow glows and scale operations on cursor hover.

### 5. Custom Animated SVG Projects
- **Qlue (Mock Interview App)**: Embedded custom SVG featuring a pulsing green microphone, staggered audio soundwaves, and a candidate silhouette with a blinking speech bubble.
- **Xpensia (Expense Tracker)**: Embedded custom SVG showing a leather wallet releasing rising gold/emerald coins, alongside an active line chart that draws its trendline in a continuous path loop.

### 6. Accessibility & Media Overrides
- Full support for the global `@media (prefers-reduced-motion: reduce)` media query.
- Automatically disables canvas cursor particles, bypasses the terminal typing delays (renders content instantly), and halts floating translate offsets to ensure accessibility compliance.

---

## 🛠️ Technology Stack

- **Core Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Custom CSS custom properties
- **Animation & Transitions**: Framer Motion, CSS Keyframe Animations
- **Utilities**: react-icons, react-scroll-parallax, react-intersection-observer

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/pediredlarishi/-Personal-Portfolio-Website.git
cd -Personal-Portfolio-Website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 📦 Production Build

To compile a highly optimized production bundle:
```bash
npm run build
```
Vite will compile, compress, and output all assets into the `/dist` directory. You can preview the production bundle locally with:
```bash
npm run preview
```

---

## 🌐 Deployment Configuration

The site is configured for **Vercel** deployment with a `vercel.json` rewrite rule to support single page app routing and prevent 404 reload errors:

```json
{
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📄 License

This project is licensed under the MIT License.
