/**
 * Arbitrum Explorer - Main JavaScript
 * Global interactive functions, canvas particle network,
 * scroll animations, statistics counters, and responsive navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCanvasBackground();
  initScrollAnimations();
  initBackToTop();
  initScrollProgress();
  initSpotlightFollower();
  initCardSpotlights();
  initHeroCanvas();
});

/* ==========================================================================
   1. NAVBAR & NAVIGATION FUNCTIONS
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Navbar Glass Effect on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });

  // Mobile Hamburger Toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close mobile menu when links are clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // Highlight Active Link based on Current Page URL
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (pageName === href || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   2. INTERACTIVE CANVAS PARTICLE NETWORK
   ========================================================================== */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 25000)); // Adaptive count
  const connectionDistance = 130;
  const mouse = { x: null, y: null, radius: 180 };

  // Adjust canvas size on resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mouse Tracking
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      // Assign either a Cyan or Purple gradient base color
      this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(139, 92, 246, 0.3)';
    }

    update() {
      // Boundaries wrap-around
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse repulsion physics (subtle push)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.2;
          this.y += Math.sin(angle) * force * 1.2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw grid layer underneath particles
    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connections (blockchain nodes grid style)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        
        if (dist < connectionDistance) {
          // Fade connection lines out based on distance
          const alpha = (1 - (dist / connectionDistance)) * 0.15;
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Dynamic mouse connection
      if (mouse.x !== null && mouse.y !== null) {
        const mouseDist = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
        if (mouseDist < mouse.radius) {
          const alpha = (1 - (mouseDist / mouse.radius)) * 0.25;
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. SCROLL REVEAL & COUNTER ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const statsSection = document.getElementById('stats');
  const counterElements = document.querySelectorAll('.counter');

  // Options for viewport observers
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  // 1. Intersection Observer for Scroll Reveals
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  reveals.forEach(element => {
    revealObserver.observe(element);
  });

  // 2. Statistics Counter Increment Animation
  let animated = false;
  if (statsSection && counterElements.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        counterElements.forEach(counter => {
          animateCounter(counter);
        });
      }
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }
}

// Function to smoothly count up numbers
function animateCounter(element) {
  const target = parseFloat(element.getAttribute('data-target'));
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const decimal = element.getAttribute('data-decimal') === 'true';
  const duration = 2000; // 2 seconds
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // EaseOutQuad function for smooth deceleration
    const ease = progress * (2 - progress);
    
    let currentValue = ease * target;
    if (decimal) {
      currentValue = currentValue.toFixed(2);
    } else {
      currentValue = Math.floor(currentValue);
    }

    // Format thousands with commas if large
    let formattedValue = currentValue;
    if (!decimal && target >= 1000) {
      formattedValue = parseInt(currentValue).toLocaleString();
    }

    element.textContent = `${prefix}${formattedValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      // Make sure it locks onto absolute target
      let finalVal = decimal ? target.toFixed(2) : target.toLocaleString();
      element.textContent = `${prefix}${finalVal}${suffix}`;
    }
  }

  requestAnimationFrame(updateCount);
}

/* ==========================================================================
   4. GLOBAL BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  btn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   5. PORTAL & SCROLL UTILITIES
   ========================================================================== */

function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  });
}

function initSpotlightFollower() {
  const follower = document.getElementById('spotlight-follower');
  if (!follower) return;
  
  document.addEventListener('mousemove', (e) => {
    follower.style.opacity = '1';
    follower.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });

  document.addEventListener('mouseleave', () => {
    follower.style.opacity = '0';
  });
}

function initCardSpotlights() {
  const updateSpotlight = (e) => {
    const cards = document.querySelectorAll('.glass-card.spotlight-hover');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  };
  document.addEventListener('mousemove', updateSpotlight);
}

/* ==========================================================================
   6. HERO ILLUSTRATION CANVAS (PARTICLE CONNECTOR GRID)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('nodes-hero-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;
  
  let width = canvas.width = container.clientWidth;
  let height = canvas.height = container.clientHeight;
  
  const particles = [];
  const particleCount = 18;
  const connectionDistance = 90;
  
  let localMouse = { x: null, y: null, radius: 100 };
  
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    localMouse.x = e.clientX - rect.left;
    localMouse.y = e.clientY - rect.top;
  });
  
  container.addEventListener('mouseleave', () => {
    localMouse.x = null;
    localMouse.y = null;
  });
  
  window.addEventListener('resize', () => {
    width = canvas.width = container.clientWidth;
    height = canvas.height = container.clientHeight;
  });
  
  class HeroParticle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2.5 + 1.5;
      this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.6)' : 'rgba(139, 92, 246, 0.5)';
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
      
      if (localMouse.x !== null && localMouse.y !== null) {
        const dx = this.x - localMouse.x;
        const dy = this.y - localMouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < localMouse.radius) {
          const force = (localMouse.radius - dist) / localMouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new HeroParticle());
  }
  
  function animateHero() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < connectionDistance) {
          const alpha = (1 - (dist / connectionDistance)) * 0.25;
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animateHero);
  }
  
  animateHero();
}

