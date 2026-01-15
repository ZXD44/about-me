import React, { useState, useRef, useEffect } from 'react';
import './AIChatPopup.css';

function AIChatPopup({ isOpen, onClose, isMobile }) {
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState([
    { role: "assistant", content: "👁️ ความฉลาดเป็นโมฆะ\nมีสิ่งใดที่คุณค้นหาในความว่างเปล่านี้? 🌑" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const aiChatEndRef = useRef(null);

  // API Configuration - Powered by Google Gemini
  const API_KEY = "AIzaSyAdGW9_n0p5FP1VbhZ_TMlhHxRWs34b8yc";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-05:generateContent?key=${API_KEY}`;

  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat, aiLoading]);

  const handleAiSend = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = { role: "user", content: aiInput };
    setAiChat(prev => [...prev, userMsg]);
    setAiInput("");
    setAiLoading(true);

    try {
      // Prepare history for Gemini
      // Map 'assistant' -> 'model', 'user' -> 'user'
      const contents = aiChat.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Add the new user message
      contents.push({
        role: "user",
        parts: [{ text: userMsg.content }]
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: {
            parts: [{ text: "คุณคือ 'Void Intelligence' AI Assistant ที่มีความสุขุม ลึกลับ แต่ช่วยเหลือผู้ใช้ได้ดีเยี่ยม ตอบเป็นภาษาไทยเป็นหลัก ใช้ถ้อยคำที่ดูเท่ ทันสมัย และใช้อีโมจิโทนมืด/ลึกลับ เช่น 🌑, 🖤, 👁️, ✨ ให้เหมาะสมกับธีม 'Acheron Void'" }]
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "ระบบไม่สามารถตอบกลับได้ในขณะนี้ 🌑";
        setAiChat(prev => [...prev, { role: "assistant", content: aiResponse }]);
      } else {
        console.error('Gemini API Error:', JSON.stringify(data, null, 2));
        throw new Error(data.error?.message || 'API request failed');
      }

    } catch (err) {
      console.error('AI API Error:', err);
      setAiChat(prev => [...prev, {
        role: "assistant",
        content: "ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อจักรวาล (API Error) 😔"
      }]);
    }
    setAiLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-popup-overlay" onClick={onClose}>
      <div className={`ai-popup-content ${isMobile ? 'mobile' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="ai-popup-close"
        >
          ✕
        </button>

        <div className="ai-popup-header">
          <h2 className="ai-popup-title">
            ความฉลาดเป็นโมฆะ
          </h2>
        </div>

        <div className="ai-chat-container">
          {aiChat.map((msg, idx) => (
            <div
              key={idx}
              className={`ai-message ${msg.role}`}
            >
              {msg.content}
            </div>
          ))}

          {aiLoading && (
            <div className="ai-typing-indicator">
              <span>AI กำลังพิมพ์</span>
              <div className="dot" style={{ animationDelay: '0s' }}></div>
              <div className="dot" style={{ animationDelay: '0.16s' }}></div>
              <div className="dot" style={{ animationDelay: '0.32s' }}></div>
            </div>
          )}

          <div ref={aiChatEndRef} />
        </div>

        <form onSubmit={handleAiSend} className="ai-chat-form">
          <textarea
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            placeholder="พิมพ์ข้อความของคุณที่นี่..."
            disabled={aiLoading}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAiSend(e);
              }
            }}
            className="ai-chat-input"
            rows={1}
          />
          <button
            type="submit"
            disabled={aiLoading || !aiInput.trim()}
            className="ai-chat-send"
          >
            {aiLoading ? (
              <div className="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIChatPopup;