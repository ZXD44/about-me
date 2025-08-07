import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import avater from "./avater.jpg";

// Social icons as images
const socialIcons = {
  github: <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="GitHub" style={{ width: 22, height: 22, filter: 'invert(1)' }} />, 
  telegram: <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telegram.svg" alt="Telegram" style={{ width: 22, height: 22, filter: 'invert(1)' }} />, 
  youtube: <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" alt="YouTube" style={{ width: 22, height: 22, filter: 'invert(1)' }} />, 
  tiktok: <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" alt="TikTok" style={{ width: 22, height: 22, filter: 'invert(1)' }} />, 
  qr: <img src="https://iili.io/F7F9n94.png" alt="Coffee" style={{ width: 22, height: 22, objectFit: 'contain', padding: 1, filter: 'invert(1)' }} />,
  ai: <img src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png" alt="AI" style={{ width: 22, height: 22, objectFit: 'contain', padding: 1, filter: 'invert(1)' }} />,
  lan: <img src="https://cdn-icons-png.flaticon.com/512/1087/1087815.png" alt="LAN Guide" style={{ width: 22, height: 22, objectFit: 'contain', padding: 1, filter: 'invert(1)' }} />,
  game: <img src="https://cdn-icons-png.flaticon.com/512/686/686589.png" alt="Mini Game" style={{ width: 22, height: 22, objectFit: 'contain', padding: 1, filter: 'invert(1)' }} />
};

const theme = {
  bg: "#181a20",
  card: "rgba(255,255,255,0.92)",
  border: "1.5px solid #475569",
  accent: "#334155",
  accent2: "#475569",
  text: "#181a20",
  textSoft: "#64748b",
  font: 'Kanit, Prompt, Noto Sans Thai, Inter, Sarabun, sans-serif',
  shadow: "0 4px 32px 0 #33415533",
  socialBg: "#fff",
  socialBorder: "1.2px solid #475569",
  socialHover: "#334155",
  socialText: "#334155",
};

const profile = {
  name: "ZirconX",
  username: "@ZX1150",
  avatar: avater,
  socials: [
    { key: "github", label: "GitHub", url: "https://github.com/ZXD44" },
    { key: "telegram", label: "Telegram", url: "https://t.me/ZirconXD" },
    { key: "youtube", label: "YouTube", url: "https://www.youtube.com/@zirconxd" },
    { key: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@zirconxd" },
    { key: "qr", label: "Donate", url: "#", isButton: true },
    { key: "ai", label: "AI Chat", url: "#", isButton: true },
    { key: "lan", label: "LAN Guide", url: "#", isButton: true },
    { key: "game", label: "Mini Game", url: "#", isButton: true },
  ],
};

// 1. Meta Verified icon (blue tick, not Facebook)
const metaVerifyIcon = (
  <img src="https://torro.io/hs-fs/hubfs/Meta-Verified-Packages-Checkmark.png?width=168&height=168&name=Meta-Verified-Packages-Checkmark.png" alt="Meta Verified" style={{ width: 22, height: 22, marginLeft: 0, paddingLeft: 0, verticalAlign: 'middle', position: 'relative', top: '-2.5px' }} />
);

// --- Grapheme splitter for Thai (to keep vowels/marks with base char) ---
function splitGraphemes(str) {
  // Use Intl.Segmenter if available (modern browsers)
  if (window.Intl && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('th', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(str), s => s.segment);
  }
  // Fallback: naive split (may not work for all Thai)
  return str.split("");
}

// AnimatedSwitchingHeader: ใช้เอฟเฟกต์เดียวกับ AnimatedSwitchingText และสลับข้อความทุก 3 วิ
function AnimatedSwitchingHeader() {
  const texts = [
    { text: "การให้คือความสุข", color: "#334155" },
    { text: "ขอบคุณสำหรับกำลังใจ", color: "#334155" }
  ];
  const [idx, setIdx] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    setVisible(false);
    const showTimer = setTimeout(() => setVisible(true), 80);
    const switchTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setIdx(i => (i + 1) % texts.length), 400);
    }, 3000 + 700);
    return () => { clearTimeout(showTimer); clearTimeout(switchTimer); };
  }, [idx]);
  return (
    <h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 8, marginTop: 2, height: 32, minHeight: 32, position: 'relative', color: texts[idx].color, fontWeight: 700, fontSize: 22, letterSpacing: 1, fontFamily: theme.font }}>
      <span
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.7)',
          transition: 'opacity 0.45s cubic-bezier(.4,0,.2,1), transform 0.45s cubic-bezier(.4,0,.2,1)',
          textShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'inline-block',
        }}
      >
        {texts[idx].text}
      </span>
    </h2>
  );
}

