import React, { useState, useRef, useEffect } from 'react';
import './AIChatPopup.css';

function AIChatPopup({ isOpen, onClose, isMobile }) {
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState([
    { role: "assistant", content: "👁️ ความฉลาดเป็นโมฆะ\nมีสิ่งใดที่คุณค้นหาในความว่างเปล่านี้? 🌑" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const aiChatEndRef = useRef(null);

  // API Configuration - Powered by OpenRouter.ai
  const API_KEY = "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";
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";

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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'https://github.com/ZXD44',
          'X-Title': 'Void Intelligence',
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [
            {
              role: "system",
              content: "คุณคือ 'Void Intelligence' AI Assistant ที่มีความสุขุม ลึกลับ แต่ช่วยเหลือผู้ใช้ได้ดีเยี่ยม ตอบเป็นภาษาไทยเป็นหลัก ใช้ถ้อยคำที่ดูเท่ ทันสมัย และใช้อีโมจิโทนมืด/ลึกลับ เช่น 🌑, 🖤, 👁️, ✨ ให้เหมาะสมกับธีม 'Acheron Void'"
            },
            ...aiChat.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: "user", content: aiInput }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiResponse = data.choices?.[0]?.message?.content || "ระบบไม่สามารถตอบกลับได้ในขณะนี้ 🌑";
        setAiChat(prev => [...prev, { role: "assistant", content: aiResponse }]);
      } else {
        console.error('OpenRouter API Error:', JSON.stringify(data, null, 2));
        throw new Error(data.error?.message || 'API request failed');
      }

    } catch (err) {
      console.error('AI API Error:', err);
      setAiChat(prev => [...prev, {
        role: "assistant",
        content: "ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อ API 😔"
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