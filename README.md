# 🌴 Hacker House Goa 2026 — Builder Pass Generator

<div align="center">

![Hacker House Goa 2026 Banner](public/idCardTemplate.png)

### **Mint Your Official Hacker House Goa Builder Pass in Seconds** ⚡

[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live_Demo-hhgoa--own--id--card.vercel.app-FE007A?style=for-the-badge&logo=vercel&logoColor=white)](https://hhgoa-own-id-card.vercel.app)

---

</div>

## 🌟 Overview

**Hacker House Goa 2026 Builder Pass Generator** is a state-of-the-art, interactive web app built to empower builders, developers, and creators attending Hacker House Goa 2026. Custom-designed with rich glassmorphism aesthetics, dynamic 3D holographic tilt physics, and seamless social sharing features, this app lets attendees personalize, download, and share their official high-resolution Builder Pass on X (Twitter) with one click.

🎟️ **Live Web Application**: [https://hacker-house-goa-26-theme-card.vercel.app/](https://hacker-house-goa-26-theme-card.vercel.app/)

---

## ✨ Key Features

### 🎴 3D Gyroscope & Holographic Shimmer
- **Interactive 3D Mouse & Touch Tracking**: Hovering over the pass tilts the card with realistic 3D perspective rendering (`rotateX`, `rotateY`, `perspective`).
- **Dynamic Holographic Foil**: Smooth multi-color radial specular gloss reflection (`#FEE101` yellow, `#FF007A` pink, `#00F0FF` cyan) that reacts to user cursor position.

### 🖼️ Live Avatar Crop & Position Tool
- **Drag-to-Align**: Drag inside the circular live preview ring to align your avatar photo.
- **Zoom & Reset Controls**: Adjustable zoom slider (`0.5x` to `2.5x`) and one-click circular **Reset Icon (`RotateCcw`)**.
- **Dark Glassmorphic UI**: High-contrast, dark translucent frame matching the Hacker House Goa aesthetic.

### 📥 High-Resolution PNG Exporter
- **Ultra-Crisp 3x Pixel Ratio Output**: Uses a robust `html-to-image` rendering engine to capture background templates, custom avatar positioning, text overlays, and QR codes into a high-res PNG file (`HH-Goa-Builder-Card-#ID.png`).
- **3D Transform Auto-Flattening**: Temporarily flattens 3D tilt vectors during capture to guarantee zero rendering artifacts across all browsers.

### 🚀 1-Click Share to X (Twitter) & System Clipboard
- **Clipboard Sync**: Automatically writes the generated PNG image Blob directly to the system Clipboard using the synchronous `ClipboardItem` Promise pattern (`navigator.clipboard.write`).
- **Pre-filled Tweet Intent**: Opens X with an optimized caption (<280 chars) pre-populated with user details and hashtags (`#FrameInGoa #HHGoa2026 #BuildInPublic`). Simply press `Ctrl + V` in the post dialog to attach the image!

### 📱 100% Mobile & Responsive Layout
- **Single-Viewport Landing Page**: Zero vertical scroll overflow (`100vh`) with background blur (`blur(4px)`).
- **Responsive Top Navbar**: Dynamic layout switching ensures the **VIBE CHECK** pill button is always pinned to the top-right corner on every device viewport down to 320px width.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Core Framework** | [React 18](https://reactjs.org/) + [Vite 6](https://vitejs.dev/) |
| **Language** | Modern JavaScript (ES6+ / JSX) |
| **Styling & Effects** | Vanilla CSS3 (CSS Variables, Flexbox, Grid, 3D Transforms, Glassmorphism) |
| **Export Engine** | [`html-to-image`](https://www.npmjs.com/package/html-to-image) + HTML5 Canvas API |
| **Icons & QR** | [`lucide-react`](https://lucide.dev/) + [`qrcode.react`](https://www.npmjs.com/package/qrcode.react) |
| **Typography** | Google Fonts (*Space Mono*, *Playfair Display*, *Plus Jakarta Sans*, *Rozha One*) |

---

## 📁 Repository Structure

```text
hacker-house/
├── public/
│   ├── assets/
│   │   ├── 2-47.svg                 # 2:47 PM Studio Logo
│   │   ├── goa-beach-bg.png         # Goa Tropical Background Template
│   │   └── Hacker house.png         # Main Hacker House Title Graphic
│   ├── favicon.webp                 # Website Favicon (Sunset Beach Silhouette)
│   ├── idCardTemplate.png           # High-Res ID Card Template Artwork
│   └── site.webmanifest             # Web App Manifest
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Header.jsx           # Top Navbar (Logo, CTA, Vibe Check Pill)
│   │   │   ├── HeroSection.jsx      # Hero Banner with 3D Float Title
│   │   │   ├── HypeVideoModal.jsx   # Vibe Check Video Overlay Modal
│   │   │   ├── InitialPreloader.jsx # Smooth Theme Preloader
│   │   │   └── landing.css          # Landing Page Styles & Breakpoints
│   │   ├── BlendedAgendaGenerator.jsx # Main 4-Frame Builder Pass Workspace
│   │   ├── HHGoaCard.jsx            # 3D Gyroscope Pass Preview Component
│   │   ├── UploadPhoto.jsx          # Avatar Upload, Crop & Zoom Controls
│   │   ├── DownloadButton.jsx       # PNG Card Download Action Button
│   │   ├── ShareButton.jsx          # Share to X & Clipboard Copy Action
│   │   └── QRCode.jsx               # Dynamic QR Code Component
│   ├── styles/
│   │   ├── BlendedAgendaGenerator.css # Glassmorphism 4-Frame Grid Layout
│   │   ├── Buttons.css              # Custom Yellow/Pink Action Buttons & Modal
│   │   ├── HHGoaCard.css            # 3D Foil, Shimmer & Typography Styles
│   │   └── UploadPhoto.css          # Crop Preview Ring & Dark Container Styles
│   ├── utils/
│   │   ├── exportUtils.js           # HTML-to-Image Exporter & Download Trigger
│   │   └── imageUtils.js            # Base64 Data URL FileReader Helper
│   ├── App.jsx                      # Main View State Controller
│   ├── index.css                    # Design Tokens & Global CSS Reset
│   └── main.jsx                     # React DOM Entry Point
├── index.html                       # HTML5 Shell & Google Fonts Preconnect
├── package.json                     # Node Dependencies & Scripts
└── README.md                        # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18.0 or higher) and **npm** installed on your system.

### 1. Clone the Repository
```bash
git clone https://github.com/ARPITPRAJAPATI/HackerHouseGoa-26---Theme-Card.git
cd HackerHouseGoa-26---Theme-Card
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application live.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 📸 Usage Walkthrough

1. **Enter Details**: Type your Name & Stack/Role in Box 1 (**BUILDER INFO**).
2. **Upload Avatar**: Drag & drop your profile photo into Box 2 (**AVATAR PHOTO**), zoom or drag to align your face inside the crop circle.
3. **Preview Pass**: Watch your pass dynamically update on the center stage with real-time 3D tilt & holographic sheen.
4. **Download & Share**:
   - Click **Download Pass** to save the `.png` pass file directly to your downloads.
   - Click **Share to X** to auto-copy the card to your clipboard and tweet your pass on X with `#FrameInGoa #HHGoa2026`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/ARPITPRAJAPATI/HackerHouseGoa-26---Theme-Card/issues).

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">

Crafted with ❤️ for **Hacker House Goa 2026** by [2:47 PM Studio](https://hhgoa-own-id-card.vercel.app)

</div>
