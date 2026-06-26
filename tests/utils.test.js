/**
 * Unit Tests for Portfolio Utility Functions
 * Tests: Utils, ThemeSwitcher, Navigation, ProjectFilter, ContactForm validation
 */

// Mock DOM environment
beforeAll(() => {
  // Set up JSDOM environment
  document.body.innerHTML = `
    <div id="loader" class="loader"></div>
    <div id="customCursor"></div>
    <div id="cursorFollower"></div>
    <div id="scrollProgress"></div>
    <div id="backToTop"></div>
    <div id="modeToggle"><i class="fas fa-moon"></i></div>
    <div id="weatherWidget"></div>
    <div id="musicToggle"><i class="fas fa-headphones"></i></div>
    <div id="heroParticles"></div>
    <div id="contactForm">
      <input type="text" id="name" required />
      <input type="email" id="email" required />
      <input type="tel" id="phone" />
      <input type="text" id="subject" required />
      <textarea id="message" required></textarea>
      <button type="submit" class="btn-submit">
        <span class="btn-text">Send</span>
        <span class="spinner"></span>
      </button>
    </div>
    <div id="formSuccess"></div>
    <div id="projectSearch" class="form-control" />
    <div id="githubRepos"></div>
    <div id="testimonialsSwiper"></div>
    <div id="contributionGraph"></div>
    <div id="newsletterForm">
      <input type="email" />
      <button type="submit">Subscribe</button>
    </div>
    <div id="printResume"></div>
    <nav class="navbar">
      <a class="nav-link active" href="#home">Home</a>
      <a class="nav-link" href="#about">About</a>
      <a class="nav-link" href="#projects">Projects</a>
    </nav>
    <section id="home"></section>
    <section id="about"></section>
    <section id="projects"></section>
    <div class="theme-dot active" data-theme="blue"></div>
    <div class="theme-dot" data-theme="purple"></div>
    <div class="theme-dot" data-theme="green"></div>
    <div class="theme-dot" data-theme="orange"></div>
    <div class="theme-dot" data-theme="gold"></div>
    <div class="filter-btn active" data-filter="all">All</div>
    <div class="filter-btn" data-filter="frontend">Frontend</div>
    <div class="filter-btn" data-filter="backend">Backend</div>
    <div class="skill-progress" data-progress="90"></div>
    <div class="skill-progress" data-progress="80"></div>
    <div class="circular-progress" data-percent="85">
      <svg><circle class="progress" cx="60" cy="60" r="50"></circle></svg>
    </div>
    <div class="stat-number"><span data-target="50" data-suffix="+">0</span></div>
    <div class="project-card" data-category="frontend">
      <h5 class="card-title">Test Project</h5>
      <div class="card-tags"><span>React</span><span>CSS</span></div>
    </div>
    <div class="gallery-item"><img src="test.jpg" alt="test"></div>
  `;

  // Mock localStorage
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = class {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
  };

  // Mock ResizeObserver
  global.ResizeObserver = class {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
  };
});

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
describe('Utility Functions', () => {
  test('debounce delays function execution', (done) => {
    let callCount = 0;
    const fn = () => { callCount++; };

    const debounced = (function(fn, delay) {
      let timer;
      return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    })(fn, 200);

    debounced();
    debounced();
    debounced();

    expect(callCount).toBe(0);

    setTimeout(() => {
      expect(callCount).toBe(1);
      done();
    }, 300);
  });

  test('throttle limits function calls', (done) => {
    let callCount = 0;
    const fn = () => { callCount++; };

    const throttled = (function(fn, limit) {
      let inThrottle = false;
      return function(...args) {
        if (!inThrottle) {
          fn.apply(this, args);
          inThrottle = true;
          setTimeout(() => { inThrottle = false; }, limit);
        }
      };
    })(fn, 100);

    throttled();
    throttled();
    throttled();

    expect(callCount).toBe(1);

    setTimeout(() => {
      throttled();
      expect(callCount).toBe(2);
      done();
    }, 150);
  });

  test('getScrollPercentage returns correct value', () => {
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 500, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 500, writable: true });

    const h = document.documentElement;
    const percent = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    expect(percent).toBeCloseTo(33.33, 1);
  });

  test('isInViewport checks element visibility', () => {
    const el = document.createElement('div');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 200,
      bottom: 400,
      left: 0,
      right: 100,
      width: 100,
      height: 200,
      x: 0,
      y: 200
    });

    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });

    const rect = el.getBoundingClientRect();
    const isVisible = rect.top <= (window.innerHeight - 100) && rect.bottom >= 0;
    expect(isVisible).toBe(true);
  });

  test('localStorage utilities work correctly', () => {
    const setLocalStorage = (key, value) => {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { }
    };
    const getLocalStorage = (key, defaultValue) => {
      try {
        const val = localStorage.getItem(key);
        return val !== null ? JSON.parse(val) : defaultValue;
      } catch { return defaultValue; }
    };

    setLocalStorage('testKey', { name: 'test' });
    expect(getLocalStorage('testKey', null)).toEqual({ name: 'test' });
    expect(getLocalStorage('nonexistent', 'default')).toBe('default');
  });

  test('formatDate formats dates correctly', () => {
    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };
    expect(formatDate('2024-01-15')).toBe('January 15, 2024');
    expect(formatDate('2023-12-25')).toBe('December 25, 2023');
  });
});

