import React, { useState } from "react";
import axios from "axios";
// import { redeemvouchers } from '@prakrit_m/tmn-voucher'; // ใช้ใน backend เท่านั้น

export default function App() {
  const [donateType, setDonateType] = useState("promptpay"); // "promptpay" หรือ "angpao"
  // PromptPay
  const [qrCode, setQrCode] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Angpao
  const [phone, setPhone] = useState("");
  const [voucherUrl, setVoucherUrl] = useState("");

  // PromptPay QR
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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h2>Donate</h2>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setDonateType("promptpay")} style={{ marginRight: 10, fontWeight: donateType === "promptpay" ? "bold" : "normal" }}>
          PromptPay QR
        </button>
      </div>

      {donateType === "promptpay" && (
        <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 8px #0001", minWidth: 320 }}>
          <h3>PromptPay QR</h3>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="จำนวนเงิน (บาท)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ marginBottom: 10, width: "80%" }}
          />
          <br />
          <button onClick={handleCreateQR} disabled={loading}>
            {loading ? "กำลังสร้าง..." : "สร้าง QR"}
          </button>
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          {qrCode && (
            <div style={{ marginTop: 16 }}>
              <img src={qrCode} alt="QR PromptPay" style={{ width: 200, height: 200 }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
