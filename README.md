# Portfolio Website

<div align="center">
  <img src="assets/images/screenshot.jpg" alt="Portfolio Screenshot" width="700" style="border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
</div>

<p align="center">
  <strong>A premium, responsive, animated personal portfolio website built with vanilla web technologies.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white">
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white">
</p>

---

## ✨ Features

- **Design**: Glassmorphism, soft shadows, gradient colors, premium typography
- **Animations**: AOS scroll reveal, GSAP, Typed.js, Swiper.js, particle background
- **Themes**: 5 color themes (Blue, Purple, Green, Orange, Gold) + Dark/Light mode
- **Responsive**: Fully responsive across all devices (desktop, tablet, mobile)
- **Interactive**: Custom cursor, 3D card tilt, mouse glow, ripple effects
- **Performance**: Lazy loading, optimized CSS/JS, Lighthouse score 95+
- **PWA Ready**: Manifest.json, offline support, service worker ready
- **SEO**: Open Graph, Twitter Cards, semantic HTML, sitemap.xml
- **Testing**: Jest unit tests with 90%+ coverage target

## 🛠️ Technologies

| Category | Technologies |
|----------|-------------|
| **Core** | HTML5, CSS3, JavaScript (ES6+) |
| **Framework** | Bootstrap 5 |
| **Animation** | AOS, GSAP, Typed.js, Swiper.js |
| **Icons** | Font Awesome 6 |
| **Fonts** | Google Fonts (Inter, JetBrains Mono) |
| **Contact** | EmailJS, Google Sheets |
| **Testing** | Jest with JSDOM |
| **Deployment** | GitHub Pages |

## 📁 Folder Structure

```
portfolio/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   ├── videos/
│   └── files/
│       └── resume.pdf
├── pages/
│   ├── 404.html
│   └── privacy.html
├── tests/
│   └── utils.test.js
├── docs/
├── index.html
├── manifest.json
├── robots.txt
├── sitemap.xml
├── package.json
├── README.md
└── LICENSE
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio.git

# Navigate to project
cd portfolio

# Install dependencies (for testing)
npm install
```

### Run Locally

Open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 5500

# Using VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

### Git Commands

```bash
# Initialize git
git init

# Add remote
git remote add origin https://github.com/yourusername/portfolio.git

# Commit and push
git add .
git commit -m "Initial commit: Portfolio website"
git push -u origin main
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# View coverage report
open coverage/lcov-report/index.html
```

## 📧 EmailJS Setup

1. Create account at [EmailJS](https://www.emailjs.com/)
2. Create an email service and template
3. Update `CONFIG.emailjs` in `assets/js/main.js`:

```javascript
const CONFIG = {
  emailjs: {
    serviceID: 'your_service_id',
    templateID: 'your_template_id',
    publicKey: 'your_public_key'
  }
};
```

## 📊 Google Sheets Setup

1. Create a Google Apps Script Web App
2. Deploy as web app (execute as "me", access: "anyone")
3. Update the `scriptURL` in `assets/js/main.js`:

```javascript
const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

## 🌐 Deployment (GitHub Pages)

1. Push repository to GitHub
2. Go to Settings → Pages
3. Select `main` branch and `/ (root)` folder
4. Click Save
5. Your site will be live at `https://yourusername.github.io/portfolio`

## 🎨 Customization

### Theme Colors

Edit CSS variables in `assets/css/style.css`:

```css
:root {
  --primary: #0d6efd;
  --gradient-primary: linear-gradient(135deg, #0d6efd, #0a58ca);
}
```

### Content

Update demo content in `index.html` - replace names, descriptions, images, and links with your own information.

### Social Links

Replace `yourusername` placeholders in the HTML and JS files with your actual social media usernames.

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td><img src="assets/images/screenshot.jpg" alt="Hero Section" width="400"></td>
      <td><img src="assets/images/project-1.jpg" alt="Projects Section" width="400"></td>
    </tr>
    <tr>
      <td><img src="assets/images/project-2.jpg" alt="Skills Section" width="400"></td>
      <td><img src="assets/images/project-3.jpg" alt="Contact Section" width="400"></td>
    </tr>
  </table>
</div>

## 🎯 Lighthouse Scores

| Category | Score |
|----------|-------|
| Performance | 95+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 95+ |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Mohammad Rakibul Islam**

- GitHub: [@rakibAdnan10](https://github.com/rakibAdnan10)
- Facebook: [Mohammad Rakib](https://www.facebook.com/share/1EYY2KtDyQ/)
- Email: rakibmohammad2002@gmail.com

---

<div align="center">
  <strong>⭐ Don't forget to star the repo if you like it!</strong>
</div>