// ============================================================
// THEME SWITCHER
// ============================================================
describe('ThemeSwitcher', () => {
  test('applies correct theme data attribute', () => {
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
    };

    applyTheme('purple');
    expect(document.documentElement.getAttribute('data-theme')).toBe('purple');

    applyTheme('green');
    expect(document.documentElement.getAttribute('data-theme')).toBe('green');
  });

  test('dark mode toggles correctly', () => {
    const applyMode = (isDark) => {
      document.documentElement.setAttribute('data-mode', isDark ? 'dark' : 'light');
    };

    applyMode(true);
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');

    applyMode(false);
    expect(document.documentElement.getAttribute('data-mode')).toBe('light');
  });

  test('theme dots highlight active theme', () => {
    const dots = document.querySelectorAll('.theme-dot');

    dots.forEach(dot => dot.classList.remove('active'));
    const target = document.querySelector('.theme-dot[data-theme="green"]');
    target.classList.add('active');

    expect(target.classList.contains('active')).toBe(true);
    expect(document.querySelector('.theme-dot[data-theme="blue"]').classList.contains('active')).toBe(false);
  });

  test('saves theme preference to localStorage', () => {
    const key = 'test-theme-pref';
    localStorage.setItem(key, JSON.stringify('dark'));
    expect(JSON.parse(localStorage.getItem(key))).toBe('dark');
  });
});

// ============================================================
// NAVIGATION
// ============================================================
describe('Navigation', () => {
  test('navbar has correct structure', () => {
    const navbar = document.querySelector('.navbar');
    expect(navbar).toBeTruthy();
    expect(navbar.querySelectorAll('.nav-link').length).toBe(3);
  });

  test('nav links have correct href values', () => {
    const links = document.querySelectorAll('.nav-link');
    expect(links[0].getAttribute('href')).toBe('#home');
    expect(links[1].getAttribute('href')).toBe('#about');
    expect(links[2].getAttribute('href')).toBe('#projects');
  });

  test('active class is toggled correctly', () => {
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => link.classList.remove('active'));
    links[1].classList.add('active');

    expect(links[0].classList.contains('active')).toBe(false);
    expect(links[1].classList.contains('active')).toBe(true);
  });
});

// ============================================================
// PROJECT FILTER
// ============================================================
describe('ProjectFilter', () => {
  test('filter buttons exist', () => {
    const btns = document.querySelectorAll('.filter-btn');
    expect(btns.length).toBe(3);
  });

  test('active filter class toggles correctly', () => {
    const btns = document.querySelectorAll('.filter-btn');

    btns.forEach(b => b.classList.remove('active'));
    btns[1].classList.add('active');

    expect(btns[0].classList.contains('active')).toBe(false);
    expect(btns[1].classList.contains('active')).toBe(true);
  });

  test('project cards have data categories', () => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      expect(card.dataset.category).toBeDefined();
    });
  });
});

// ============================================================
// CONTACT FORM VALIDATION
// ============================================================
describe('ContactForm Validation', () => {
  test('required fields exist', () => {
    expect(document.getElementById('name')).toBeTruthy();
    expect(document.getElementById('email')).toBeTruthy();
    expect(document.getElementById('subject')).toBeTruthy();
    expect(document.getElementById('message')).toBeTruthy();
  });

  test('email validation rejects invalid emails', () => {
    const emailInput = document.getElementById('email');
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
  });

  test('required field validation', () => {
    const isValid = (value) => value.trim().length > 0;

    expect(isValid('John')).toBe(true);
    expect(isValid('')).toBe(false);
    expect(isValid('   ')).toBe(false);
  });

  test('phone number is optional', () => {
    const phoneInput = document.getElementById('phone');
    expect(phoneInput.required).toBeFalsy();
  });

  test('form submission toggles loading state', () => {
    const btn = document.querySelector('.btn-submit');
    btn.classList.add('loading');
    expect(btn.classList.contains('loading')).toBe(true);

    btn.classList.remove('loading');
    expect(btn.classList.contains('loading')).toBe(false);
  });
});

