/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  HRITHIK VASANTHRAM — Enterprise Portfolio Engine               ║
 * ║  Dynamic 3D Transitions · Particle System · Smart Interactions  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 * 
 * Architecture: Modular IIFE pattern for zero global pollution
 * Performance: RequestAnimationFrame, IntersectionObserver, debounce
 */

'use strict';

(function PortfolioEngine() {

  // ═══════════════════════════════════════════════
  // §1 — CONFIGURATION
  // ═══════════════════════════════════════════════

  const CONFIG = Object.freeze({
    particles: {
      count: 80,
      color: 'rgba(108, 99, 255, 0.5)',
      lineColor: 'rgba(108, 99, 255, 0.08)',
      maxDistance: 150,
      speed: 0.3,
      size: { min: 1, max: 3 }
    },
    typing: {
      roles: [
        'Full-Stack Developer',
        'UI/UX Designer',
        'MERN Stack Engineer',
        'Problem Solver',
        'Open Source Contributor'
      ],
      typeSpeed: 80,
      deleteSpeed: 40,
      pauseDelay: 2000
    },
    scroll: {
      navScrollThreshold: 50,
      revealThreshold: 0.15,
      skillBarThreshold: 0.5
    },
    tilt: {
      maxTilt: 8,
      perspective: 1200,
      speed: 400
    },
    counter: {
      duration: 2000,
      easing: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
  });


  // ═══════════════════════════════════════════════
  // §2 — UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function debounce(fn, delay = 100) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function throttle(fn, limit = 16) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= limit) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }


  // ═══════════════════════════════════════════════
  // §3 — PRELOADER
  // ═══════════════════════════════════════════════

  const Preloader = {
    el: $('#preloader'),

    init() {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.el?.classList.add('hidden');
          document.body.style.overflow = '';
          // Trigger initial reveals after preloader
          setTimeout(() => ScrollReveal.revealAll(), 300);
        }, 800);
      });

      // Safety fallback — remove preloader after 5s no matter what
      setTimeout(() => {
        this.el?.classList.add('hidden');
        document.body.style.overflow = '';
      }, 5000);
    }
  };


  // ═══════════════════════════════════════════════
  // §4 — CUSTOM CURSOR
  // ═══════════════════════════════════════════════

  const Cursor = {
    dot: $('#cursorDot'),
    ring: $('#cursorRing'),
    pos: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    visible: false,

    init() {
      if (!this.dot || !this.ring) return;
      if (window.matchMedia('(max-width: 768px)').matches) return;

      document.addEventListener('mousemove', (e) => {
        this.target.x = e.clientX;
        this.target.y = e.clientY;
        if (!this.visible) {
          this.visible = true;
          this.dot.style.opacity = '1';
          this.ring.style.opacity = '1';
        }
      });

      document.addEventListener('mouseleave', () => {
        this.visible = false;
        this.dot.style.opacity = '0';
        this.ring.style.opacity = '0';
      });

      // Hover effect on interactive elements
      const hoverTargets = $$('a, button, [data-tilt], .project-card, .service-card, .contact-card, .info-card');
      hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => this.ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => this.ring.classList.remove('hover'));
      });

      this.animate();
    },

    animate() {
      this.pos.x = lerp(this.pos.x, this.target.x, 0.15);
      this.pos.y = lerp(this.pos.y, this.target.y, 0.15);

      if (this.dot) {
        this.dot.style.transform = `translate(${this.target.x - 3}px, ${this.target.y - 3}px)`;
      }
      if (this.ring) {
        this.ring.style.transform = `translate(${this.pos.x - 20}px, ${this.pos.y - 20}px)`;
      }

      requestAnimationFrame(() => this.animate());
    }
  };


  // ═══════════════════════════════════════════════
  // §5 — PARTICLE SYSTEM
  // ═══════════════════════════════════════════════

  const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null },
    animId: null,

    init() {
      this.canvas = $('#particleCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.resize();
      this.createParticles();
      this.animate();

      window.addEventListener('resize', debounce(() => this.resize(), 200));

      document.addEventListener('mousemove', throttle((e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      }, 16));
    },

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
      this.canvas.style.width = window.innerWidth + 'px';
      this.canvas.style.height = window.innerHeight + 'px';
      this.ctx.scale(dpr, dpr);
    },

    createParticles() {
      const { count, size, speed } = CONFIG.particles;
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: randomRange(0, window.innerWidth),
          y: randomRange(0, window.innerHeight),
          vx: randomRange(-speed, speed),
          vy: randomRange(-speed, speed),
          radius: randomRange(size.min, size.max),
          opacity: randomRange(0.3, 0.8)
        });
      }
    },

    animate() {
      const { ctx, particles } = this;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const { maxDistance, color, lineColor } = CONFIG.particles;

      ctx.clearRect(0, 0, w, h);

      particles.forEach((p, i) => {
        // Mouse interaction
        if (this.mouse.x !== null) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.vx -= (dx / dist) * force * 0.02;
            p.vy -= (dy / dist) * force * 0.02;
          }
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ddx = p.x - p2.x;
          const ddy = p.y - p2.y;
          const distance = Math.sqrt(ddx * ddx + ddy * ddy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = 1 - distance / maxDistance;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        ctx.globalAlpha = 1;
      });

      this.animId = requestAnimationFrame(() => this.animate());
    },

    destroy() {
      if (this.animId) cancelAnimationFrame(this.animId);
    }
  };


  // ═══════════════════════════════════════════════
  // §6 — NAVIGATION
  // ═══════════════════════════════════════════════

  const Navigation = {
    nav: $('#navMain'),
    hamburger: $('#hamburger'),
    mobileMenu: $('#mobileMenu'),
    links: $$('.nav-link'),
    mobileLinks: $$('.mobile-nav-link'),

    init() {
      // Scroll effects
      window.addEventListener('scroll', throttle(() => this.onScroll(), 16));

      // Hamburger
      this.hamburger?.addEventListener('click', () => this.toggleMobile());

      // All nav links (desktop + mobile)
      [...this.links, ...this.mobileLinks].forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const section = link.getAttribute('data-section');
          const target = $(`#${section}`);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            this.closeMobile();
          }
        });
      });

      // Active link on scroll
      window.addEventListener('scroll', throttle(() => this.updateActiveLink(), 100));
    },

    onScroll() {
      const scrolled = window.scrollY > CONFIG.scroll.navScrollThreshold;
      this.nav?.classList.toggle('scrolled', scrolled);
    },

    updateActiveLink() {
      const sections = $$('section[id]');
      const scrollPos = window.scrollY + 150;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          this.links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
          this.mobileLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    },

    toggleMobile() {
      this.hamburger?.classList.toggle('active');
      this.mobileMenu?.classList.toggle('active');
      document.body.style.overflow = this.mobileMenu?.classList.contains('active') ? 'hidden' : '';
    },

    closeMobile() {
      this.hamburger?.classList.remove('active');
      this.mobileMenu?.classList.remove('active');
      document.body.style.overflow = '';
    }
  };


  // ═══════════════════════════════════════════════
  // §7 — THEME TOGGLE
  // ═══════════════════════════════════════════════

  const ThemeManager = {
    toggle: $('#themeToggle'),
    icon: null,

    init() {
      this.icon = this.toggle?.querySelector('.theme-icon');
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light'); // default light

      this.applyTheme(theme);

      this.toggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        this.applyTheme(next);
        localStorage.setItem('theme', next);
      });
    },

    applyTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (this.icon) this.icon.setAttribute('name', 'moon-outline');
      } else {
        document.documentElement.removeAttribute('data-theme');
        if (this.icon) this.icon.setAttribute('name', 'sunny-outline');
      }
    }
  };


  // ═══════════════════════════════════════════════
  // §8 — TYPING EFFECT
  // ═══════════════════════════════════════════════

  const TypingEffect = {
    el: $('#typedRole'),
    roleIndex: 0,
    charIndex: 0,
    isDeleting: false,

    init() {
      if (!this.el) return;
      this.type();
    },

    type() {
      const { roles, typeSpeed, deleteSpeed, pauseDelay } = CONFIG.typing;
      const currentRole = roles[this.roleIndex];

      if (this.isDeleting) {
        this.charIndex--;
      } else {
        this.charIndex++;
      }

      this.el.textContent = currentRole.substring(0, this.charIndex);

      let delay = this.isDeleting ? deleteSpeed : typeSpeed;

      if (!this.isDeleting && this.charIndex === currentRole.length) {
        delay = pauseDelay;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.roleIndex = (this.roleIndex + 1) % roles.length;
        delay = 500;
      }

      setTimeout(() => this.type(), delay);
    }
  };


  // ═══════════════════════════════════════════════
  // §9 — SCROLL REVEAL
  // ═══════════════════════════════════════════════

  const ScrollReveal = {
    observer: null,

    init() {
      const options = {
        threshold: CONFIG.scroll.revealThreshold,
        rootMargin: '0px 0px -50px 0px'
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay') || '0');
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, delay);
            this.observer.unobserve(entry.target);
          }
        });
      }, options);

      $$('[data-reveal]').forEach(el => this.observer.observe(el));
    },

    revealAll() {
      // Force reveal for elements already in viewport
      $$('[data-reveal]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const delay = parseInt(el.getAttribute('data-delay') || '0');
          setTimeout(() => el.classList.add('revealed'), delay);
        }
      });
    }
  };


  // ═══════════════════════════════════════════════
  // §10 — ANIMATED COUNTERS
  // ═══════════════════════════════════════════════

  const Counters = {
    init() {
      const counters = $$('[data-count]');
      if (!counters.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(el => observer.observe(el));
    },

    animateCounter(el) {
      const target = parseInt(el.getAttribute('data-count'));
      const { duration, easing } = CONFIG.counter;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);
        el.textContent = Math.round(easedProgress * target);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }
  };


  // ═══════════════════════════════════════════════
  // §11 — SKILL BARS ANIMATION
  // ═══════════════════════════════════════════════

  const SkillBars = {
    init() {
      const fills = $$('.skill-bar-fill');
      if (!fills.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const width = fill.getAttribute('data-width');
            fill.style.setProperty('--width', width);
            fill.classList.add('animated');
            observer.unobserve(fill);
          }
        });
      }, { threshold: CONFIG.scroll.skillBarThreshold });

      fills.forEach(el => observer.observe(el));
    }
  };


  // ═══════════════════════════════════════════════
  // §12 — 3D TILT EFFECT
  // ═══════════════════════════════════════════════

  const TiltEffect = {
    init() {
      if (window.matchMedia('(max-width: 768px)').matches) return;

      $$('[data-tilt]').forEach(el => {
        el.addEventListener('mousemove', (e) => this.onMove(e, el));
        el.addEventListener('mouseleave', () => this.onLeave(el));
      });
    },

    onMove(e, el) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const { maxTilt, perspective } = CONFIG.tilt;
      const rotateY = ((x - midX) / midX) * maxTilt;
      const rotateX = -((y - midY) / midY) * maxTilt;

      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    },

    onLeave(el) {
      el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };


  // ═══════════════════════════════════════════════
  // §13 — BACK TO TOP
  // ═══════════════════════════════════════════════

  const BackToTop = {
    btn: $('#backToTop'),

    init() {
      if (!this.btn) return;

      window.addEventListener('scroll', throttle(() => {
        this.btn.classList.toggle('visible', window.scrollY > 500);
      }, 100));

      this.btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };


  // ═══════════════════════════════════════════════
  // §14 — CONTACT FORM
  // ═══════════════════════════════════════════════

  const ContactForm = {
    form: $('#contactForm'),
    btn: $('#submitBtn'),

    init() {
      if (!this.form) return;

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    },

    async handleSubmit() {
      const btn = this.btn;
      if (!btn) return;

      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span>Sending...</span>';
      btn.disabled = true;

      // Simulate form processing (replace with real endpoint)
      await new Promise(resolve => setTimeout(resolve, 1500));

      btn.innerHTML = '<span>✓ Sent!</span>';
      btn.style.background = 'linear-gradient(135deg, #00e676, #00c853)';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.background = '';
        this.form.reset();
      }, 3000);
    }
  };


  // ═══════════════════════════════════════════════
  // §15 — SMOOTH SECTION TRANSITIONS
  // ═══════════════════════════════════════════════

  const SectionTransitions = {
    init() {
      const sections = $$('.section');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
          }
        });
      }, { threshold: 0.05 });

      sections.forEach(section => observer.observe(section));
    }
  };


  // ═══════════════════════════════════════════════
  // §16 — PERFORMANCE MONITOR
  // ═══════════════════════════════════════════════

  const Performance = {
    init() {
      // Reduce particle count on low-end devices
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        CONFIG.particles.count = 30;
      }

      // Pause particle animation when tab is not visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          ParticleSystem.destroy();
        } else {
          ParticleSystem.animate();
        }
      });
    }
  };


  // ═══════════════════════════════════════════════
  // §17 — INITIALIZATION
  // ═══════════════════════════════════════════════

  function init() {
    Preloader.init();
    ThemeManager.init();
    Navigation.init();
    ParticleSystem.init();
    Cursor.init();
    TypingEffect.init();
    ScrollReveal.init();
    Counters.init();
    SkillBars.init();
    TiltEffect.init();
    BackToTop.init();
    ContactForm.init();
    SectionTransitions.init();
    Performance.init();

    console.log(
      '%c🚀 Hrithik Vasanthram — Portfolio Engine v2.0 Loaded',
      'color: #6c63ff; font-size: 14px; font-weight: bold;'
    );
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