function App() {
  // Popup state
  const [popup, setPopup] = useState(null); // 'qr' | 'chat' | 'lan' | 'game' | null
  // QR PromptPay state
  const [qrAmount, setQrAmount] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");
  // AI Chat State
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState([
    { role: "assistant", content: "สวัสดี! ฉันคือ AI พร้อมช่วยเหลือคุณได้ทุกเรื่อง ลองถามมาได้เลย :)" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const aiChatEndRef = useRef(null);
  useEffect(() => { aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiChat, aiLoading]);
  const API_KEY = "62b896fcf06bf3abe0f767353a628cf2318a896030406fb3fc53d6cfed215dbe";
  const API_URL = "https://api.together.xyz/v1/chat/completions";
  const MODEL = "deepseek-ai/DeepSeek-V3";
  async function handleAiSend(e) {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const userMsg = { role: "user", content: aiInput };
    setAiChat(prev => [...prev, userMsg]);
    setAiInput("");
    setAiLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [...aiChat, userMsg].slice(-10),
          max_tokens: 1024,
        }),
      });
      const data = await res.json();
      const aiMsg = data.choices?.[0]?.message?.content || "[AI ไม่สามารถตอบกลับได้]";
      setAiChat(prev => [...prev, { role: "assistant", content: aiMsg }]);
    } catch (err) {
      setAiChat(prev => [...prev, { role: "assistant", content: "[เกิดข้อผิดพลาดในการเชื่อมต่อ AI]" }]);
    }
    setAiLoading(false);
  }
  // QR
  const handleCreateQR = async () => {
    setQrError("");
    setQrImage("");
    if (!qrAmount || isNaN(qrAmount) || Number(qrAmount) <= 0) {
      setQrError("กรุณากรอกจำนวนเงินให้ถูกต้อง");
      return;
    }
    setQrLoading(true);
    try {
      const response = await fetch(`https://www.pp-qr.com/api/0968237098/${qrAmount}`);
      if (response.ok) {
        const data = await response.json();
        setQrImage(data.qrImage);
      } else {
        setQrError("เกิดข้อผิดพลาดในการสร้าง QR");
      }
    } catch (e) {
      setQrError("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
    }
    setQrLoading(false);
  };
  // Responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // เพิ่ม state สำหรับเลือกวิธี Donate และ Angpao
  const [donateType, setDonateType] = useState("promptpay"); // "promptpay" หรือ "angpao"
  const [phone, setPhone] = useState("");
  const [voucherUrl, setVoucherUrl] = useState("");
  // [1] เพิ่ม state ใหม่สำหรับ popup แจ้งเตือนมือถือเท่านั้น
  const [showMobileOnly, setShowMobileOnly] = useState(false);
  
  // Mini Game State
  const [gameScore, setGameScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [gameTime, setGameTime] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameTargets, setGameTargets] = useState([]);
  const [gameClicks, setGameClicks] = useState(0);
  // Mini Game Functions
  const startGame = () => {
    setGameActive(true);
    setGameScore(0);
    setGameClicks(0);
    setGameTime(30);
    setGameLevel(1);
    setGameTargets([]);
    
    // Start game timer
    const gameTimer = setInterval(() => {
      setGameTime(prev => {
        if (prev <= 1) {
          clearInterval(gameTimer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Generate targets
    generateTarget();
  };
  
  const endGame = () => {
    setGameActive(false);
    setGameTargets([]);
    
    // Show final score with better formatting
    setTimeout(() => {
      const accuracy = gameClicks > 0 ? Math.round((gameScore / (gameClicks * 10)) * 100) : 0;
      const message = `🎮 เกมจบแล้ว!\n\n🏆 คะแนนรวม: ${gameScore}\n🎯 ความแม่นยำ: ${accuracy}%\n📊 เลเวลสูงสุด: ${gameLevel}\n👆 คลิกทั้งหมด: ${gameClicks}`;
      
      if (gameScore > 200) {
        alert(message + '\n\n🌟 ยอดเยี่ยม! คุณเล่นได้ดีมาก!');
      } else if (gameScore > 100) {
        alert(message + '\n\n👍 ดีมาก! ลองเล่นอีกครั้งเพื่อทำลายสถิติ!');
      } else {
        alert(message + '\n\n💪 ไม่เป็นไร ลองใหม่อีกครั้ง!');
      }
    }, 100);
  };
  
  const resetGame = () => {
    setGameActive(false);
    setGameScore(0);
    setGameLevel(1);
    setGameTime(30);
    setGameTargets([]);
    setGameClicks(0);
  };
  
  const generateTarget = () => {
    if (!gameActive) return;
    
    const colors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const baseSizes = [35, 40, 45, 50, 55];
    
    // Adjust difficulty based on level
    const levelMultiplier = Math.max(0.7, 1 - (gameLevel - 1) * 0.1);
    const adjustedSizes = baseSizes.map(size => Math.max(25, size * levelMultiplier));
    
    const newTarget = {
      x: Math.random() * 75 + 12.5, // 12.5-87.5% from left
      y: Math.random() * 75 + 12.5, // 12.5-87.5% from top
      color: colors[Math.floor(Math.random() * colors.length)],
      size: adjustedSizes[Math.floor(Math.random() * adjustedSizes.length)] + 'px',
      id: Date.now() + Math.random()
    };
    
    setGameTargets(prev => {
      // Limit max targets on screen based on level
      const maxTargets = Math.min(5, 2 + Math.floor(gameLevel / 2));
      if (prev.length >= maxTargets) return prev;
      return [...prev, newTarget];
    });
    
    // Remove target after some time (shorter time for higher levels)
    const targetLifetime = Math.max(1000, 3000 - (gameLevel - 1) * 200);
    setTimeout(() => {
      setGameTargets(prev => prev.filter(target => target.id !== newTarget.id));
    }, targetLifetime + Math.random() * 1000);
    
    // Generate next target (faster for higher levels)
    const nextTargetDelay = Math.max(300, 800 - (gameLevel - 1) * 50);
    setTimeout(() => {
      if (gameActive) generateTarget();
    }, nextTargetDelay + Math.random() * 500);
  };
  
  const handleTargetClick = (index) => {
    setGameClicks(prev => prev + 1);
    
    // Calculate points based on target size (smaller = more points)
    const target = gameTargets[index];
    const targetSize = parseInt(target.size);
    const points = Math.max(5, Math.round(60 - targetSize));
    
    setGameScore(prev => prev + points);
    
    // Create click effect
    const clickEffect = document.createElement('div');
    clickEffect.textContent = `+${points}`;
    clickEffect.style.cssText = `
      position: absolute;
      left: ${target.x}%;
      top: ${target.y}%;
      transform: translate(-50%, -50%);
      color: #10b981;
      font-weight: bold;
      font-size: 18px;
      pointer-events: none;
      z-index: 1000;
      animation: scorePopup 1s ease-out forwards;
    `;
    
    // Add keyframe animation
    if (!document.querySelector('#scoreAnimation')) {
      const style = document.createElement('style');
      style.id = 'scoreAnimation';
      style.textContent = `
        @keyframes scorePopup {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1) translateY(-30px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
      gameArea.appendChild(clickEffect);
      setTimeout(() => clickEffect.remove(), 1000);
    }
    
    // Remove clicked target
    setGameTargets(prev => prev.filter((_, i) => i !== index));
    
    // Level up every 100 points
    if ((gameScore + points) >= gameLevel * 100) {
      setGameLevel(prev => prev + 1);
      // Add bonus time for level up
      setGameTime(prev => prev + 5);
    }
  };
  
  // Start generating targets when game is active
  React.useEffect(() => {
    if (gameActive && gameTargets.length === 0) {
      generateTarget();
    }
  }, [gameActive]);

  // Layout
  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: theme.bg, fontFamily: theme.font, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: isMobile ? "auto" : "hidden" }}>
      {/* Prevent horizontal and vertical scroll on body */}
      <style>{`
        body { 
          overscroll-behavior: none; 
          margin: 0; 
          padding: 0; 
          overflow-x: hidden !important; 
          overflow-y: hidden !important; 
          background: ${theme.bg} !important; 
        }
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .game-target {
          animation: fadeIn 0.3s ease-out, pulse 0.5s ease-in-out infinite alternate 0.3s;
        }
        .game-target:hover {
          transform: translate(-50%, -50%) scale(1.2) !important;
          transition: transform 0.1s ease;
        }
        .wire-model {
          transition: all 0.3s ease;
        }
        .wire-model:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 6px 25px rgba(59, 130, 246, 0.2) !important;
        }
      `}</style>
      {/* BG Cat Cover */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}>
        <div className="bg-banner" style={{ width: "100vw", height: "100vh", backgroundImage: "url('https://meo.pp.ua/ds.gif')", backgroundSize: isMobile ? "cover" : "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", filter: "brightness(0.98)" }} />
      </div>
      <div style={{ position: "relative", zIndex: 2, width: isMobile ? "100%" : "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: 'rgba(255,255,255,0.18)',
          border: '1.5px solid #47556922',
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
          padding: isMobile ? 10 : 36,
          maxWidth: isMobile ? 360 : 420,
          width: "100%",
          margin: isMobile ? 6 : 18,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderTop: '1.5px solid rgba(255,255,255,0.25)',
          borderLeft: '1.5px solid rgba(255,255,255,0.12)',
          borderRight: '1.5px solid rgba(255,255,255,0.12)',
          borderBottom: '1.5px solid rgba(59,130,246,0.12)',
        }}>
          {/* 3. Animated LoveTIP text above avatar */}
          <AnimatedSwitchingText />
          <div style={{ position: "relative", marginBottom: isMobile ? 6 : 10 }}>
            <img
              src={profile.avatar}
              alt="avatar"
              style={{ width: isMobile ? 80 : 120, height: isMobile ? 80 : 120, borderRadius: "50%", objectFit: "cover", border: `2.5px solid ${theme.accent}` }}
              onContextMenu={e => e.preventDefault()}
              onDragStart={e => e.preventDefault()}
              draggable={false}
            />
          </div>
          <div style={{ fontWeight: 700, fontSize: isMobile ? 18 : 28, color: theme.text, marginBottom: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginTop: 0, marginBottom: 4 }}>
            <span>{profile.name}{metaVerifyIcon}</span>
          </div>
          <div style={{ color: '#1e293b', fontSize: isMobile ? 13 : 18, marginBottom: isMobile ? 10 : 18, marginTop: 2, fontWeight: 600, letterSpacing: 0.2, marginLeft: -8 }}>{profile.username}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 8 : 12, justifyContent: "center", marginBottom: isMobile ? 14 : 24, width: "100%" }}>
            {profile.socials.map(s => (
              s.isButton ? (
                <button key={s.key} onClick={() => {
                  if (s.key === 'ai') setPopup('chat');
                  else if (s.key === 'lan') {
                    // Show popup first, then user can choose to open full guide
                    setPopup('lan');
                  }
                  else setPopup(s.key);
                }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#181a20",
                    borderRadius: 8,
                    padding: isMobile ? "6px 10px" : "7px 14px",
                    color: "#fff",
                    fontWeight: isMobile ? 700 : 600,
                    fontSize: isMobile ? 13 : 15,
                    textDecoration: "none",
                    boxShadow: theme.shadow,
                    border: "none",
                    transition: "box-shadow 0.18s, transform 0.18s, background 0.18s",
                    outline: "none",
                    cursor: "pointer",
                    width: isMobile ? "100%" : undefined,
                    minWidth: isMobile ? 120 : undefined
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#23272f';
                    e.currentTarget.style.boxShadow = '0 0 0 4px #23272f44, 0 4px 24px #23272f55, 0 1.5px 8px #23272f22';
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = '#181a20';
                    e.currentTarget.style.boxShadow = theme.shadow;
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span>{socialIcons[s.key]}</span> {s.label}
                </button>
              ) : (
                <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#181a20", borderRadius: 8, padding: isMobile ? "6px 10px" : "7px 14px", color: "#fff", fontWeight: 600, fontSize: isMobile ? 13 : 15, textDecoration: "none", boxShadow: theme.shadow, border: "none", transition: "box-shadow 0.18s, transform 0.18s, background 0.18s", outline: "none", width: isMobile ? "100%" : undefined, minWidth: isMobile ? 120 : undefined }}
                  onMouseOver={e => { e.currentTarget.style.background = '#23272f'; e.currentTarget.style.boxShadow = '0 0 0 4px #23272f44, 0 4px 24px #23272f55, 0 1.5px 8px #23272f22'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#181a20'; e.currentTarget.style.boxShadow = theme.shadow; e.currentTarget.style.transform = 'none'; }}
                >
                  <span>{socialIcons[s.key]}</span> {s.label}
                </a>
              )
            ))}
          </div>
          <div style={{ color: '#334155', fontSize: isMobile ? 11 : 13, marginTop: isMobile ? 10 : 18, textAlign: "center", fontWeight: 600, letterSpacing: 0.2 }}>Thank You<br/>© 2025 is Hdxw,Meo</div>
        </div>
      </div>
      {/* QR PromptPay Popup */}
      {popup === "qr" && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.55)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            background: 'rgba(255,255,255,0.90)',
            border: '1.5px solid #475569',
            borderRadius: 22,
            padding: 28,
            minWidth: 260,
            maxWidth: 350,
            width: "95vw",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: theme.shadow,
            textAlign: "center",
            fontSize: "1.08rem",
            lineHeight: 1.75,
            transition: "background 0.2s",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)"
          }}>
            <button onClick={() => setPopup(null)} style={{ position: "absolute", top: 12, right: 18, background: theme.accent, color: '#fff', border: "none", borderRadius: 7, padding: "4px 15px", fontSize: 16, cursor: "pointer", zIndex: 2, fontWeight: 700, letterSpacing: 1, fontFamily: theme.font }}>ปิด</button>
            <AnimatedSwitchingHeader />
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center', gap: 10 }}>
              <button
                onClick={() => setDonateType("promptpay")}
                style={{
                  background: donateType === "promptpay" ? theme.accent : '#fff',
                  color: donateType === "promptpay" ? '#fff' : theme.accent,
                  border: `1.5px solid ${theme.accent2}`,
                  borderRadius: 8,
                  padding: '7px 14px',
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: donateType === "promptpay" ? theme.shadow : 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                  letterSpacing: 0.5,
                  fontFamily: theme.font,
                  marginRight: 0,
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = theme.accent2;
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.boxShadow = '0 0 0 4px #64748b44, 0 4px 24px #33415555';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = donateType === "promptpay" ? theme.accent : '#fff';
                  e.currentTarget.style.color = donateType === "promptpay" ? '#fff' : theme.accent;
                  e.currentTarget.style.boxShadow = donateType === "promptpay" ? theme.shadow : 'none';
                }}
              >
                พร้อมเพย์
              </button>
              <a
                href={isMobile ? "https://tmn.app.link/4e6SQXIKUxb" : undefined}
                target={isMobile ? "_blank" : undefined}
                rel={isMobile ? "noopener noreferrer" : undefined}
                style={{
                  display: 'inline-block',
                  background: '#fff',
                  color: theme.accent,
                  border: `1.5px solid ${theme.accent2}`,
                  borderRadius: 8,
                  padding: '7px 14px',
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                  letterSpacing: 0.5,
                  fontFamily: theme.font,
                  marginLeft: 0,
                  textDecoration: 'none',
                }}
                onClick={e => {
                  if (!isMobile) {
                    e.preventDefault();
                    setShowMobileOnly(true);
                  }
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = theme.accent2;
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.boxShadow = '0 0 0 4px #64748b44, 0 4px 24px #33415555';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = theme.accent;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ทรูมันนี่
              </a>
            </div>
            {donateType === "promptpay" && (
              <>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="จำนวนเงินที่ต้องการบริจาค (บาท)"
                  value={qrAmount}
                  onChange={e => setQrAmount(e.target.value)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: theme.border,
                    fontSize: 16,
                    width: "80%",
                    marginBottom: 16,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border 0.2s",
                    background: theme.card,
                    color: theme.accent,
                    fontFamily: theme.font
                  }}
                />
                <br />
                <button
                  onClick={handleCreateQR}
                  disabled={qrLoading}
                  style={{
                    background: qrLoading ? "#cbd5e1" : theme.accent,
                    color: '#fff',
                    border: `1.5px solid ${theme.accent2}`,
                    borderRadius: 10,
                    padding: "12px 38px",
                    fontSize: 17,
                    fontWeight: "bold",
                    cursor: qrLoading ? "not-allowed" : "pointer",
                    boxShadow: theme.shadow,
                    marginBottom: 16,
                    transition: "background 0.2s",
                    letterSpacing: 0.5,
                    fontFamily: theme.font
                  }}
                  onMouseOver={e => {
                    if (!qrLoading) {
                      e.currentTarget.style.background = theme.accent2;
                      e.currentTarget.style.boxShadow = '0 0 0 4px #64748b44, 0 4px 24px #33415555';
                      e.currentTarget.style.border = `1.5px solid ${theme.accent}`;
                    }
                  }}
                  onMouseOut={e => {
                    if (!qrLoading) {
                      e.currentTarget.style.background = theme.accent;
                      e.currentTarget.style.boxShadow = theme.shadow;
                      e.currentTarget.style.border = `1.5px solid ${theme.accent2}`;
                    }
                  }}
                >
                  {qrLoading ? "กำลังสร้าง..." : "สร้าง QR CODE สำหรับบริจาค"}
                </button>
                {qrError && (
                  <div style={{ color: theme.accent, marginBottom: 12, fontFamily: theme.font }}>{qrError}</div>
                )}
                {qrImage && (
                  <div style={{ marginTop: 20 }}>
                    <img
                      src={qrImage}
                      alt="QR Donate"
                      style={{ width: 180, height: 180, borderRadius: 12, border: `2px solid ${theme.accent2}`, background: theme.card, boxShadow: theme.shadow }}
                    />
                    <div style={{ marginTop: 8, color: theme.accent, fontWeight: "bold", fontFamily: theme.font }}>
                      นายสหภูมิ ทับทวี
                    </div>
                    <div style={{ color: theme.textSoft, fontSize: 14, fontFamily: theme.font }}>เบอร์ 096-823-7098</div>
                    <div style={{ color: theme.textSoft, fontSize: 14, fontFamily: theme.font }}>จำนวน {qrAmount} บาท</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {/* AI Chat Popup */}
      {popup === "chat" && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.55)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            background: 'rgba(255,255,255,0.90)',
            border: '1.5px solid #475569',
            borderRadius: 22,
            padding: 28,
            minWidth: 260,
            maxWidth: 350,
            width: "95vw",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: theme.shadow,
            textAlign: "center",
            fontSize: "1.08rem",
            lineHeight: 1.75,
            transition: "background 0.2s",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)"
          }}>
            <button onClick={() => setPopup(null)} style={{ position: "absolute", top: 12, right: 18, background: theme.accent, color: '#fff', border: "none", borderRadius: 7, padding: "4px 15px", fontSize: 16, cursor: "pointer", zIndex: 2, fontWeight: 700, letterSpacing: 1, fontFamily: theme.font }}>ปิด</button>
            <h2 style={{ color: theme.accent, fontWeight: 700, marginBottom: 8, letterSpacing: 0.5, fontFamily: theme.font }}>AI Chat</h2>
            <div style={{
              maxHeight: 220,
              minHeight: 80,
              overflowY: "auto",
              background: theme.card,
              borderRadius: 14,
              padding: 8,
              marginBottom: 16,
              boxShadow: "0 1.5px 8px #33415522",
              display: "flex",
              flexDirection: "column",
              gap: 7,
              fontSize: 14,
              fontFamily: theme.font,
            }}>
              {aiChat.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background: msg.role === "user" ? theme.accent : theme.card,
                  color: msg.role === "user" ? '#fff' : theme.textSoft,
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "7px 13px",
                  marginBottom: 2,
                  maxWidth: "85%",
                  boxShadow: msg.role === "user" ? theme.shadow : "0 1.5px 8px #33415522",
                  fontWeight: msg.role === "user" ? 600 : 500,
                  wordBreak: "break-word",
                  fontSize: 14,
                }}>{msg.content}</div>
              ))}
              {aiLoading && <div style={{ color: theme.accent, fontStyle: "italic", fontSize: 13 }}>AI กำลังพิมพ์...</div>}
              <div ref={aiChatEndRef} />
            </div>
            <form onSubmit={handleAiSend} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder="พิมพ์ข้อความ..."
                disabled={aiLoading}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { handleAiSend(e); } }}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: theme.border,
                  fontSize: 15,
                  outline: "none",
                  background: theme.card,
                  color: theme.accent,
                  fontFamily: theme.font,
                  marginRight: 4,
                }}
              />
              <button
                type="submit"
                disabled={aiLoading || !aiInput.trim()}
                style={{
                  background: theme.accent,
                  color: '#fff',
                  border: `1.5px solid ${theme.accent2}`,
                  borderRadius: 10,
                  padding: "10px 18px",
                  fontSize: 15,
                  fontWeight: "bold",
                  cursor: aiLoading || !aiInput.trim() ? "not-allowed" : "pointer",
                  boxShadow: theme.shadow,
                  marginBottom: 0,
                  opacity: aiLoading || !aiInput.trim() ? 0.6 : 1,
                  letterSpacing: 0.5,
                  fontFamily: theme.font,
                  outline: "none",
                  borderBottom: `2.5px solid ${theme.accent2}`,
                  borderTop: `2.5px solid ${theme.accent}`,
                  transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
                }}
                onMouseOver={e => {
                  if (!(aiLoading || !aiInput.trim())) {
                    e.currentTarget.style.background = theme.accent2;
                    e.currentTarget.style.boxShadow = '0 0 0 4px #64748b44, 0 4px 24px #33415555';
                    e.currentTarget.style.border = `1.5px solid ${theme.accent}`;
                  }
                }}
                onMouseOut={e => {
                  if (!(aiLoading || !aiInput.trim())) {
                    e.currentTarget.style.background = theme.accent;
                    e.currentTarget.style.boxShadow = theme.shadow;
                    e.currentTarget.style.border = `1.5px solid ${theme.accent2}`;
                  }
                }}
              >
                ส่ง
              </button>
            </form>
          </div>
        </div>
      )}
      {/* LAN Guide Popup - Interactive Tutorial */}
      {popup === "lan" && <LANGuideComponent onClose={() => setPopup(null)} />}

      {/* Mini Game Popup */}
      {popup === "game" && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.55)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            background: 'rgba(255,255,255,0.90)',
            border: '1.5px solid #475569',
            borderRadius: 22,
            padding: 28,
            minWidth: 320,
            maxWidth: 450,
            width: "95vw",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: theme.shadow,
            textAlign: "center",
            fontSize: "1.08rem",
            lineHeight: 1.75,
            transition: "background 0.2s",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)"
          }}>
            <button onClick={() => setPopup(null)} style={{ position: "absolute", top: 12, right: 18, background: theme.accent, color: '#fff', border: "none", borderRadius: 7, padding: "4px 15px", fontSize: 16, cursor: "pointer", zIndex: 2, fontWeight: 700, letterSpacing: 1, fontFamily: theme.font }}>ปิด</button>
            <h2 style={{ color: theme.accent, fontWeight: 700, marginBottom: 8, letterSpacing: 0.5, fontFamily: theme.font }}>🎮 Click Target Game</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16, fontSize: 14, fontFamily: theme.font }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px 12px', borderRadius: 8, textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <div style={{ fontSize: 12, color: theme.textSoft, marginBottom: 2 }}>คะแนน</div>
                <div style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: 16 }}>{gameScore}</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: 8, textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: 12, color: theme.textSoft, marginBottom: 2 }}>เลเวล</div>
                <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: 16 }}>{gameLevel}</div>
              </div>
              <div style={{ background: gameTime <= 10 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', padding: '8px 12px', borderRadius: 8, textAlign: 'center', border: `1px solid ${gameTime <= 10 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}` }}>
                <div style={{ fontSize: 12, color: theme.textSoft, marginBottom: 2 }}>เวลา</div>
                <div style={{ fontWeight: 'bold', color: gameTime <= 10 ? '#ef4444' : '#f59e0b', fontSize: 16 }}>{gameTime}s</div>
              </div>
            </div>
            
            <div 
              className="game-area"
              style={{
                width: '100%',
                height: 300,
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: 12,
                position: 'relative',
                overflow: 'hidden',
                border: '2px solid #475569',
                marginBottom: 16
              }}>
              {gameTargets.map((target, index) => (
                <div
                  key={index}
                  onClick={() => handleTargetClick(index)}
                  className="game-target"
                  style={{
                    position: 'absolute',
                    left: target.x + '%',
                    top: target.y + '%',
                    width: target.size,
                    height: target.size,
                    background: target.color,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    boxShadow: '0 0 15px rgba(255,255,255,0.4), inset 0 0 10px rgba(255,255,255,0.2)'
                  }}
                />
              ))}
              
              {!gameActive && gameScore === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#94a3b8',
                  fontSize: 18,
                  fontWeight: 600
                }}>
                  กดเริ่มเกมเพื่อเล่น!
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={startGame}
                disabled={gameActive}
                style={{
                  background: gameActive ? '#cbd5e1' : '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: gameActive ? 'not-allowed' : 'pointer',
                  fontFamily: theme.font
                }}
              >
                {gameActive ? 'กำลังเล่น...' : 'เริ่มเกม'}
              </button>
              
              <button
                onClick={resetGame}
                style={{
                  background: theme.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: theme.font
                }}
              >
                รีเซ็ต
              </button>
            </div>
            
            <div style={{ marginTop: 16, padding: 12, background: 'rgba(71, 85, 105, 0.1)', borderRadius: 8, border: '1px solid rgba(71, 85, 105, 0.2)' }}>
              <div style={{ fontSize: 13, color: theme.textSoft, fontFamily: theme.font, marginBottom: 8 }}>
                🎯 คลิกเป้าหมายให้ได้มากที่สุดภายในเวลาที่กำหนด!
              </div>
              <div style={{ fontSize: 12, color: theme.textSoft, fontFamily: theme.font }}>
                💡 เป้าหมายเล็ก = คะแนนมาก | เลเวลสูง = เป้าหมายเร็วขึ้น
              </div>
              {gameClicks > 0 && (
                <div style={{ fontSize: 12, color: theme.accent, fontFamily: theme.font, marginTop: 4 }}>
                  ความแม่นยำ: {Math.round((gameScore / (gameClicks * 10)) * 100)}%
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Only Popup */}
      {showMobileOnly && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.55)", zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            background: 'rgba(255,255,255,0.92)',
            border: '1.5px solid #475569',
            borderRadius: 22,
            padding: 44,
            minWidth: 320,
            maxWidth: 420,
            width: "95vw",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: theme.shadow,
            textAlign: "center",
            fontSize: "1.12rem",
            lineHeight: 1.8,
            transition: "background 0.2s",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            color: theme.accent,
            fontFamily: theme.font
          }}>
            <button onClick={() => setShowMobileOnly(false)} style={{ position: "absolute", top: 12, right: 18, background: theme.accent, color: '#fff', border: "none", borderRadius: 7, padding: "4px 15px", fontSize: 16, cursor: "pointer", zIndex: 2, fontWeight: 700, letterSpacing: 1, fontFamily: theme.font }}>ปิด</button>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10, color: theme.accent2, letterSpacing: 0.5 }}>ทรูมันนี่</div>
            <div style={{ fontSize: 17, color: theme.textSoft, marginBottom: 18, fontWeight: 600 }}>
              ฟีเจอร์นี้รองรับเฉพาะการใช้งานบนมือถือเท่านั้น<br/>กรุณาเปิดบนสมาร์ทโฟนเพื่อใช้งาน
            </div>
            <div style={{ fontSize: 15, color: theme.text, marginTop: 8, opacity: 0.7 }}>
              หากต้องการสนับสนุนผ่าน TrueMoney<br/>กรุณาเปิดเว็บไซต์นี้บนมือถือ<br/>หรือสแกน QR พร้อมเพย์แทนได้เลย
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wire 2D Model Component
function Wire2DModel({ wireData, isSelected, onClick, selectionNumber }) {
  return (
    <div
      className="wire-model"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: 12,
        cursor: 'pointer',
        border: isSelected ? '3px solid #3b82f6' : '2px solid rgba(255,255,255,0.2)',
        background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.9)',
        transition: 'all 0.3s ease',
        fontSize: 14,
        fontWeight: 600,
        fontFamily: theme.font,
        boxShadow: isSelected ? '0 4px 20px rgba(59, 130, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        position: 'relative'
      }}
    >
      {/* Wire Visual Representation */}
      <div style={{ 
        width: 60, 
        height: 24, 
        borderRadius: 12, 
        background: wireData.color,
        marginRight: 12,
        border: '2px solid rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Wire texture/pattern */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '4px',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '2px'
        }}></div>
        {/* Copper core representation */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '2px',
          background: '#cd7f32',
          borderRadius: '1px'
        }}></div>
      </div>
      
      {/* Wire Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: isSelected ? '#3b82f6' : '#334155' }}>
          {wireData.id}. {wireData.name}
        </div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
          Pin {wireData.id} - TIA/EIA-568B
        </div>
      </div>
      
      {/* Selection Number */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: -8,
          right: -8,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: '#3b82f6',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)'
        }}>
          {selectionNumber}
        </div>
      )}

    </div>
  );
}

// LAN Guide Component - Interactive Tutorial (Without Timer)
function LANGuideComponent({ onClose }) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [completedSteps, setCompletedSteps] = React.useState([]);
  const [selectedWires, setSelectedWires] = React.useState([]);
  const [showWireColors, setShowWireColors] = React.useState(false);

  const totalSteps = 7;
  const wireColors = [
    { id: 1, name: 'ขาว/ส้ม', color: 'linear-gradient(45deg, white 0%, white 49%, #f97316 51%, #f97316 100%)', correct: true },
    { id: 2, name: 'ส้ม', color: '#f97316', correct: true },
    { id: 3, name: 'ขาว/เขียว', color: 'linear-gradient(45deg, white 0%, white 49%, #16a34a 51%, #16a34a 100%)', correct: true },
    { id: 4, name: 'น้ำเงิน', color: '#2563eb', correct: true },
    { id: 5, name: 'ขาว/น้ำเงิน', color: 'linear-gradient(45deg, white 0%, white 49%, #2563eb 51%, #2563eb 100%)', correct: true },
    { id: 6, name: 'เขียว', color: '#16a34a', correct: true },
    { id: 7, name: 'ขาว/น้ำตาล', color: 'linear-gradient(45deg, white 0%, white 49%, #92400e 51%, #92400e 100%)', correct: true },
    { id: 8, name: 'น้ำตาล', color: '#92400e', correct: true }
  ];

  const steps = [
    {
      title: '🔧 เตรียมอุปกรณ์',
      content: 'เตรียมอุปกรณ์ที่จำเป็นสำหรับการเข้าหัว LAN สาย CAT6',
      items: ['สาย CAT6', 'หัว RJ45', 'คีมเข้าหัว', 'คีมปอกสาย', 'เครื่องทดสอบสาย']
    },
    {
      title: '✂️ ปอกสาย',
      content: 'ปอกฉนวนด้านนอกของสาย CAT6 ประมาณ 1.5 นิ้ว',
      items: ['วัดระยะ 1.5 นิ้ว', 'ปอกฉนวนระวังไม่ให้บาดสายใน', 'ดึงฉนวนออก', 'เห็นสายคู่บิด 4 คู่']
    },
    {
      title: '🎨 จัดเรียงสาย',
      content: 'จัดเรียงสายตามมาตรฐาน TIA/EIA-568B',
      interactive: true
    },
    {
      title: '✂️ ตัดปลายสาย',
      content: 'ตัดปลายสายให้เรียบเสมอกันประมาณ 0.5 นิ้ว',
      items: ['จัดสายให้ตรง', 'ตัดให้เรียบเสมอ', 'ความยาว 0.5 นิ้ว', 'ตรวจสอบความเรียบ']
    },
    {
      title: '🔌 สอดเข้าหัว RJ45',
      content: 'สอดสายที่จัดเรียงแล้วเข้าไปในหัว RJ45',
      items: ['จับหัว RJ45 ให้ถูกต้อง', 'สอดสายเข้าไป', 'ดันจนสุด', 'ตรวจสอบลำดับสี']
    },
    {
      title: '🔨 ย้ำหัว',
      content: 'ใช้คีมย้ำหัว RJ45 ให้แน่น',
      items: ['ใส่หัวในคีม', 'บีบให้สุดแรง', 'ค้างไว้สักครู่', 'ตรวจสอบความแน่น']
    },
    {
      title: '🧪 ทดสอบ',
      content: 'ทดสอบการเชื่อมต่อของสาย LAN',
      items: ['ใช้เครื่องทดสอบ', 'ตรวจสอบทุกเส้น', 'ไม่มีลัดวงจร', 'ทดสอบกับอุปกรณ์']
    }
  ];



  const handleWireClick = (wireId) => {
    if (currentStep !== 3) return;
    
    const newSelected = [...selectedWires];
    const index = newSelected.indexOf(wireId);
    
    if (index > -1) {
      newSelected.splice(index, 1);
    } else if (newSelected.length < 8) {
      newSelected.push(wireId);
    }
    
    setSelectedWires(newSelected);
    
    // Real-time validation - check each position
    validateWireOrder(newSelected);
  };

  const validateWireOrder = (selectedOrder) => {
    const correctOrder = [1, 2, 3, 4, 5, 6, 7, 8]; // TIA/EIA-568B standard
    
    // Check if complete and correct
    if (selectedOrder.length === 8) {
      const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(correctOrder);
      
      if (isCorrect) {
        // Play success sound (if available)
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
          audio.play().catch(() => {}); // Ignore errors if audio fails
        } catch (e) {}
        
        // Show success message with animation
        showValidationMessage('🎉 ถูกต้อง! การจัดเรียงสายตามมาตรฐาน TIA/EIA-568B', 'success');
        setCompletedSteps([...completedSteps, 3]);
        
        // Add celebration effect
        createCelebrationEffect();
        
        setTimeout(() => {
          setCurrentStep(4);
          setSelectedWires([]);
        }, 2500);
      } else {
        // Show error message with correct order
        showValidationMessage('❌ ลำดับไม่ถูกต้อง! กรุณาจัดเรียงใหม่ตามมาตรฐาน TIA/EIA-568B', 'error');
      }
    } else if (selectedOrder.length > 0) {
      // Check partial order
      let isPartiallyCorrect = true;
      for (let i = 0; i < selectedOrder.length; i++) {
        if (selectedOrder[i] !== correctOrder[i]) {
          isPartiallyCorrect = false;
          break;
        }
      }
      
      if (isPartiallyCorrect) {
        showValidationMessage(`✅ ถูกต้องไปแล้ว ${selectedOrder.length}/8 สาย`, 'info');
      } else {
        showValidationMessage(`⚠️ ตำแหน่งที่ ${selectedOrder.length} ไม่ถูกต้อง`, 'warning');
      }
    }
  };

  const createCelebrationEffect = () => {
    // Create confetti effect
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 10002;
    `;
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: 50%;
        animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
      `;
      confettiContainer.appendChild(confetti);
    }
    
    // Add confetti animation
    if (!document.querySelector('#confettiAnimation')) {
      const style = document.createElement('style');
      style.id = 'confettiAnimation';
      style.textContent = `
        @keyframes confettiFall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(confettiContainer);
    
    // Remove confetti after animation
    setTimeout(() => {
      if (confettiContainer.parentNode) {
        confettiContainer.remove();
      }
    }, 5000);
  };

  const showValidationMessage = (message, type) => {
    // Create validation message element
    const existingMessage = document.querySelector('.validation-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageElement = document.createElement('div');
    messageElement.className = 'validation-message';
    messageElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      font-size: 14px;
      z-index: 10001;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.3s ease;
      max-width: 300px;
      font-family: ${theme.font};
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;

    // Set background color based on type
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    messageElement.style.background = colors[type] || colors.info;
    messageElement.textContent = message;

    document.body.appendChild(messageElement);

    // Show animation
    setTimeout(() => {
      messageElement.style.opacity = '1';
      messageElement.style.transform = 'translateX(0)';
    }, 100);

    // Hide after 3 seconds
    setTimeout(() => {
      messageElement.style.opacity = '0';
      messageElement.style.transform = 'translateX(100px)';
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.remove();
        }
      }, 300);
    }, 3000);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };



  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.55)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        border: '1.5px solid #475569',
        borderRadius: 22,
        padding: 32,
        minWidth: 400,
        maxWidth: 600,
        width: "95vw",
        maxHeight: "90vh",
        overflowY: "auto",
        position: "relative",
        boxShadow: theme.shadow,
        fontSize: "1.08rem",
        lineHeight: 1.75,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)"
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: theme.accent, fontWeight: 700, fontSize: 24, letterSpacing: 0.5, fontFamily: theme.font, margin: 0 }}>
            🔌 คู่มือการเข้าหัว LAN สาย CAT6
          </h2>
          <button onClick={onClose} style={{ background: theme.accent, color: '#fff', border: "none", borderRadius: 7, padding: "8px 20px", fontSize: 14, cursor: "pointer", fontWeight: 700, fontFamily: theme.font }}>
            ปิด
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.accent }}>ขั้นตอนที่ {currentStep} จาก {totalSteps}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#3b82f6' }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ width: '100%', height: 8, background: 'rgba(148, 163, 184, 0.2)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #2563eb)', borderRadius: 4, transition: 'width 0.5s ease' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {steps.map((_, index) => (
              <div key={index} style={{
                width: 12, height: 12, borderRadius: '50%',
                background: completedSteps.includes(index + 1) ? '#10b981' : (index + 1 === currentStep ? '#3b82f6' : 'rgba(148, 163, 184, 0.3)'),
                transition: 'all 0.3s ease',
                boxShadow: index + 1 === currentStep ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none'
              }}></div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: theme.accent, fontWeight: 700, fontSize: 20, marginBottom: 12, fontFamily: theme.font }}>
            {steps[currentStep - 1].title}
          </h3>
          <p style={{ color: theme.text, marginBottom: 16, fontFamily: theme.font }}>
            {steps[currentStep - 1].content}
          </p>

          {/* Interactive Wire Arrangement for Step 3 with 2D Models */}
          {currentStep === 3 && (
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: 20, borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h4 style={{ color: '#3b82f6', fontWeight: 600, marginBottom: 16, fontFamily: theme.font }}>
                🎯 คลิกสายตามลำดับที่ถูกต้อง (TIA/EIA-568B):
              </h4>
              
              {/* Wire Selection Area */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
                {wireColors.map((wire) => (
                  <Wire2DModel
                    key={wire.id}
                    wireData={wire}
                    isSelected={selectedWires.includes(wire.id)}
                    onClick={() => handleWireClick(wire.id)}
                    selectionNumber={selectedWires.indexOf(wire.id) + 1}
                  />
                ))}
              </div>
              
              {/* RJ45 Connector Preview with Validation */}
              <div style={{ background: 'rgba(255,255,255,0.9)', padding: 16, borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)' }}>
                <h5 style={{ color: '#334155', fontWeight: 600, marginBottom: 12, fontSize: 14, fontFamily: theme.font }}>
                  🔌 ตัวอย่างหัว RJ45 (มองจากด้านหน้า):
                </h5>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <div style={{
                    width: 200,
                    height: 80,
                    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                    borderRadius: 8,
                    border: '2px solid #94a3b8',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* RJ45 Pins with Validation */}
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 8 }, (_, index) => {
                        const correctWireId = index + 1;
                        const selectedWireId = selectedWires[index];
                        const wire = wireColors.find(w => w.id === selectedWireId);
                        const isCorrect = selectedWireId === correctWireId;
                        const isEmpty = !selectedWireId;
                        
                        return (
                          <div key={index} style={{
                            width: 16,
                            height: 40,
                            background: isEmpty ? '#f1f5f9' : wire.color,
                            border: isEmpty ? '2px dashed #cbd5e1' : 
                                   isCorrect ? '2px solid #10b981' : 
                                   '2px solid #ef4444',
                            borderRadius: '2px',
                            position: 'relative',
                            transition: 'all 0.3s ease'
                          }}>
                            {/* Position Number */}
                            <div style={{
                              position: 'absolute',
                              bottom: -20,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              fontSize: 10,
                              fontWeight: 600,
                              color: '#475569'
                            }}>
                              {index + 1}
                            </div>
                            
                            {/* Validation Icon */}
                            {!isEmpty && (
                              <div style={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                background: isCorrect ? '#10b981' : '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 10,
                                color: 'white',
                                fontWeight: 700
                              }}>
                                {isCorrect ? '✓' : '✗'}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* RJ45 Tab */}
                    <div style={{
                      position: 'absolute',
                      bottom: -8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 40,
                      height: 8,
                      background: '#94a3b8',
                      borderRadius: '0 0 4px 4px'
                    }}></div>
                  </div>
                </div>
                
                {/* Validation Status */}
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  {(() => {
                    const correctOrder = [1, 2, 3, 4, 5, 6, 7, 8];
                    const correctCount = selectedWires.filter((wireId, index) => wireId === correctOrder[index]).length;
                    const totalSelected = selectedWires.length;
                    
                    if (totalSelected === 0) {
                      return (
                        <div style={{ color: '#64748b', fontSize: 12, fontFamily: theme.font }}>
                          🎯 เริ่มเลือกสายตามลำดับที่ถูกต้อง
                        </div>
                      );
                    } else if (correctCount === 8) {
                      return (
                        <div style={{ color: '#10b981', fontSize: 14, fontWeight: 600, fontFamily: theme.font }}>
                          🎉 ถูกต้องทั้งหมด! พร้อมไปขั้นตอนถัดไป
                        </div>
                      );
                    } else {
                      return (
                        <div style={{ color: '#f59e0b', fontSize: 12, fontFamily: theme.font }}>
                          ⚠️ ถูกต้อง {correctCount}/{totalSelected} ตำแหน่ง
                        </div>
                      );
                    }
                  })()}
                </div>
                
                {/* Progress Indicator */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#64748b', fontFamily: theme.font }}>
                    ความคืบหน้า: {selectedWires.length}/8 สาย
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: 6, 
                    background: 'rgba(148, 163, 184, 0.2)', 
                    borderRadius: 3, 
                    marginTop: 8,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(selectedWires.length / 8) * 100}%`,
                      height: '100%',
                      background: selectedWires.length === 8 ? '#10b981' : '#3b82f6',
                      borderRadius: 3,
                      transition: 'all 0.3s ease'
                    }}></div>
                  </div>
                </div>
              </div>
              
              {/* Wire Arrangement Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <div style={{ fontSize: 12, color: theme.textSoft, fontFamily: theme.font }}>
                  💡 เลือกสายตามลำดับ 1-8 ตามมาตรฐาน TIA/EIA-568B
                </div>
                <button
                  onClick={() => {
                    setSelectedWires([]);
                    showValidationMessage('🔄 รีเซ็ตการเลือกสายแล้ว', 'info');
                  }}
                  style={{
                    background: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: theme.font
                  }}
                >
                  🔄 รีเซ็ต
                </button>
              </div>
              
              {/* Reference Guide */}
              <div style={{ marginTop: 16, padding: 12, background: 'rgba(59, 130, 246, 0.05)', borderRadius: 8, border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <h6 style={{ color: '#3b82f6', fontWeight: 600, fontSize: 12, marginBottom: 8, fontFamily: theme.font }}>
                  📋 ลำดับที่ถูกต้อง (TIA/EIA-568B):
                </h6>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, fontSize: 11, fontFamily: theme.font }}>
                  {wireColors.map((wire, index) => (
                    <div key={wire.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: selectedWires[index] === wire.id ? '#10b981' : '#64748b',
                      fontWeight: selectedWires[index] === wire.id ? 700 : 400
                    }}>
                      <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        background: wire.color,
                        marginRight: 4,
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}></div>
                      {wire.id}. {wire.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Regular Step Items */}
          {steps[currentStep - 1].items && !steps[currentStep - 1].interactive && (
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: 16, borderRadius: 12, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <ul style={{ margin: 0, paddingLeft: 20, color: theme.text, fontFamily: theme.font }}>
                {steps[currentStep - 1].items.map((item, index) => (
                  <li key={index} style={{ marginBottom: 8, lineHeight: 1.6 }}>
                    <strong>✓</strong> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              style={{
                background: currentStep === 1 ? '#cbd5e1' : theme.accent,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: 'bold',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                fontFamily: theme.font,
                opacity: currentStep === 1 ? 0.5 : 1
              }}
            >
              ← ย้อนกลับ
            </button>
            
            <button
              onClick={nextStep}
              disabled={currentStep === 3 && selectedWires.length !== 8}
              style={{
                background: (currentStep === 3 && selectedWires.length !== 8) ? '#cbd5e1' : (currentStep === totalSteps ? '#10b981' : '#3b82f6'),
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: 'bold',
                cursor: (currentStep === 3 && selectedWires.length !== 8) ? 'not-allowed' : 'pointer',
                fontFamily: theme.font,
                opacity: (currentStep === 3 && selectedWires.length !== 8) ? 0.5 : 1
              }}
            >
              {currentStep === totalSteps ? '🎉 เสร็จสิ้น' : 'ถัดไป →'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                setCurrentStep(1);
                setCompletedSteps([]);
                setSelectedWires([]);
              }}
              style={{
                background: '#f59e0b',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: theme.font
              }}
            >
              🔄 เริ่มใหม่
            </button>
          </div>
        </div>

        {/* Completion Message */}
        {currentStep === totalSteps && (
          <div style={{ 
            marginTop: 20, 
            padding: 20, 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', 
            borderRadius: 12, 
            border: '1px solid rgba(16, 185, 129, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
            <h4 style={{ color: '#10b981', fontWeight: 700, marginBottom: 12, fontSize: 18, fontFamily: theme.font }}>
              ยินดีด้วย! คุณได้เรียนรู้การเข้าหัว LAN สาย CAT6 เรียบร้อยแล้ว
            </h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6' }}>{completedSteps.length}</div>
                <div style={{ fontSize: 12, color: theme.textSoft }}>ขั้นตอนที่เสร็จ</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>{totalSteps}</div>
                <div style={{ fontSize: 12, color: theme.textSoft }}>ขั้นตอนทั้งหมด</div>
              </div>
            </div>
            <p style={{ color: theme.textSoft, fontSize: 14, fontFamily: theme.font }}>
              🎯 ตอนนี้คุณพร้อมที่จะเข้าหัว LAN สาย CAT6 ด้วยตัวเองแล้ว!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// AnimatedSwitchingText: alternates between 'เจ้าทิพตัวอ้วน' (soft gray) and 'แมวอ้วน' (blue-gray), with delay and smooth transition
function AnimatedSwitchingText() {
  const texts = [
    { text: "เจ้าทิพตัวอ้วน", color: "#334155" },
    { text: "แมวอ้วน", color: "#334155" }
  ];
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const showTimer = setTimeout(() => setVisible(true), 80); // short delay for fade-in
    const switchTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setIdx(i => (i + 1) % texts.length), 400); // fade-out before switch
    }, 3000 + 700); // show 3s + anim
    return () => { clearTimeout(showTimer); clearTimeout(switchTimer); };
  }, [idx]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 8, marginTop: 2, height: 32, minHeight: 32, position: 'relative' }}>
      <span
        style={{
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 1,
          color: texts[idx].color,
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.7)',
          transition: 'opacity 0.45s cubic-bezier(.4,0,.2,1), transform 0.45s cubic-bezier(.4,0,.2,1)',
          textShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'inline-block',
        }}
      >
        {texts[idx].text}
      </span>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
