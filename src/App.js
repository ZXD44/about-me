import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [qrCode, setQrCode] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateQR = async () => {
    setError("");
    setQrCode("");
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("กรุณากรอกจำนวนเงินให้ถูกต้อง");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.pp-qr.com/api/0968237098/${amount}`
      );
      if (response.status === 200) {
        setQrCode(response.data.qrImage);
      } else {
        setError(response.data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        fontFamily: "Kanit, Prompt, Noto Sans Thai, Inter, Sarabun, sans-serif",
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.82)',
          border: '1.5px solid #e5e7eb',
          borderRadius: 22,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
          padding: 32,
          minWidth: 320,
          maxWidth: 370,
          textAlign: "center",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <h2 style={{ color: "#2563eb", marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>สร้าง QR PromptPay</h2>
        <div style={{ color: "#2563eb", fontWeight: "bold", fontSize: 18, marginBottom: 16 }}>
          สหภูมิ ทับทวี
        </div>
        <input
          type="number"
          min="1"
          step="1"
          placeholder="จำนวนเงิน (บาท)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "1.5px solid #60a5fa",
            fontSize: 16,
            width: "80%",
            marginBottom: 16,
            outline: "none",
            boxSizing: "border-box",
            transition: "border 0.2s",
            background: 'rgba(255,255,255,0.95)',
            color: '#2563eb',
            fontWeight: 600,
          }}
        />
        <br />
        <button
          onClick={handleCreateQR}
          disabled={loading}
          style={{
            background: loading ? "#cbd5e1" : "#334155",
            color: "#fff",
            border: "1.5px solid #475569",
            borderRadius: 10,
            padding: "12px 38px",
            fontSize: 17,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "0 2px 8px #cbd5e1" : "0 4px 16px #33415533",
            marginBottom: 16,
            letterSpacing: 0.5,
            fontFamily: "Kanit, Prompt, Noto Sans Thai, Inter, Sarabun, sans-serif",
            outline: "none",
            transition: "background 0.2s, box-shadow 0.2s, border 0.2s",
          }}
          onMouseOver={e => {
            if (!loading) {
              e.currentTarget.style.background = '#475569';
              e.currentTarget.style.boxShadow = '0 0 0 4px #64748b44, 0 4px 24px #33415555';
              e.currentTarget.style.border = '1.5px solid #334155';
            }
          }}
          onMouseOut={e => {
            if (!loading) {
              e.currentTarget.style.background = '#334155';
              e.currentTarget.style.boxShadow = '0 4px 16px #33415533';
              e.currentTarget.style.border = '1.5px solid #475569';
            }
          }}
        >
          {loading ? "กำลังสร้าง..." : "สร้าง QR"}
        </button>
        {error && (
          <div style={{ color: "#e11d48", marginBottom: 12, fontWeight: 600 }}>{error}</div>
        )}
        {qrCode && (
          <div style={{ marginTop: 20 }}>
            <img
              src={qrCode}
              alt="QR PromptPay"
              style={{ width: 220, height: 220, borderRadius: 12, border: "2px solid #475569", background: '#fff', boxShadow: '0 2px 12px #33415522' }}
            />
            <div style={{ marginTop: 8, color: "#334155", fontWeight: "bold" }}>
              สหภูมิ ทับทวี
            </div>
            <div style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>เบอร์ 096-823-7098</div>
            <div style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>จำนวน {amount} บาท</div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 32, color: "#334155", fontSize: 13, fontWeight: 600, letterSpacing: 0.2 }}>
        © {new Date().getFullYear()} สหภูมิ ทับทวี | ตัวอย่างระบบสร้าง QR PromptPay
      </div>
    </div>
  );
}
