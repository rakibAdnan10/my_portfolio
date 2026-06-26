/* ============================================================
   PORTFOLIO - MAIN JAVASCRIPT
   All interactive features, animations, and utilities
   ============================================================ */

(function () {
  'use strict';

  // ==========================================================
  // CONFIGURATION
  // ==========================================================
  const CONFIG = {
    emailjs: {
      serviceID: 'service_your_service_id',
      templateID: 'template_your_template_id',
      publicKey: 'your_public_key'
    },
    github: {
      username: 'rakibAdnan10',
      repoLimit: 12
    },
    weather: {
      apiKey: 'your_openweather_api_key',
      city: 'Dhaka'
    }
  };

  // ==========================================================
  // UTILITY FUNCTIONS
  // ==========================================================
  const Utils = {
    debounce(fn, delay = 300) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    throttle(fn, limit = 100) {
      let inThrottle = false;
      return function (...args) {
        if (!inThrottle) {
          fn.apply(this, args);
          inThrottle = true;
          setTimeout(() => { inThrottle = false; }, limit);
        }
      };
    },

    getScrollPercentage() {
      const h = document.documentElement;
      return (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    },

    isInViewport(el, offset = 100) {
      const rect = el.getBoundingClientRect();
      return rect.top <= (window.innerHeight - offset) && rect.bottom >= 0;
    },

    getLocalStorage(key, defaultValue) {
      try {
        const val = localStorage.getItem(key);
        return val !== null ? JSON.parse(val) : defaultValue;
      } catch {
        return defaultValue;
      }
    },

    setLocalStorage(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch { /* ignore */ }
    },

    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================
  const LoadingScreen = {
    init() {
      window.addEventListener('load', () => {
        setTimeout(() => {
          document.getElementById('loader').classList.add('hidden');
          document.body.style.overflow = '';
        }, 800);
      });
    }
  };

  // ==========================================================
  // CUSTOM CURSOR
  // ==========================================================
  const CustomCursor = {
    init() {
      const cursor = document.getElementById('customCursor');
      const follower = document.getElementById('cursorFollower');
      if (!cursor || !follower) return;

      let mouseX = 0, mouseY = 0;
      let followerX = 0, followerY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
      });

      function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
      }
      animateFollower();

      // Hover effect
      document.querySelectorAll('a, button, .card, .theme-dot, .btn-primary-custom, .btn-outline-custom')
        .forEach(el => {
          el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
  };

  // ==========================================================
  // NAVIGATION
  // ==========================================================
  const Navigation = {
    init() {
      const navbar = document.querySelector('.navbar');
      const navLinks = document.querySelectorAll('.nav-link');
      const sections = document.querySelectorAll('section[id]');

      // Scroll spy
      const onScroll = Utils.throttle(() => {
        // Navbar background
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Active nav link
        let current = '';
        sections.forEach(section => {
          const top = section.offsetTop - 150;
          if (window.scrollY >= top) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
      }, 50);

      window.addEventListener('scroll', onScroll);
      onScroll();

      // Smooth scroll for nav links
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu
            const collapse = document.querySelector('.navbar-collapse');
            if (collapse.classList.contains('show')) {
              bootstrap.Collapse.getInstance(collapse)?.hide();
            }
          }
        });
      });
    }
  };

  // ==========================================================
  // SCROLL PROGRESS BAR
  // ==========================================================
  const ScrollProgress = {
    init() {
      const bar = document.getElementById('scrollProgress');
      if (!bar) return;

      window.addEventListener('scroll', Utils.throttle(() => {
        bar.style.width = Utils.getScrollPercentage() + '%';
      }, 50));
    }
  };

  // ==========================================================
  // BACK TO TOP
  // ==========================================================
  const BackToTop = {
    init() {
      const btn = document.getElementById('backToTop');
      if (!btn) return;

      window.addEventListener('scroll', Utils.throttle(() => {
        btn.classList.toggle('visible', window.scrollY > 500);
      }, 100));

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  // ==========================================================
  // PARTICLE BACKGROUND
  // ==========================================================
  const Particles = {
    init() {
      const container = document.getElementById('heroParticles');
      if (!container) return;

      const colors = [
        'var(--primary)',
        'var(--primary-light)',
        'rgba(var(--primary-rgb), 0.5)'
      ];

      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(particle);
      }
    }
  };

  // ==========================================================
  // THEME SWITCHER
  // ==========================================================
  const ThemeSwitcher = {
    currentTheme: 'blue',
    isDark: false,

    init() {
      const dots = document.querySelectorAll('.theme-dot');
      const modeToggle = document.getElementById('modeToggle');

      // Load saved settings
      this.currentTheme = Utils.getLocalStorage('theme', 'blue');
      this.isDark = Utils.getLocalStorage('darkMode', false);

      // Apply saved theme
      this.applyTheme(this.currentTheme);
      this.applyMode(this.isDark);

      // Theme dots
      dots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.theme === this.currentTheme);
        dot.addEventListener('click', () => {
          dots.forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          this.applyTheme(dot.dataset.theme);
        });
      });

      // Dark mode toggle
      if (modeToggle) {
        modeToggle.addEventListener('click', () => {
          this.isDark = !this.isDark;
          this.applyMode(this.isDark);
        });
      }
    },

    applyTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      Utils.setLocalStorage('theme', theme);
    },

    applyMode(isDark) {
      this.isDark = isDark;
      document.documentElement.setAttribute('data-mode', isDark ? 'dark' : 'light');
      const icon = document.querySelector('#modeToggle i');
      if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      }
      Utils.setLocalStorage('darkMode', isDark);
    }
  };

  // ==========================================================
  // TYPED.JS INITIALIZATION
  // ==========================================================
  const TypedInit = {
    init() {
      const el = document.getElementById('typedText');
      if (!el || typeof Typed === 'undefined') return;

      // We will initialize typed when the library loads
      if (window.Typed) {
        this.startTyped(el);
      } else {
        // Typed.js is loaded via CDN, wait for it
        const checkTyped = setInterval(() => {
          if (window.Typed) {
            clearInterval(checkTyped);
            this.startTyped(el);
          }
        }, 100);
      }
    },

    startTyped(el) {
      new Typed(el, {
        strings: [
          'CSE Student at IIUC',
          'Web Developer',
          'Problem Solver',
          'Tech Enthusiast',
          '6th Semester'
        ],
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
      });
    }
  };

  // ==========================================================
  // AOS INITIALIZATION
  // ==========================================================
  const AOSInit = {
    init() {
      if (typeof AOS === 'undefined') return;
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        disable: 'mobile'
      });
    }
  };

  // ==========================================================
  // SKILL BARS ANIMATION
  // ==========================================================
  const SkillBars = {
    animated: false,

    init() {
      const bars = document.querySelectorAll('.skill-progress');
      if (!bars.length) return;

      const animate = () => {
        if (this.animated) return;
        if (Utils.isInViewport(document.querySelector('.skills'), 50)) {
          this.animated = true;
          bars.forEach(bar => {
            const target = bar.dataset.progress || 0;
            bar.style.width = target + '%';
          });
          window.removeEventListener('scroll', onScroll);
        }
      };

      const onScroll = Utils.throttle(animate, 100);
      window.addEventListener('scroll', onScroll);
      animate();
    }
  };

  // ==========================================================
  // CIRCULAR SKILLS ANIMATION
  // ==========================================================
  const CircularSkills = {
    animated: false,

    init() {
      const circles = document.querySelectorAll('.circular-progress svg circle.progress');
      if (!circles.length) return;

      const animate = () => {
        if (this.animated) return;
        if (Utils.isInViewport(document.querySelector('.skills'), 50)) {
          this.animated = true;
          circles.forEach(circle => {
            const percent = parseInt(circle.closest('.circular-progress').dataset.percent) || 0;
            const offset = 314 - (314 * percent / 100);
            circle.style.strokeDashoffset = offset;
          });
          window.removeEventListener('scroll', onScroll);
        }
      };

      const onScroll = Utils.throttle(animate, 100);
      window.addEventListener('scroll', onScroll);
      animate();
    }
  };

  // ==========================================================
  // ANIMATED COUNTERS (STATISTICS)
  // ==========================================================
  const AnimatedCounters = {
    animated: false,

    init() {
      const counters = document.querySelectorAll('.stat-number [data-target]');
      if (!counters.length) return;

      const animate = () => {
        if (this.animated) return;
        if (Utils.isInViewport(document.querySelector('.statistics'), 50)) {
          this.animated = true;
          counters.forEach(counter => {
            const target = parseInt(counter.dataset.target) || 0;
            const duration = 2000;
            const step = Math.max(1, Math.floor(target / 60));
            let current = 0;

            const updateCounter = () => {
              current += step;
              if (current >= target) {
                counter.textContent = target + (counter.dataset.suffix || '');
                return;
              }
              counter.textContent = current + (counter.dataset.suffix || '');
              requestAnimationFrame(updateCounter);
            };

            updateCounter();
          });
          window.removeEventListener('scroll', onScroll);
        }
      };

      const onScroll = Utils.throttle(animate, 100);
      window.addEventListener('scroll', onScroll);
      animate();
    }
  };

  // ==========================================================
  // PROJECT FILTER & SEARCH
  // ==========================================================
  const ProjectFilter = {
    currentFilter: 'all',
    searchQuery: '',

    init() {
      const filterBtns = document.querySelectorAll('.filter-btn');
      const searchInput = document.getElementById('projectSearch');
      const cards = document.querySelectorAll('.project-card');

      if (!cards.length) return;

      const filter = () => {
        cards.forEach(card => {
          const categories = (card.dataset.category || '').split(' ');
          const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
          const tags = Array.from(card.querySelectorAll('.card-tags span')).map(s => s.textContent.toLowerCase());
          const searchText = this.searchQuery.toLowerCase();

          const matchFilter = this.currentFilter === 'all' || categories.includes(this.currentFilter);
          const matchSearch = !searchText ||
            title.includes(searchText) ||
            tags.some(t => t.includes(searchText));

          card.closest('.col-lg-4, .col-md-6')?.style.setProperty('display',
            matchFilter && matchSearch ? '' : 'none');
        });
      };

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilter = btn.dataset.filter || 'all';
          filter();
        });
      });

      if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce((e) => {
          this.searchQuery = e.target.value;
          filter();
        }, 300));
      }
    }
  };

  // ==========================================================
  // TESTIMONIALS SWIPER
  // ==========================================================
  const TestimonialsSwiper = {
    init() {
      const el = document.getElementById('testimonialsSwiper');
      if (!el || typeof Swiper === 'undefined') return;

      new Swiper(el, {
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        effect: 'slide',
        speed: 800
      });
    }
  };

  // ==========================================================
  // CONTACT FORM
  // ==========================================================
  const ContactForm = {
    init() {
      const form = document.getElementById('contactForm');
      if (!form) return;

      const submitBtn = form.querySelector('.btn-submit');
      const successMsg = document.getElementById('formSuccess');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Validation
        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          return;
        }

        // Loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        const formData = {
          name: form.querySelector('#name').value,
          email: form.querySelector('#email').value,
          phone: form.querySelector('#phone').value,
          subject: form.querySelector('#subject').value,
          message: form.querySelector('#message').value
        };

        try {
          // Send via EmailJS
          if (window.emailjs) {
            await emailjs.send(
              CONFIG.emailjs.serviceID,
              CONFIG.emailjs.templateID,
              formData,
              CONFIG.emailjs.publicKey
            );
          }

          // Save to Google Sheet (via formsubmit or similar)
          await this.saveToSheet(formData);

          // Success
          form.style.display = 'none';
          successMsg.classList.add('show');
          form.reset();
          form.classList.remove('was-validated');
        } catch (error) {
          console.error('Form submission error:', error);
          // Show error on button
          submitBtn.innerHTML = '<span>Error! Try Again</span>';
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<span class="btn-text">Send Message</span><span class="spinner"></span>';
          }, 2000);
        }
      });
    },

    async saveToSheet(data) {
      // Google Apps Script Web App URL for sheet integration
      const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
      try {
        await fetch(scriptURL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch {
        // Silent fail for sheet - EmailJS is primary
      }
    }
  };

  // ==========================================================
  // GITHUB PROJECTS - FETCH REPOS AS PROJECT CARDS
  // ==========================================================
  const GitHubProjects = {
    init() {
      const grid = document.getElementById('projectGrid');
      if (!grid) return;

      const username = CONFIG.github.username;
      if (!username || username === 'yourusername') {
        this.showDemoProjects(grid);
        return;
      }

      this.projectImages = [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800'
      ];
      const langs = ['JavaScript', 'HTML', 'CSS', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'PHP'];
      const categoryMap = {
        'JavaScript': 'frontend', 'TypeScript': 'frontend', 'HTML': 'frontend', 'CSS': 'frontend',
        'Python': 'backend', 'Java': 'backend', 'C++': 'backend', 'C#': 'backend', 'PHP': 'backend'
      };

      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${CONFIG.github.repoLimit}&type=all`)
        .then(res => { if (!res.ok) throw new Error('GitHub API error'); return res.json(); })
        .then(repos => {
          if (!repos || repos.length === 0) { this.showDemoProjects(grid); return; }
          grid.innerHTML = repos.map((repo, i) => {
            const lang = repo.language || 'Code';
            const cat = categoryMap[lang] || 'fullstack';
            const desc = repo.description || 'No description available. Check the repository for more details.';
            const delay = (i % 3) * 100;
            return `
              <div class="col-lg-4 col-md-6 project-item" data-category="${cat}" data-aos="fade-up" data-aos-delay="${delay}">
                <div class="project-card card-3d">
                  <div class="card-3d-inner">
                    <div class="card-image">
                      <img src="${this.projectImages[i % 6]}" alt="${repo.name}" loading="lazy">
                      <div class="card-overlay">
                        <a href="${repo.html_url}" target="_blank" rel="noopener" title="GitHub">
                          <i class="fab fa-github"></i>
                        </a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" title="Live Demo">
                          <i class="fas fa-external-link-alt"></i>
                        </a>` : ''}
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="card-tags">
                        <span>${lang}</span>
                        ${repo.topics && repo.topics.length ? repo.topics.slice(0, 2).map(t => `<span>${t}</span>`).join('') : `<span>${cat}</span>`}
                      </div>
                      <h5 class="card-title">${repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}</h5>
                      <p class="card-text">${desc.substring(0, 120)}${desc.length > 120 ? '...' : ''}</p>
                      <div class="card-footer">
                        <a href="${repo.html_url}" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>
                        <span style="font-size:0.8rem;color:var(--text-muted);margin-left:auto;">
                          <i class="fas fa-star"></i> ${repo.stargazers_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
          }).join('');

          // Re-init AOS for new elements
          if (window.AOS) AOS.refresh();
        })
        .catch(() => this.showDemoProjects(grid));
    },

    showDemoProjects(grid) {
      const demos = [
        { name: 'E-Commerce Platform', lang: 'JavaScript', desc: 'Full-featured e-commerce with payment processing, inventory management, and real-time order tracking.', stars: 12 },
        { name: 'Task Management System', lang: 'Python', desc: 'Collaborative task management with real-time updates, role-based access, and analytics dashboard.', stars: 8 },
        { name: 'Fitness Tracker App', lang: 'HTML', desc: 'Cross-platform fitness tracking with workout logs, nutrition planning, and health metrics.', stars: 5 },
        { name: 'AI Chat Assistant', lang: 'Python', desc: 'Intelligent chatbot with context awareness, document analysis, and multi-language support.', stars: 15 },
        { name: 'Real-Time Dashboard', lang: 'JavaScript', desc: 'Data visualization dashboard with live updates, interactive charts, and customizable widgets.', stars: 9 },
        { name: 'Social Media Platform', lang: 'TypeScript', desc: 'Full-stack social media with real-time messaging, content feeds, and recommendations.', stars: 11 }
      ];
      grid.innerHTML = demos.map((repo, i) => {
        const cat = repo.lang === 'JavaScript' || repo.lang === 'TypeScript' || repo.lang === 'HTML' ? 'frontend' : 'backend';
        const delay = (i % 3) * 100;
        return `
          <div class="col-lg-4 col-md-6 project-item" data-category="${cat}" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="project-card card-3d">
              <div class="card-3d-inner">
                <div class="card-image">
                  <img src="${this.projectImages[i % 6]}" alt="${repo.name}" loading="lazy">
                  <div class="card-overlay">
                    <a href="https://github.com/rakibAdnan10" target="_blank" rel="noopener" title="GitHub">
                      <i class="fab fa-github"></i>
                    </a>
                  </div>
                </div>
                <div class="card-body">
                  <div class="card-tags">
                    <span>${repo.lang}</span>
                  </div>
                  <h5 class="card-title">${repo.name}</h5>
                  <p class="card-text">${repo.desc.substring(0, 120)}</p>
                  <div class="card-footer">
                    <a href="https://github.com/rakibAdnan10" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>
                    <span style="font-size:0.8rem;color:var(--text-muted);margin-left:auto;">
                      <i class="fas fa-star"></i> ${repo.stars}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
      }).join('');
      if (window.AOS) AOS.refresh();
    }
  };

  // ==========================================================
  // GITHUB API - LATEST REPOS
  // ==========================================================
  const GitHubAPI = {
    init() {
      const container = document.getElementById('githubRepos');
      if (!container) return;

      const username = CONFIG.github.username;
      if (!username || username === 'yourusername') {
        // Show demo repos if not configured
        this.showDemoRepos(container);
        return;
      }

      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${CONFIG.github.repoLimit}`)
        .then(res => res.json())
        .then(repos => {
          container.innerHTML = repos.map(repo => `
            <div class="col-md-4 mb-3">
              <div class="github-repo-card">
                <h6><i class="fab fa-github"></i> ${repo.name}</h6>
                <p>${repo.description || 'No description'}</p>
                <div class="repo-stats">
                  <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                  <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                </div>
              </div>
            </div>
          `).join('');
        })
        .catch(() => this.showDemoRepos(container));
    },

    showDemoRepos(container) {
      const demos = [
        { name: 'ecommerce-platform', desc: 'Full-stack e-commerce with payment integration', stars: 45, forks: 12 },
        { name: 'react-dashboard', desc: 'Admin dashboard with real-time analytics', stars: 38, forks: 9 },
        { name: 'mobile-app-ui', desc: 'Cross-platform mobile app UI components', stars: 27, forks: 6 },
        { name: 'api-gateway', desc: 'Microservices API gateway with rate limiting', stars: 52, forks: 14 },
        { name: 'ml-model-server', desc: 'Machine learning model serving platform', stars: 33, forks: 8 },
        { name: 'devops-toolkit', desc: 'CI/CD pipeline automation toolkit', stars: 41, forks: 11 }
      ];
      container.innerHTML = demos.map(repo => `
        <div class="col-md-4 mb-3">
          <div class="github-repo-card">
            <h6><i class="fab fa-github"></i> ${repo.name}</h6>
            <p>${repo.desc}</p>
            <div class="repo-stats">
              <span><i class="fas fa-star"></i> ${repo.stars}</span>
              <span><i class="fas fa-code-branch"></i> ${repo.forks}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  };

  // ==========================================================
  // WEATHER WIDGET
  // ==========================================================
  const WeatherWidget = {
    init() {
      const widget = document.getElementById('weatherWidget');
      if (!widget) return;

      // Use demo weather data
      const demoWeather = {
        temp: 24,
        city: CONFIG.weather.city,
        icon: 'sun',
        condition: 'Sunny'
      };

      widget.innerHTML = `
        <i class="fas fa-${demoWeather.icon === 'sun' ? 'sun' : 'cloud'} weather-icon" style="color: #ffc107"></i>
        <div>
          <div class="weather-temp">${demoWeather.temp}°C</div>
          <div class="weather-city">${demoWeather.city}</div>
        </div>
      `;
    }
  };

  // ==========================================================
  // MUSIC TOGGLE
  // ==========================================================
  const MusicToggle = {
    isPlaying: false,
    audio: null,

    init() {
      const btn = document.getElementById('musicToggle');
      if (!btn) return;

      btn.addEventListener('click', () => {
        this.isPlaying = !this.isPlaying;
        btn.classList.toggle('playing', this.isPlaying);

        if (this.isPlaying) {
          // Try to play ambient sound (optional - user needs to provide audio)
          btn.innerHTML = '<i class="fas fa-music"></i>';
        } else {
          btn.innerHTML = '<i class="fas fa-headphones"></i>';
        }
      });
    }
  };

  // ==========================================================
  // GALLERY LIGHTBOX
  // ==========================================================
  const GalleryLightbox = {
    init() {
      const items = document.querySelectorAll('.gallery-item');
      items.forEach(item => {
        item.addEventListener('click', () => {
          const img = item.querySelector('img');
          if (img) {
            // Simple lightbox implementation
            const overlay = document.createElement('div');
            overlay.style.cssText = `
              position: fixed; inset: 0; background: rgba(0,0,0,0.95);
              display: flex; align-items: center; justify-content: center;
              z-index: 1000; cursor: pointer; padding: 20px;
            `;
            overlay.innerHTML = `<img src="${img.src}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;">`;
            overlay.addEventListener('click', () => overlay.remove());
            document.body.appendChild(overlay);
          }
        });
      });
    }
  };

  // ==========================================================
  // GITHUB CONTRIBUTION GRAPH
  // ==========================================================
  const ContributionGraph = {
    init() {
      const container = document.getElementById('contributionGraph');
      if (!container) return;

      const graph = document.createElement('div');
      graph.className = 'contribution-grid';

      for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
          const cell = document.createElement('div');
          const level = Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0;
          cell.className = `contribution-cell${level > 0 ? ` level-${level}` : ''}`;
          graph.appendChild(cell);
        }
      }

      container.appendChild(graph);
    }
  };

  // ==========================================================
  // CARD 3D TILT EFFECT
  // ==========================================================
  const Card3D = {
    init() {
      document.querySelectorAll('.card-3d').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          const inner = card.querySelector('.card-3d-inner');
          if (inner) {
            inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          }
        });

        card.addEventListener('mouseleave', () => {
          const inner = card.querySelector('.card-3d-inner');
          if (inner) {
            inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
          }
        });
      });
    }
  };

  // ==========================================================
  // MOUSE GLOW EFFECT
  // ==========================================================
  const MouseGlow = {
    init() {
      document.addEventListener('mousemove', Utils.throttle((e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mouse-x', x + '%');
        document.documentElement.style.setProperty('--mouse-y', y + '%');
      }, 50));
    }
  };

  // ==========================================================
  // NEWSLETTER FORM
  // ==========================================================
  const Newsletter = {
    init() {
      const form = document.getElementById('newsletterForm');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        if (input && input.value) {
          const btn = form.querySelector('button');
          const original = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Subscribed';
          btn.disabled = true;
          input.value = '';
          setTimeout(() => {
            btn.innerHTML = original;
            btn.disabled = false;
          }, 3000);
        }
      });
    }
  };

  // ==========================================================
  // SMOOTH SCROLL FOR ALL ANCHOR LINKS
  // ==========================================================
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]:not(.nav-link)').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }
  };

  // ==========================================================
  // DEMO DATA POPULATOR
  // ==========================================================
  const DemoData = {
    init() {
      this.populateStats();
      this.populateYear();
    },

    populateStats() {
      document.querySelectorAll('.stat-number [data-target]').forEach(el => {
        el.textContent = '0';
      });
    },

    populateYear() {
      const els = document.querySelectorAll('.current-year');
      els.forEach(el => {
        el.textContent = new Date().getFullYear();
      });
    }
  };

  // ==========================================================
  // PRINT FUNCTIONALITY
  // ==========================================================
  const PrintResume = {
    init() {
      const btn = document.getElementById('printResume');
      if (!btn) return;

      btn.addEventListener('click', () => {
        window.print();
      });
    }
  };

  // ==========================================================
  // INITIALIZE EVERYTHING
  // ==========================================================
  // ==========================================================
  // PWA - SERVICE WORKER REGISTRATION
  // ==========================================================
  const PWA = {
    init() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
          .then(() => console.log('Service Worker registered'))
          .catch(() => console.log('Service Worker registration failed'));
      }
    }
  };

  const App = {
    init() {
      DemoData.init();
      LoadingScreen.init();
      PWA.init();

      // Load external libs then init dependent features
      this.initCore();
      this.initAfterLibs();
    },

    initCore() {
      Navigation.init();
      ScrollProgress.init();
      BackToTop.init();
      Particles.init();
      ThemeSwitcher.init();
      SkillBars.init();
      CircularSkills.init();
      AnimatedCounters.init();
      GitHubProjects.init();
      ProjectFilter.init();
      ContactForm.init();
      GitHubAPI.init();
      WeatherWidget.init();
      MusicToggle.init();
      GalleryLightbox.init();
      ContributionGraph.init();
      Card3D.init();
      MouseGlow.init();
      Newsletter.init();
      SmoothScroll.init();
      PrintResume.init();
    },

    initAfterLibs() {
      // These depend on external libraries loaded via CDN
      const initLibs = () => {
        if (window.AOS) AOSInit.init();
        if (window.Typed) TypedInit.init();
        if (window.Swiper) TestimonialsSwiper.init();
      };

      if (document.readyState === 'complete') {
        initLibs();
      } else {
        window.addEventListener('load', initLibs);
        // Also try after a delay in case CDN loads after window.load
        setTimeout(initLibs, 2000);
      }
    }
  };

  // ==========================================================
  // START THE APP
  // ==========================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

})();