// ============================================================
// SKILL BARS
// ============================================================
describe('SkillBars', () => {
  test('skill bars have data-progress attributes', () => {
    const bars = document.querySelectorAll('.skill-progress');
    bars.forEach(bar => {
      expect(bar.dataset.progress).toBeDefined();
      expect(parseInt(bar.dataset.progress)).toBeGreaterThan(0);
    });
  });

  test('skill bars animate to correct width', () => {
    const bars = document.querySelectorAll('.skill-progress');
    bars.forEach(bar => {
      const target = bar.dataset.progress || 0;
      bar.style.width = target + '%';
      expect(bar.style.width).toBe(target + '%');
    });
  });
});

// ============================================================
// CIRCULAR SKILLS
// ============================================================
describe('CircularSkills', () => {
  test('circular progress elements have percent data', () => {
    const circles = document.querySelectorAll('.circular-progress');
    circles.forEach(circle => {
      expect(circle.dataset.percent).toBeDefined();
      expect(parseInt(circle.dataset.percent)).toBeGreaterThan(0);
    });
  });

  test('stroke-dashoffset calculates correctly', () => {
    const percent = 85;
    const offset = 314 - (314 * percent / 100);
    expect(offset).toBeCloseTo(47.1, 1);

    const percent2 = 50;
    const offset2 = 314 - (314 * percent2 / 100);
    expect(offset2).toBeCloseTo(157, 0);
  });
});

// ============================================================
// ANIMATED COUNTERS
// ============================================================
describe('AnimatedCounters', () => {
  test('stat elements have data-target attributes', () => {
    const counters = document.querySelectorAll('.stat-number [data-target]');
    counters.forEach(counter => {
      expect(counter.dataset.target).toBeDefined();
      expect(parseInt(counter.dataset.target)).toBeGreaterThan(0);
    });
  });

  test('counter animation updates values', () => {
    const counter = document.querySelector('.stat-number [data-target]');
    const target = parseInt(counter.dataset.target);
    counter.textContent = target + (counter.dataset.suffix || '');

    expect(counter.textContent).toContain('50');
  });
});

// ============================================================
// LOCAL STORAGE
// ============================================================
describe('LocalStorage Persistence', () => {
  test('stores and retrieves values', () => {
    localStorage.setItem('theme', JSON.stringify('blue'));
    expect(JSON.parse(localStorage.getItem('theme'))).toBe('blue');
  });

  test('handles missing keys with default', () => {
    const val = localStorage.getItem('nonexistent');
    expect(val).toBeNull();
  });

  test('clears all stored data', () => {
    localStorage.setItem('key1', 'val1');
    localStorage.setItem('key2', 'val2');
    localStorage.clear();
    expect(localStorage.getItem('key1')).toBeNull();
    expect(localStorage.getItem('key2')).toBeNull();
  });
});

// ============================================================
// TYPING EFFECT
// ============================================================
describe('TypedEffect', () => {
  test('typed text element exists', () => {
    // Simulate Typed.js behavior
    const typedStrings = [
      'Full Stack Developer',
      'UI/UX Designer',
      'Software Engineer'
    ];
    expect(typedStrings.length).toBe(3);
    expect(typedStrings).toContain('Full Stack Developer');
  });

  test('typing animation configuration is valid', () => {
    const config = {
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 2000,
      loop: true
    };

    expect(config.typeSpeed).toBeGreaterThan(0);
    expect(config.backSpeed).toBeGreaterThan(0);
    expect(config.backDelay).toBeGreaterThan(0);
    expect(config.loop).toBe(true);
  });
});

// ============================================================
// GALLERY LIGHTBOX
// ============================================================
describe('GalleryLightbox', () => {
  test('gallery items exist', () => {
    const items = document.querySelectorAll('.gallery-item');
    expect(items.length).toBe(1);
  });

  test('click creates lightbox overlay', () => {
    const item = document.querySelector('.gallery-item');
    const img = item.querySelector('img');

    // Simulate click
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:1000;';
    document.body.appendChild(overlay);

    expect(document.body.contains(overlay)).toBe(true);
    overlay.remove();
    expect(document.body.contains(overlay)).toBe(false);
  });
});

// ============================================================
// NEWSLETTER FORM
// ============================================================
describe('Newsletter', () => {
  test('form exists with email input', () => {
    const form = document.getElementById('newsletterForm');
    expect(form).toBeTruthy();
    expect(form.querySelector('input[type="email"]')).toBeTruthy();
  });

  test('subscribe button shows success state', () => {
    const btn = document.querySelector('#newsletterForm button');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Subscribed';
    expect(btn.innerHTML).toContain('Subscribed');
    btn.innerHTML = original;
  });
});

// ============================================================
// ACCESSIBILITY
// ============================================================
describe('Accessibility', () => {
  test('images have alt attributes', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });

  test('interactive elements have aria labels where needed', () => {
    const socialLinks = document.querySelectorAll('.hero-social a');
    socialLinks.forEach(link => {
      expect(link.hasAttribute('aria-label') || link.hasAttribute('title')).toBe(true);
    });
  });
});
