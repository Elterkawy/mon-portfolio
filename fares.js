document.addEventListener('DOMContentLoaded', function () {
  
  try {
    const navLinks = document.querySelectorAll('#liens a');
    navLinks.forEach(a => {
      
      if (a.pathname === location.pathname || a.href === location.href) {
        a.classList.add('active');
      }
    });

    
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        
        if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) return;
        const link = card.querySelector('a.btn, a[target="_blank"]');
        if (link) {
          const target = link.target || '_self';
          window.open(link.href, target);
        }
      });
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const link = card.querySelector('a.btn, a[target="_blank"], a');
          if (link) {
            e.preventDefault();
            const target = link.target || '_self';
            window.open(link.href, target);
          }
        }
      });
    });

    
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        
        const btn = contactForm.querySelector('button[type="submit"]');
        if (btn) { btn.textContent = 'Envoi...'; btn.disabled = true; }
      });
    }
      
      function safeLocalStorageGet(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
      }
      function safeLocalStorageSet(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { }
      }

      function initTheme() {
        const stored = safeLocalStorageGet('site-theme');
        if (stored) {
          document.documentElement.setAttribute('data-theme', stored);
          return stored;
        }
        
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        const initial = prefersLight ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', initial);
        return initial;
      }

      function getThemeIcon(theme) {
        if (theme === 'light') {
          return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http:
        }
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http:
      }

      function createThemeToggle() {
        const header = document.querySelector('header.site-header');
        if (!header) return;
        
        if (document.querySelector('.theme-toggle')) return;
        const btn = document.createElement('button');
        btn.className = 'theme-toggle';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Basculer thème');
        btn.title = 'Basculer le thème';
        const current = document.documentElement.getAttribute('data-theme') || initTheme();
        btn.innerHTML = getThemeIcon(current) + '<span class="visually-hidden">Basculer thème<span>';
          safeLocalStorageSet('site-theme', next);
        });
      }

      
      function createScrollTop() {
        if (document.getElementById('scroll-top')) return;
        const btn = document.createElement('button');
        btn.id = 'scroll-top';
        btn.setAttribute('aria-label', 'Remonter en haut');
        btn.title = 'Haut de page';
        btn.innerHTML = '↑';
        document.body.appendChild(btn);
        const threshold = 320;
        function update() {
          if (window.scrollY > threshold) btn.classList.add('visible'); else btn.classList.remove('visible');
        }
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', update, { passive: true });
        update();
      }

      
      function initReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;
        if (!('IntersectionObserver' in window)) {
          items.forEach(i => i.classList.add('revealed'));
          return;
        }
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const d = Number(el.getAttribute('data-reveal-delay') || 0);
              setTimeout(() => el.classList.add('revealed'), d);
              obs.unobserve(el);
            }
          });
        }, { threshold: 0.12 });
        items.forEach(i => obs.observe(i));
      }

      
      function throttle(fn, wait) {
        let last = 0;
        return function(...args) {
          const now = Date.now();
          if (now - last >= wait) { last = now; fn.apply(this, args); }
        };
      }

      
      function initActiveNavOnScroll() {
        const links = Array.from(document.querySelectorAll('#liens a'));
        const sections = Array.from(document.querySelectorAll('main section[id], section[id]'));
        if (!links.length || !sections.length) return;
        const header = document.querySelector('header.site-header');
        const headerH = header ? header.offsetHeight : 72;
        function updateActive() {
          let current = null;
          for (const s of sections) {
            const rect = s.getBoundingClientRect();
            if (rect.top - headerH <= 12) current = s;
          }
          if (current && current.id) {
            const href = '#' + current.id;
            links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === href || a.getAttribute('href') === current.id || a.getAttribute('href').endsWith(current.id)));
          }
        }
        window.addEventListener('scroll', throttle(updateActive, 120), { passive: true });
        
        updateActive();
      }

      
      initTheme();
      createThemeToggle();
      createScrollTop();
      initReveal();
      initActiveNavOnScroll();
  } catch (err) {
    console.error('fares.js error', err);
  }
  
  function setHeaderOffset() {
    const header = document.querySelector('header.site-header');
    if (!header) return;
    const h = header.offsetHeight;
    document.body.style.paddingTop = h + 'px';
    
    document.documentElement.style.scrollPaddingTop = h + 'px';
    
    document.documentElement.style.setProperty('--header-height', h + 'px');
  }
  setHeaderOffset();
  window.addEventListener('resize', setHeaderOffset);
});


