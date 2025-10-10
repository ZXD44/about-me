# 🚀 เว็บโปรไฟล์ส่วนตัว - Personal Profile Website

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🌟 เว็บไซต์โปรไฟล์ส่วนตัวที่สร้างด้วย React พร้อมฟีเจอร์ AI Chat, QR Donation และประสิทธิภาพที่เหนือกว่า

## ✨ ฟีเจอร์หลัก

- 🤖 **AI Chat Assistant** - เชื่อมต่อกับ Google Gemini 2.0 Flash
- 💰 **QR Donation System** - สร้าง QR Code สำหรับการบริจาค
- 👤 **Profile Management** - แสดงข้อมูลส่วนตัวและ social links
- 📱 **Responsive Design** - ทำงานได้ดีบนทุกอุปกรณ์
- ⚡ **Optimized Performance** - เว็บไซต์ลื่นไหลและรวดเร็ว

## 🚀 การติดตั้ง

### Prerequisites
- Node.js 18+ 
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

```bash
# Clone repository
git clone https://github.com/yourusername/profile-website.git
cd profile-website

# ติดตั้ง dependencies
npm install

# เริ่มต้น development server
npm start
```

### Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

## 🔧 การใช้งาน

```bash
# Development Mode
npm start

# Production Build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🏗️ โครงสร้างโปรเจค

```
src/
├── features/                 # Feature-based modules
│   ├── ai-chat/            # AI Chat functionality
│   ├── profile/            # Profile management
│   ├── qr-donation/        # QR donation system
│   └── social/             # Social media integration
├── shared/                  # Shared components & utilities
│   ├── components/         # Reusable components
│   ├── config/             # Configuration files
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styles
│   └── assets/             # Images & static files
├── App.js                  # Main application component
└── index.js                # Application entry point
```

## ⚙️ การตั้งค่า

### API Configuration
แก้ไขไฟล์ `src/shared/config/api.js`:

```javascript
export const API_CONFIG = {
  QR_API_URL: "https://www.pp-qr.com/api/your_number"
};
```

### Profile Data
แก้ไขไฟล์ `src/features/profile/data/profile.js`:

```javascript
export const profile = {
  name: "Your Name",
  username: "@yourusername",
  avatar: avatarImage,
  socials: [
    { key: "github", label: "GitHub", url: "https://github.com/username" },
    { key: "telegram", label: "Telegram", url: "https://t.me/username" }
  ]
};
```

## 📱 Responsive Design

- **Mobile First** approach
- **Breakpoints**: 320px, 768px, 1024px, 1440px
- **Touch-friendly** interfaces
- **Optimized** for all screen sizes

## ⚡ Performance Optimizations

- **Reduced animations** สำหรับประสิทธิภาพที่ดีขึ้น
- **Optimized CSS** ลด GPU usage
- **Simplified effects** เพื่อความลื่นไหล
- **Hardware acceleration** สำหรับ smooth transitions

## 🔒 ความปลอดภัย

- ใช้ environment variables สำหรับ API keys
- ไม่ commit API keys ลง Git
- Input validation และ sanitization
- HTTPS enforcement ใน production

## 📦 การ Deploy

### GitHub Pages
```bash
npm run deploy
```

### Netlify/Vercel
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `build`

## 🧪 Testing

```bash
npm test
npm run test:coverage
```

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 ผู้พัฒนา

**ZirconX** (@ZX1150)
- GitHub: [ZXD44](https://github.com/ZXD44)
- Telegram: [@ZirconXD](https://t.me/ZirconXD)
- YouTube: [@zirconxd](https://www.youtube.com/@zirconxd)
- TikTok: [@zirconxd](https://www.tiktok.com/@zirconxd)

---

⭐ **Star this repository if you find it helpful!**