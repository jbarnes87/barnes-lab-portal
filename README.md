# 🏠 Barnes Lab - Home Lab Portal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A futuristic, single-page portal for the Barnes Lab home lab environment. This project showcases real-time timezone information, system status indicators, and serves as a gateway to explore various home lab services and projects.

## 🎨 Visual Design

The portal features a **cyberpunk/sci-fi aesthetic** with:
- Neon cyan and magenta accent colors against dark backgrounds
- Animated gradient orbs that float in the background
- Smooth parallax effects on interactive elements
- Real-time clock displays for multiple timezones (Zulu/UTC, Mountain, East Coast)
- Glass-morphism card designs with subtle hover animations
- Fully responsive layout optimized for desktop and mobile devices

## 📁 Project Structure

```
barnes_lab/
├── landing.html          # Main HTML page (entry point)
├── styles.css            # Complete stylesheet with all styling
├── scripts.js            # Interactive JavaScript functionality
├── README.md             # This documentation file
└── assets/               # Optional: images, icons, fonts (if needed)
```

## 🚀 Quick Start

### Option 1: Direct File Opening (Simplest)

Simply open the HTML file in any modern web browser:

```bash
# macOS
open landing.html

# Linux
xdg-open landing.html

# Windows
start landing.html
```

**Note:** Some browsers may restrict certain features (like font loading or animations) when opening files directly via `file://` protocol. For full functionality, use a local web server (Option 2).

### Option 2: Local Web Server (Recommended)

Run a simple HTTP server to serve the files properly:

#### Using Python 3
```bash
cd barnes_lab
python3 -m http.server 8080
```

Then visit: `http://localhost:8080/landing.html`

#### Using Node.js (http-server)
```bash
# Install globally if needed
npm install -g http-server

# Run server
cd barnes_lab
http-server -p 8080
```

#### Using PHP Built-in Server
```bash
cd barnes_lab
php -S localhost:8080
```

### Option 3: Production Deployment

Deploy to any static hosting platform:

- **GitHub Pages**: Push to a repository and enable GitHub Pages
- **Netlify**: Drag and drop the folder onto [netlify.com](https://app.netlify.com)
- **Vercel**: Connect your Git repository or deploy via CLI
- **Cloudflare Pages**: Upload directly through the dashboard

## 🖥️ System Requirements

### Minimum Requirements
| Component | Requirement |
|-----------|-------------|
| Browser | Chrome 90+, Firefox 85+, Safari 14+, Edge 90+ |
| JavaScript | ES6+ support required (enabled by default in modern browsers) |
| Network | Internet connection for Google Fonts loading (optional, see below) |

### Optional: Offline Mode

To use the portal without internet access (fonts will fallback to system fonts):

1. Download the font files from Google Fonts:
   - [Orbitron](https://fonts.google.com/specimen/Orbitron)
   - [Rajdhani](https://fonts.google.com/specimen/Rajdhani)

2. Place them in an `assets/fonts/` directory and update the CSS to load locally instead of from Google Fonts CDN.

## 🌐 Features Overview

### Real-Time Clocks

Three timezone displays that automatically update every second:
- **Zulu Time (UTC)** - Universal Coordinated Time, used by military and aviation
- **Mountain Time** - US Mountain West timezone
- **East Coast Time** - US Eastern timezone

Each clock shows both the current time in 24-hour format and a formatted date with weekday.

### Interactive Elements

- **Hover Effects**: Cards lift and glow when hovered over
- **Tilt Animation**: Clock cards show subtle 3D tilt based on mouse position
- **Click to View**: Click any clock card to see the current time in a custom tooltip
- **Smooth Animations**: All animations use CSS transitions for optimal performance

### Custom Cursor Effects (Optional)

The portal includes a custom cursor that follows your mouse with a slight delay, creating a smooth effect. This can be toggled on/off via browser console:

```javascript
// Toggle cursor effects
window.toggleBarnesFeatures();
```

## ⚙️ Configuration

### Customizing Timezones

Edit the `config.timezoneAliases` object in `scripts.js`:

```javascript
const config = {
    timezoneAliases: {
        zulu: 'UTC',                          // Change to your preferred timezone
        mountain: 'America/Denver',           // IANA timezone strings
        eastern: 'America/New_York'
    },
    // ... rest of configuration
};
```

Available timezones: [IANA Time Zone Database](https://www.iana.org/time-zones)

### Customizing Colors

Modify the CSS custom properties in `styles.css`:

```css
:root {
    --primary: #00f5ff;           /* Main accent color */
    --secondary: #ff00aa;         /* Secondary accent color */
    --accent: #00aaff;            /* Additional accent */
    --bg-dark: #0a0a12;           /* Dark background */
    // ... more variables
}
```

### Disabling Animations

For users who prefer reduced motion (accessibility):

1. The portal respects `prefers-reduced-motion` system setting automatically
2. To disable all animations manually, add to `scripts.js`:

```javascript
config.animationSettings = {
    enableParallax: false,
    enableScrollReveal: false,
    cursorEffects: false
};
```

## 🔧 Development

### Adding New Features

1. **New Clock Display**: Add a new card in `landing.html` with matching IDs for the clock and date elements, then add to `config.timezoneAliases` in `scripts.js`.

2. **Custom Animations**: Add keyframes to either:
   - `styles.css` under existing `@keyframes` sections
   - Dynamically via JavaScript by appending `<style>` elements

3. **New Interactive Elements**: Follow the pattern in `scripts.js`:
   ```javascript
   // Initialize on DOM ready
   function initFeature() {
       document.addEventListener('DOMContentLoaded', () => {
           // Your initialization code
       });
   }
   ```

### Debugging

Open browser DevTools (F12) and look for console logs prefixed with:
- `⚡ BARNES LAB PORTAL` - Initialization status
- Active feature toggles
- Performance metrics

## 📱 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| Full Support | ✓ 90+ | ✓ 85+ | ✓ 14+ | ✓ 90+ | ✓ iOS 15+, Android 8+ |
| CSS Custom Properties | ✓ | ✓ | ✓ | ✓ | ✓ |
| Grid Layout | ✓ | ✓ | ✓ | ✓ | ✓ |
| ES6 JavaScript | ✓ | ✓ | ✓ | ✓ | ✓ |

## 🎯 Use Cases

This portal is ideal for:
- **Home Lab Enthusiasts**: Showcase your lab projects and services
- **System Administrators**: Quick access to system status at a glance
- **Developers**: Learning resource for modern CSS/JavaScript techniques
- **Portfolios**: Unique way to present personal or project information

## 🔐 Security Considerations

- No external API calls except Google Fonts (can be made optional)
- All JavaScript runs client-side; no data is sent to servers
- No cookies or local storage used
- Safe to deploy on any public-facing server

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📮 Support & Questions

For questions or issues, please open an issue in the repository or contact the project maintainer.

---

**Built with ❤️ for home lab enthusiasts everywhere.**

*Last updated: 2026*
