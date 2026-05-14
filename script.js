/* DEVELOPER PORTFOLIO - script.js
   Pure Vanilla JS · No frameworks · No dependencies */

(function () {
  'use strict';

  /* ----- DOM READY ----- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initParticleCanvas();
    initTypingAnimation();
    initNavigation();
    initScrollReveal();
    initSkillBars();
    initProjectTilt();
    initProjectFilter();
    initContactForm();
    initButtonRipple();
  }

  /* 1. PARTICLE CANVAS BACKGROUND
  */
  function initParticleCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    const PARTICLE_COUNT = 80;
    const MAX_DIST = 120;

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.15;
            ctx.strokeStyle = `rgba(30, 58, 95, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30, 58, 95, ${p.opacity})`;
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }

  /* 2. TYPING ANIMATION
  */
  function initTypingAnimation() {
    const el = document.getElementById('typingTarget');
    if (!el) return;

    const phrases = [
      'Junior Frontend Dev',
      'HTML · CSS · JavaScript · Next.js· React.js',
      'Just building stuff that works',
      'Learning by shipping real projects',
      'Clean UI > unnecessary complexity',
      'Alex Codes :\n)'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const TYPE_SPEED = 80;
    const DELETE_SPEED = 40;
    const PAUSE = 2000;

    function type() {
      const current = phrases[phraseIdx];
      const cursor = '<span class="cursor"></span>';

      if (isDeleting) {
        charIdx--;
        el.innerHTML = current.substring(0, charIdx) + cursor;
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, DELETE_SPEED);
      } else {
        charIdx++;
        el.innerHTML = current.substring(0, charIdx) + cursor;
        if (charIdx === current.length) {
          isDeleting = true;
          setTimeout(type, PAUSE);
          return;
        }
        setTimeout(type, TYPE_SPEED);
      }
    }

    setTimeout(type, 600);
  }

  /* 3. NAVIGATION
  */
  function initNavigation() {
    const nav = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    // Prevent page reload on all href="#" links
    document.querySelectorAll('a[href="#"]').forEach(a => {
      a.addEventListener('click', (e) => e.preventDefault());
    });

    // Mobile toggle
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
      });

      // Close on link click
      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          toggle.classList.remove('active');
          links.classList.remove('open');
        });
      });
    }
  }

  /* 4. SCROLL REVEAL (Intersection Observer)
  */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* 5. SKILL BARS ANIMATION
  */
  function initSkillBars() {
    const items = document.querySelectorAll('.skill-item');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pct = entry.target.getAttribute('data-skill');
          const fill = entry.target.querySelector('.skill-item__fill');
          if (fill) fill.style.width = pct + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    items.forEach(item => observer.observe(item));
  }

  /* 6. PROJECT CARD TILT EFFECT
  */
  function initProjectTilt() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });
  }

  /* 7. PROJECT FILTER
  */
  function initProjectFilter() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    if (!btns.length || !cards.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity .4s ease, transform .4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => { card.style.display = 'none'; }, 350);
          }
        });
      });
    });
  }

  /* 8. CONTACT FORM VALIDATION
  */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Validation
      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      if (message.length < 10) {
        showStatus('Message must be at least 10 characters.', 'error');
        return;
      }

      // Simulate send
      const btn = document.getElementById('submitBtn');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }, 1500);
    });

    function showStatus(msg, type) {
      status.textContent = msg;
      status.className = 'form__status ' + type;
      setTimeout(() => {
        status.className = 'form__status';
        status.textContent = '';
      }, 5000);
    }
  }

  /* 9. BUTTON RIPPLE EFFECT
  */
  function initButtonRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  }

})();
