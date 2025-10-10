import React, { useState } from 'react';
import AnimatedText from '../../../shared/components/AnimatedText';

function QRPopup({ isOpen, onClose, isMobile }) {
  const [qrAmount, setQrAmount] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");

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

  if (!isOpen) return null;

  const animatedTexts = [
    { text: "การให้คือความสุข", color: "#334155" },
    { text: "ขอบคุณสำหรับกำลังใจ", color: "#334155" }
  ];

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
    padding: isMobile ? '24px' : '32px',
    maxWidth: isMobile ? '90vw' : '500px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    animation: 'slideUp 0.4s ease-out',
    overflow: 'hidden'
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
    marginBottom: '24px',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 200, 120, 0.05))',
    borderRadius: '16px',
    border: '1px solid rgba(0, 255, 136, 0.2)'
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid rgba(0, 255, 136, 0.3)',
    borderRadius: '16px',
    fontSize: '16px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '20px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '18px 24px',
    background: qrLoading 
      ? 'linear-gradient(135deg, #6b7280, #4b5563)'
      : 'linear-gradient(135deg, #00ff88, #00cc6a)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: qrLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: qrLoading 
      ? '0 4px 15px rgba(107, 114, 128, 0.3)'
      : '0 8px 25px rgba(0, 255, 136, 0.4)',
    position: 'relative',
    overflow: 'hidden'
  };

  const errorStyle = {
    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
    color: '#dc2626',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #fecaca',
    marginTop: '16px',
    textAlign: 'center',
    fontWeight: '500',
    boxShadow: '0 4px 15px rgba(220, 38, 38, 0.1)'
  };

  const qrContainerStyle = {
    marginTop: '24px',
    padding: '24px',
    background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05), rgba(0, 200, 120, 0.02))',
    borderRadius: '20px',
    border: '1px solid rgba(0, 255, 136, 0.15)',
    textAlign: 'center',
    animation: 'fadeInUp 0.5s ease-out'
  };

  const qrImageStyle = {
    maxWidth: '200px',
    width: '100%',
    height: 'auto',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    border: '3px solid white',
    marginBottom: '16px'
  };

  const qrInfoStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
  };

  const qrDetailsStyle = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
    fontWeight: '500'
  };

  const amountStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#00ff88',
    textShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
    marginTop: '8px'
  };

  const loadingSpinnerStyle = {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px'
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
          <AnimatedText texts={animatedTexts} />
        </div>
        
        <input
          type="number"
          min="1"
          step="1"
          placeholder="จำนวนเงินที่ต้องการบริจาค (บาท)"
          value={qrAmount}
          onChange={e => setQrAmount(e.target.value)}
          style={inputStyle}
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
          onClick={handleCreateQR}
          disabled={qrLoading}
          style={buttonStyle}
          onMouseOver={(e) => {
            if (!qrLoading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 30px rgba(0, 255, 136, 0.6)';
            }
          }}
          onMouseOut={(e) => {
            if (!qrLoading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 255, 136, 0.4)';
            }
          }}
        >
          {qrLoading ? (
            <>
              <span style={loadingSpinnerStyle}></span>
              กำลังสร้าง QR Code...
            </>
          ) : (
            '🎯 สร้าง QR Code สำหรับบริจาค'
          )}
        </button>
        
        {qrError && (
          <div style={errorStyle}>
            ❌ {qrError}
          </div>
        )}
        
        {qrImage && (
          <div style={qrContainerStyle}>
            <img
              src={qrImage}
              alt="QR Donate"
              style={qrImageStyle}
            />
            <div style={qrInfoStyle}>นายสหภูมิ ทับทวี</div>
            <div style={qrDetailsStyle}>📱 เบอร์ 096-823-7098</div>
            <div style={amountStyle}>💰 จำนวน {qrAmount} บาท</div>
          </div>
        )}

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
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default QRPopup;