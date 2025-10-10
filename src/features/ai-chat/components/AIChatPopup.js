import React, { useState, useRef, useEffect } from 'react';
import { API_CONFIG } from '../../../shared/config/api';

function AIChatPopup({ isOpen, onClose, isMobile }) {
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState([
    { role: "assistant", content: "สวัสดีครับ! ผมเป็น AI Assistant ที่พร้อมช่วยเหลือคุณในทุกเรื่องครับ 😊\n\nผมสามารถตอบคำถามได้หลายภาษา แต่จะตอบเป็นภาษาไทยเป็นหลัก และใช้ emoji เพื่อให้การสนทนาดูเป็นมิตรและน่าสนใจครับ\n\nมีอะไรให้ผมช่วยไหมครับ?" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const aiChatEndRef = useRef(null);

  // API Configuration
  const API_KEY = "AIzaSyAawpAEke80DcXP0x2OEIQScp1TMQ2P2wM";
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
  const MODEL = "gemini-2.0-flash-exp";

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
      // Convert chat history to Gemini format
      const geminiMessages = [
        {
          role: "user",
          parts: [{ 
            text: "คุณเป็น AI Assistant ที่เป็นมิตรและช่วยเหลือผู้ใช้ คุณสามารถตอบคำถามได้หลายภาษา แต่ควรตอบเป็นภาษาไทยเป็นหลัก และใช้ emoji เพื่อให้การสนทนาดูเป็นมิตรและน่าสนใจ" 
          }]
        },
        {
          role: "model",
          parts: [{ 
            text: "เข้าใจแล้วครับ! ผมจะเป็น AI Assistant ที่เป็นมิตรและช่วยเหลือผู้ใช้ ตอบเป็นภาษาไทยเป็นหลัก และใช้ emoji เพื่อให้การสนทนาดูเป็นมิตรและน่าสนใจครับ 😊" 
          }]
        },
        ...aiChat.map(msg => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        })),
        {
          role: "user",
          parts: [{ text: aiInput }]
        }
      ];
      
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topP: 0.8,
            topK: 40
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัย ไม่สามารถสร้างคำตอบได้";
        setAiChat(prev => [...prev, { role: "assistant", content: aiResponse }]);
      } else {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error('API request failed');
      }
      
    } catch (err) {
      console.error('AI API Error:', err);
      setAiChat(prev => [...prev, { 
        role: "assistant", 
        content: "ขออภัยครับ เกิดข้อผิดพลาดในการเชื่อมต่อ AI กรุณาลองใหม่อีกครั้งครับ 😔" 
      }]);
    }
    setAiLoading(false);
  };

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.3s ease-out'
  };

  const popupStyle = {
    background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
    borderRadius: '24px',
    padding: isMobile ? '20px' : '28px',
    maxWidth: isMobile ? '95vw' : '600px',
    width: '100%',
    height: isMobile ? '80vh' : '70vh',
    position: 'relative',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    animation: 'slideUp 0.4s ease-out',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 10
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    padding: '16px',
    background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 200, 120, 0.05))',
    borderRadius: '16px',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    position: 'relative'
  };

  const titleStyle = {
    color: '#334155',
    fontWeight: 700,
    margin: 0,
    fontSize: isMobile ? '20px' : '24px',
    letterSpacing: '0.5px',
    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const chatContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    background: 'rgba(0, 0, 0, 0.02)',
    borderRadius: '16px',
    marginBottom: '20px',
    border: '1px solid rgba(0, 255, 136, 0.1)',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(0, 255, 136, 0.3) transparent'
  };

  const messageStyle = (role) => ({
    marginBottom: '16px',
    padding: '16px 20px',
    borderRadius: '18px',
    maxWidth: '85%',
    wordWrap: 'break-word',
    animation: 'fadeInUp 0.3s ease-out',
    position: 'relative',
    ...(role === 'user' ? {
      background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
      color: 'white',
      marginLeft: 'auto',
      textAlign: 'right',
      boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)'
    } : {
      background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
      color: '#374151',
      marginRight: 'auto',
      border: '1px solid rgba(0, 255, 136, 0.1)'
    })
  });

  const loadingStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
    borderRadius: '18px',
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: '16px',
    animation: 'pulse 1.5s ease-in-out infinite'
  };

  const formStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end'
  };

  const inputStyle = {
    flex: 1,
    padding: '16px 20px',
    border: '2px solid rgba(0, 255, 136, 0.3)',
    borderRadius: '16px',
    fontSize: '16px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
    fontFamily: 'inherit'
  };

  const sendButtonStyle = {
    padding: '16px 24px',
    background: aiLoading || !aiInput.trim() 
      ? 'linear-gradient(135deg, #6b7280, #4b5563)'
      : 'linear-gradient(135deg, #00ff88, #00cc6a)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: aiLoading || !aiInput.trim() ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: aiLoading || !aiInput.trim()
      ? '0 4px 15px rgba(107, 114, 128, 0.3)'
      : '0 8px 25px rgba(0, 255, 136, 0.4)',
    minWidth: '80px'
  };

  const typingIndicatorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 20px',
    background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
    borderRadius: '18px',
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: '16px',
    animation: 'fadeInUp 0.3s ease-out'
  };

  const dotStyle = {
    width: '8px',
    height: '8px',
    background: '#00ff88',
    borderRadius: '50%',
    animation: 'bounce 1.4s ease-in-out infinite both'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose} 
          style={closeButtonStyle}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1) rotate(90deg)';
            e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1) rotate(0deg)';
            e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
          }}
        >
          ✕
        </button>
        
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            🤖 AI Chat Assistant
          </h2>
        </div>
        
        <div style={chatContainerStyle}>
          {aiChat.map((msg, idx) => (
            <div 
              key={idx} 
              style={messageStyle(msg.role)}
            >
              {msg.content}
            </div>
          ))}
          
          {aiLoading && (
            <div style={typingIndicatorStyle}>
              <span>AI กำลังพิมพ์</span>
              <div style={{ ...dotStyle, animationDelay: '0s' }}></div>
              <div style={{ ...dotStyle, animationDelay: '0.16s' }}></div>
              <div style={{ ...dotStyle, animationDelay: '0.32s' }}></div>
            </div>
          )}
          
          <div ref={aiChatEndRef} />
        </div>
        
        <form onSubmit={handleAiSend} style={formStyle}>
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
            style={inputStyle}
            rows={1}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(0, 255, 136, 0.6)';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 255, 136, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0, 255, 136, 0.3)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            disabled={aiLoading || !aiInput.trim()}
            style={sendButtonStyle}
            onMouseOver={(e) => {
              if (!aiLoading && aiInput.trim()) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 30px rgba(0, 255, 136, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!aiLoading && aiInput.trim()) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 255, 136, 0.4)';
              }
            }}
          >
            {aiLoading ? '⏳' : '📤'}
          </button>
        </form>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes slideUp {
              from { 
                opacity: 0; 
                transform: translateY(30px) scale(0.95);
              }
              to { 
                opacity: 1; 
                transform: translateY(0) scale(1);
              }
            }
            
            @keyframes fadeInUp {
              from { 
                opacity: 0; 
                transform: translateY(20px);
              }
              to { 
                opacity: 1; 
                transform: translateY(0);
              }
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            
            @keyframes bounce {
              0%, 80%, 100% { 
                transform: scale(0);
              } 
              40% { 
                transform: scale(1.0);
              }
            }
            
            ::-webkit-scrollbar {
              width: 6px;
            }
            
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            
            ::-webkit-scrollbar-thumb {
              background: rgba(0, 255, 136, 0.3);
              border-radius: 3px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 255, 136, 0.5);
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default AIChatPopup;