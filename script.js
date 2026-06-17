/**
 * El Muozoun Tech — script.js
 * Premium Corporate Landing Page
 * Pure Vanilla JavaScript — No frameworks
 */

(function () {
  'use strict';

  /* ============================================================
     1. CANVAS — Animated Network Particles
     ============================================================ */
  const canvas  = document.getElementById('networkCanvas');
  const ctx     = canvas.getContext('2d');
  let W, H, animId;
  const GOLD    = '201,169,110';
  const NODE_COUNT = 55;
  const MAX_DIST   = 160;

  let nodes = [];

  /** Resize canvas to fill viewport */
  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /** Create a single particle node */
  function createNode() {
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * 0.55,
      vy:  (Math.random() - 0.5) * 0.55,
      r:   Math.random() * 2.4 + 1.2,
    };
  }

  /** Initialize all nodes */
  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(createNode());
  }

  /** Main animation loop */
  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);

    // Move nodes
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.45;
          ctx.strokeStyle = `rgba(${GOLD},${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GOLD},0.75)`;
      ctx.fill();
    }

    animId = requestAnimationFrame(animateCanvas);
  }

  /** Boot canvas */
  function bootCanvas() {
    resizeCanvas();
    initNodes();
    animateCanvas();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
  });


  /* ============================================================
     2. HEADER — Scroll State + Logo Swap
     ============================================================ */
  const header    = document.getElementById('mainHeader');
  const heroSection = document.getElementById('home');

  function updateHeader() {
    const scrolled = window.scrollY > 60;
    header.classList.toggle('scrolled', scrolled);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // Run on load


  /* ============================================================
     3. MOBILE MENU
     ============================================================ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-cta');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ============================================================
     4. SMOOTH SCROLL for anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ============================================================
     5. TYPING ANIMATION (Hero)
     ============================================================ */
  const line1El = document.getElementById('typingLine1');
  const line2El = document.getElementById('typingLine2');
  const LINE1   = 'Bridging Local Presence with';
  const LINE2   = 'Global Expertise';
  let   typingStarted = false;

  function typeText(el, text, delay, speed, onDone) {
    let i = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        el.textContent = text.slice(0, i + 1);
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          if (onDone) onDone();
        }
      }, speed);
    }, delay);
  }

  function startTyping() {
    if (typingStarted) return;
    typingStarted = true;
    typeText(line1El, LINE1, 900, 48, () => {
      typeText(line2El, LINE2, 200, 72, null);
    });
  }

  // Start typing after page load
  window.addEventListener('load', () => {
    setTimeout(startTyping, 400);
  });


  /* ============================================================
     6. SCROLL REVEAL ANIMATION
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger children within same parent
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
            : [];
          const siblingsIdx = siblings.indexOf(entry.target);
          const delay = Math.min(siblingsIdx * 80, 400);

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ============================================================
     7. SECTION BACKGROUNDS
     ============================================================ */
  const parallaxEls = document.querySelectorAll('.parallax-bg');

  parallaxEls.forEach(el => {
    el.style.transform = '';
  });


  /* ============================================================
     8. ACTIVE NAV LINK on scroll
     ============================================================ */
  const sections   = document.querySelectorAll('main section[id]');
  const navLinks   = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => navObserver.observe(s));


  /* ============================================================
     9. CONTACT FORM — client-side handling
     ============================================================ */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const inputs = form.querySelectorAll('[required]');
      let valid = true;

      inputs.forEach(input => {
        input.style.borderColor = '';
        if (!input.value.trim()) {
          input.style.borderColor = '#dc2626';
          valid = false;
        }
        if (input.type === 'email' && input.value) {
          const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRe.test(input.value)) {
            input.style.borderColor = '#dc2626';
            valid = false;
          }
        }
      });

      if (!valid) return;

      // Simulate send — replace with actual fetch/XHR to your backend
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        formSuccess.classList.add('visible');
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      }, 1200);
    });

    // Clear error state on input
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }


  /* ============================================================
     10. FOOTER YEAR
     ============================================================ */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ============================================================
     11. SERVICES — SVG Connector Lines
        Drawn on the services section between center and blocks
     ============================================================ */
  function drawServiceLines() {
    const diagram  = document.querySelector('.services-diagram');
    const center   = document.querySelector('.services-center-img');
    if (!diagram || !center) return;

    // Remove old SVG overlay if present
    const old = diagram.querySelector('.services-svg');
    if (old) old.remove();

    const blocks = diagram.querySelectorAll('.service-block');
    if (blocks.length < 5) return;

    const dRect = diagram.getBoundingClientRect();
    const cRect = center.getBoundingClientRect();
    const cx    = cRect.left - dRect.left + cRect.width  / 2;
    const cy    = cRect.top  - dRect.top  + cRect.height / 2;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'services-svg');
    svg.style.cssText = `
      position:absolute; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:1; overflow:visible;
    `;

    blocks.forEach(block => {
      const bRect = block.getBoundingClientRect();
      const bx    = bRect.left - dRect.left + bRect.width  / 2;
      const by    = bRect.top  - dRect.top  + bRect.height / 2;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', bx);
      line.setAttribute('y2', by);
      line.setAttribute('stroke', 'rgba(24,21,69,0.15)');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-dasharray', '6 4');
      svg.appendChild(line);

      // Dot at block end
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', bx);
      dot.setAttribute('cy', by);
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', 'rgba(110,12,12,0.5)');
      svg.appendChild(dot);
    });

    diagram.style.position = 'relative';
    diagram.insertBefore(svg, diagram.firstChild);
  }

  // Draw after images load and on resize
  window.addEventListener('load', () => {
    setTimeout(drawServiceLines, 300);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawServiceLines, 250);
  });


  /* ============================================================
     12. NAV LINK ACTIVE STYLE
     ============================================================ */
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: #C9A96E !important;
    }
  `;
  document.head.appendChild(style);


  /* ============================================================
     BOOT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', bootCanvas);

})();
