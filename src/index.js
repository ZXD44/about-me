import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";

// Social icons as images
const socialIcons = {
  github: <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="GitHub" style={{ width: 22, height: 22, filter: 'invert(1)' }} />, 
  telegram: <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telegram.svg" alt="Telegram" style={{ width: 22, height: 22, filter: 'invert(1)' }} />, 
  youtube: <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" alt="YouTube" style={{ width: 22, height: 22, filter: 'invert(1)' }} />, 
  tiktok: <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg" alt="TikTok" style={{ width: 22, height: 22, filter: 'invert(1)' }} />, 
  qr: <img src="https://cdn-icons-png.flaticon.com/512/2541/2541988.png" alt="QR Code" style={{ width: 22, height: 22, objectFit: 'contain', padding: 1, filter: 'invert(1)' }} />,
  ai: <img src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png" alt="AI" style={{ width: 22, height: 22, objectFit: 'contain', padding: 1, filter: 'invert(1)' }} />
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
  avatar: "https://cdn.discordapp.com/attachments/1304444980026146867/1389216314513690704/photo_2025-06-30_19-03-03.jpg?ex=6863d003&is=68627e83&hm=129dcbac8af64a8c3d1245e775cd3427e53bf4272e68fc6a7cd1d8915a45d4a3&",
  socials: [
    { key: "github", label: "GitHub", url: "https://github.com/" },
    { key: "telegram", label: "Telegram", url: "https://t.me/" },
    { key: "youtube", label: "YouTube", url: "https://youtube.com/" },
    { key: "tiktok", label: "TikTok", url: "https://tiktok.com/" },
    { key: "qr", label: "QR Code", url: "#", isButton: true },
    { key: "ai", label: "AI Chat", url: "#", isButton: true },
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

function App() {
  // Popup state
  const [popup, setPopup] = useState(null); // 'qr' | 'chat' | null
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
  // Layout
  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: theme.bg, fontFamily: theme.font, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Prevent horizontal and vertical scroll on body */}
      <style>{`body { overflow-x: hidden !important; overflow-y: hidden !important; }`}</style>
      {/* BG Cat Cover */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}>
        <div className="bg-banner" style={{ width: "100vw", height: "100vh", backgroundImage: "url('https://meo.pp.ua/ds.gif')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", filter: "brightness(0.98)" }} />
      </div>
      <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: 'rgba(255,255,255,0.18)',
          border: '1.5px solid #47556922',
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
          padding: isMobile ? 18 : 36,
          maxWidth: 420,
          width: "100%",
          margin: 18,
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
          <div style={{ position: "relative", marginBottom: 10 }}>
            <img src={profile.avatar} alt="avatar" style={{ width: isMobile ? 90 : 120, height: isMobile ? 90 : 120, borderRadius: "50%", objectFit: "cover", border: `2.5px solid ${theme.accent}` }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: isMobile ? 22 : 28, color: theme.text, marginBottom: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginTop: 0, marginBottom: 4 }}>
            <span>{profile.name}{metaVerifyIcon}</span>
          </div>
          <div style={{ color: '#1e293b', fontSize: isMobile ? 15 : 18, marginBottom: 18, marginTop: 2, fontWeight: 600, letterSpacing: 0.2, marginLeft: -8 }}>{profile.username}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 24 }}>
            {profile.socials.map(s => (
              s.isButton ? (
                <button key={s.key} onClick={() => setPopup(s.key === 'ai' ? 'chat' : s.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#181a20",
                    borderRadius: 8,
                    padding: "7px 14px",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 15,
                    textDecoration: "none",
                    boxShadow: theme.shadow,
                    border: "none",
                    transition: "box-shadow 0.18s, transform 0.18s, background 0.18s",
                    outline: "none",
                    cursor: "pointer"
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
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#181a20", borderRadius: 8, padding: "7px 14px", color: "#fff", fontWeight: 600, fontSize: 15, textDecoration: "none", boxShadow: theme.shadow, border: "none", transition: "box-shadow 0.18s, transform 0.18s, background 0.18s", outline: "none" }}
                  onMouseOver={e => { e.currentTarget.style.background = '#23272f'; e.currentTarget.style.boxShadow = '0 0 0 4px #23272f44, 0 4px 24px #23272f55, 0 1.5px 8px #23272f22'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#181a20'; e.currentTarget.style.boxShadow = theme.shadow; e.currentTarget.style.transform = 'none'; }}
                >
                  <span>{socialIcons[s.key]}</span> {s.label}
                </a>
              )
            ))}
          </div>
          <div style={{ color: '#334155', fontSize: 13, marginTop: 18, textAlign: "center", fontWeight: 600, letterSpacing: 0.2 }}>Thank You<br/>© 2025 is Hdxw,Meo</div>
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
            <h2 style={{ color: theme.accent, fontWeight: 700, marginBottom: 8, letterSpacing: 0.5, fontFamily: theme.font }}>สร้าง QR PromptPay</h2>
            <div style={{ color: theme.accent2, fontWeight: "bold", fontSize: 18, marginBottom: 16, fontFamily: theme.font }}>สหภูมิ ทับทวี</div>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="จำนวนเงิน (บาท)"
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
              {qrLoading ? "กำลังสร้าง..." : "สร้าง QR"}
            </button>
            {qrError && (
              <div style={{ color: theme.accent, marginBottom: 12, fontFamily: theme.font }}>{qrError}</div>
            )}
            {qrImage && (
              <div style={{ marginTop: 20 }}>
                <img
                  src={qrImage}
                  alt="QR PromptPay"
                  style={{ width: 180, height: 180, borderRadius: 12, border: `2px solid ${theme.accent2}`, background: theme.card, boxShadow: theme.shadow }}
                />
                <div style={{ marginTop: 8, color: theme.accent, fontWeight: "bold", fontFamily: theme.font }}>
                  สหภูมิ ทับทวี
                </div>
                <div style={{ color: theme.textSoft, fontSize: 14, fontFamily: theme.font }}>เบอร์ 096-823-7098</div>
                <div style={{ color: theme.textSoft, fontSize: 14, fontFamily: theme.font }}>จำนวน {qrAmount} บาท</div>
              </div>
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
