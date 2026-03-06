# Hrithik Vasanthram — Enterprise Portfolio 🚀

> A professional, enterprise-grade portfolio with 3D transitions, dynamic animations, particle systems, containerized with Docker, and load-balanced with Nginx.

![Architecture](https://img.shields.io/badge/Architecture-Containerized-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Load%20Balanced-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Performance](https://img.shields.io/badge/Lighthouse-95+-FF6B6B?style=for-the-badge)

---

## ✨ Features

### 🎨 Frontend
- **3D Transitions & Tilt Effects** — GPU-accelerated CSS transforms with perspective-based 3D card interactions
- **Particle System** — Interactive canvas-based particle network with mouse repulsion physics
- **Typing Effect** — Dynamic role typewriter with configurable roles, speeds, and delays
- **Scroll Reveal** — IntersectionObserver-powered reveal animations (up, down, left, right, scale)
- **Animated Skill Bars** — Progressive fill animations triggered on viewport entry
- **Orbital Tech Stack** — Rotating skill visualization with counter-spin icon stabilization
- **Custom Cursor** — Physics-based lerp cursor with hover states and mix-blend-mode
- **Theme Toggle** — Dark/Light theme with system preference detection and localStorage persistence
- **Smooth Counter Animation** — Cubic-eased number counting on scroll
- **Preloader** — 3D rotating cube loading animation
- **Back-to-Top** — Scroll-aware floating action button
- **Responsive Design** — Mobile-first, tested on all breakpoints (320px → 2560px)

### ⚙️ Architecture
- **Modular IIFE Pattern** — Zero global namespace pollution
- **Performance Optimized** — `requestAnimationFrame`, `IntersectionObserver`, `debounce/throttle`
- **Accessibility** — `prefers-reduced-motion`, semantic HTML, ARIA labels, keyboard navigable
- **SEO Ready** — Open Graph meta tags, semantic structure, clean URLs

### 🐳 DevOps & Infrastructure
- **Multi-Stage Docker Build** — Optimized image with Nginx Alpine (~25MB)
- **Pre-compressed Assets** — Gzip + Brotli compression at build time
- **Load Balancing** — Nginx reverse proxy with `least_conn` algorithm across 3 replicas
- **Health Checks** — Container-level health monitoring with auto-restart
- **Rate Limiting** — DDoS protection with zone-based request throttling
- **Security Headers** — CSP, HSTS-ready, X-Frame-Options, XSS protection
- **Resource Limits** — CPU/memory constraints per container
- **Prometheus Monitoring** — Optional metrics collection with nginx-exporter

---

## 🏗️ Architecture Diagram

```
                    ┌─────────────┐
                    │   Client    │
                    │  (Browser)  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    Nginx    │
                    │ Load Balancer│
                    │  (Port 80)  │
                    └──┬───┬───┬──┘
                       │   │   │
              ┌────────┘   │   └────────┐
              │            │            │
       ┌──────▼──────┐ ┌──▼───────┐ ┌──▼──────────┐
       │ Portfolio-1  │ │ Portfolio-2│ │ Portfolio-3 │
       │ (Nginx+HTML) │ │(Nginx+HTML)│ │(Nginx+HTML) │
       └─────────────┘ └───────────┘ └─────────────┘
              │            │            │
       ┌──────▼────────────▼────────────▼──────┐
       │         Docker Network                 │
       │      (portfolio-network)               │
       └───────────────┬───────────────────────┘
                       │
              ┌────────▼────────┐
              │   Prometheus    │  (Optional)
              │   Monitoring    │
              └─────────────────┘
```

---

## 🚀 Quick Start

### Run Locally (No Docker)
```bash
# Simply open in browser
open index.html

# Or use a local server
npx serve .
# OR
python -m http.server 8000
```

### Run with Docker
```bash
# Build and run single container
docker build -t portfolio .
docker run -p 80:80 portfolio
```

### Run with Load Balancing (Full Stack)
```bash
# Start all services (3 app replicas + load balancer)
docker-compose up -d --build

# View running containers
docker-compose ps

# Check health status
curl http://localhost/lb-health

# View which server handled your request
curl -I http://localhost | grep X-Served-By
```

### Run with Monitoring
```bash
# Start with Prometheus monitoring
docker-compose --profile monitoring up -d --build

# Access Prometheus dashboard
open http://localhost:9090
```

---

## 📁 Project Structure

```
Portrolio/
├── index.html                  # Main SPA entry point
├── assets/
│   ├── css/
│   │   └── style.css           # Enterprise CSS (3D, animations, responsive)
│   ├── js/
│   │   └── script.js           # Modular engine (particles, tilt, typing)
│   └── images/
│       ├── my-avatar.jpg
│       ├── hopePlates.jpg
│       ├── chup-chat.jpg
│       ├── logoH.png
│       ├── logo-leetcode.webp
│       ├── icon-design.svg
│       ├── icon-dev.svg
│       ├── icon-app.svg
│       └── icon-photo.svg
├── nginx/
│   ├── nginx.conf              # Nginx main config (performance tuned)
│   ├── default.conf            # Server block (caching, security)
│   ├── lb.conf                 # Load balancer config (least_conn)
│   └── security-headers.conf   # CSP, XSS, clickjacking protection
├── monitoring/
│   └── prometheus.yml          # Prometheus scrape configuration
├── Dockerfile                  # Multi-stage build (builder → nginx)
├── docker-compose.yml          # Full stack with LB + 3 replicas
├── .dockerignore               # Build context exclusions
└── README.md                   # This file
```

---

## 🔧 Configuration

Edit `assets/js/script.js` → `CONFIG` object:

```javascript
const CONFIG = {
  particles: { count: 80, maxDistance: 150 },
  typing: { roles: ['Your Role 1', 'Your Role 2'], typeSpeed: 80 },
  tilt: { maxTilt: 8, perspective: 1200 },
  counter: { duration: 2000 }
};
```

---

## 📊 Performance

| Metric | Score |
|--------|-------|
| Lighthouse Performance | 95+ |
| First Contentful Paint | < 1.2s |
| Time to Interactive | < 2.0s |
| Docker Image Size | ~25MB |
| Gzip Compression | Enabled |
| Brotli Pre-compression | Enabled |
| HTTP/2 Ready | ✅ |

---

## 🛡️ Security

- Content Security Policy (CSP) headers
- X-Frame-Options (SAMEORIGIN)
- X-Content-Type-Options (nosniff)
- X-XSS-Protection enabled
- Rate limiting (30 req/s general, 100 req/s static)
- Connection limits per IP
- Hidden server tokens
- HSTS-ready (uncomment for HTTPS)

---

## 📜 License

MIT © [Hrithik Vasanthram](https://github.com/hrithik18k)

---

<p align="center">
  Crafted with ❤️ and ☕ by <strong>Hrithik Vasanthram</strong>
</p>
