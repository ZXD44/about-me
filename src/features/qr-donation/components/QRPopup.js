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
    { text: "Support The Void", color: "#ffffff" },
    { text: "Sahaphum Thabtawee", color: "#ffffff" },
    { text: "THANK YOU", color: "#ffffff" }
  ];

  /* Styles using CSS Variables from App.css */
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
    background: 'rgba(5, 5, 5, 0.98)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    borderRadius: '28px',
    padding: isMobile ? '24px' : '36px',
    maxWidth: isMobile ? '90vw' : '500px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    animation: 'slideUp 0.4s ease-out',
    overflow: 'hidden'
  };



  const headerStyle = {
    textAlign: 'center',
    marginBottom: '24px',
    padding: '20px',
    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.2))',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60px'
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    fontSize: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#fff',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '20px',
    fontFamily: 'inherit'
  };

  const buttonStyle = {
    width: '100%',
    padding: '18px 24px',
    background: qrLoading
      ? 'rgba(71, 85, 105, 0.5)'
      : '#ffffff', /* Solid White for Void Theme */
    color: '#000',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: qrLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: qrLoading
      ? 'none'
      : '0 8px 25px var(--accent-glow)',
    position: 'relative',
    overflow: 'hidden'
  };

  const errorStyle = {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#fca5a5',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    marginTop: '16px',
    textAlign: 'center',
    fontWeight: '500',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)'
  };

  const qrContainerStyle = {
    marginTop: '24px',
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    textAlign: 'center',
    animation: 'fadeInUp 0.5s ease-out'
  };

  const qrImageStyle = {
    maxWidth: '200px',
    width: '100%',
    height: 'auto',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    border: '3px solid white',
    marginBottom: '16px'
  };

  const qrInfoStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '8px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
  };

  const qrDetailsStyle = {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '4px',
    fontWeight: '500'
  };

  const amountStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'var(--accent-primary)',
    textShadow: '0 0 10px var(--accent-glow)',
    marginTop: '8px'
  };

  const loadingSpinnerStyle = {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid #000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="qr-popup-close">
          ✕
        </button>

        <div style={headerStyle}>
          <AnimatedText texts={animatedTexts} className="qr-animated-text" />
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
            e.target.style.borderColor = 'var(--accent-primary)';
            e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
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
              e.target.style.boxShadow = '0 12px 30px var(--accent-glow)';
              e.target.style.filter = 'brightness(1.2)';
            }
          }}
          onMouseOut={(e) => {
            if (!qrLoading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px var(--accent-glow)';
              e.target.style.filter = 'none';
            }
          }}
        >
          {qrLoading ? (
            <>
              <span style={loadingSpinnerStyle}></span>
              กำลังสร้าง QR Code...
            </>
          ) : (
            'สร้าง QR Code สำหรับบริจาค'
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
            
            /* Hide spin buttons */
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button { 
              -webkit-appearance: none; 
              margin: 0; 
            }
            input[type=number] {
              -moz-appearance: textfield;
            }

            .qr-popup-close {
              position: absolute;
              top: 20px;
              right: 20px;
              width: 40px;
              height: 40px;
              background: rgba(0, 0, 0, 0.5);
              border: 1px solid #dc2626;
              border-radius: 8px;
              color: #dc2626;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              cursor: pointer;
              z-index: 10;
              transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
              overflow: hidden;
            }

            .qr-popup-close::before {
              content: '';
              position: absolute;
              top: 0; left: 0; width: 100%; height: 100%;
              background: #dc2626;
              z-index: -1;
              transform: translateY(100%);
              transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .qr-popup-close:hover {
              color: #fff;
              transform: rotate(90deg);
              box-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
              border-color: #dc2626;
            }

            .qr-popup-close:hover::before {
              transform: translateY(0);
            }

            .qr-animated-text {
              height: 40px !important;
              margin-bottom: 0 !important;
              margin-top: 8px; /* Move down slightly */
            }

            .qr-animated-text span {
              font-size: 1.5rem !important;
              text-transform: uppercase;
              letter-spacing: 2px !important;
              font-weight: 800 !important;
              text-shadow: 0 2px 10px rgba(0,0,0,0.5);
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default QRPopup;