import os
import subprocess
from datetime import datetime

# --- สีสัน (Colors) ---
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
RESET = '\033[0m'
BOLD = '\033[1m'

def run(cmd):
    """รันคำสั่งและคืนค่า True ถ้าสำเร็จ"""
    return subprocess.run(cmd, shell=True, text=True, capture_output=True).returncode == 0

def main():
    # ล้างหน้าจอ
    os.system('cls' if os.name == 'nt' else 'clear')
    print(f"{BOLD}🚀 ระบบอัปโหลดอัตโนมัติ (Simple Mode){RESET}\n")

    # 1. ตรวจสอบไฟล์ที่มีการแก้ไข
    res = subprocess.run("git status --porcelain", shell=True, text=True, capture_output=True)
    if not res.stdout.strip():
        print(f"{GREEN}✅ โปรเจคเป็นปัจจุบันแล้ว (ไม่มีอะไรต้องอัปโหลด){RESET}")
        return

    change_count = len(res.stdout.strip().splitlines())
    print(f"{YELLOW}📦 พบการแก้ไขทั้งหมด {change_count} ไฟล์{RESET}")
    
    # 2. ยืนยันง่ายๆ แค่กด Enter
    input(f"\n{BOLD}👉 กดปุ่ม [ENTER] เพื่อเริ่มต้นอัปโหลด...{RESET}")
    print(f"\n{YELLOW}⏳ กำลังทำงาน...{RESET}")

    # 3. ทำงานอัตโนมัติ
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    msg = f"Auto Upgrade: {timestamp}"
    
    # Git Commands
    if run("git add .") and run(f'git commit -m "{msg}"'):
        print("✅ บันทึกไฟล์เรียบร้อย")
        
        print("🚀 กำลังส่งขึ้น GitHub...")
        if run("git push origin main"):
            print(f"\n{GREEN}{BOLD}🎉 สำเร็จ! เว็บไซต์ของคุณกำลังถูก Deploy.{RESET}")
            print(f"   รอประมาณ 1-2 นาที แล้วเช็คได้ที่: https://ZXD44.github.io/about-me")
        else:
            # กรณี Push ปกติไม่ได้ (เช่น Cloud ใหม่กว่า) จะ Force Push ให้เอง
            print(f"\n{YELLOW}⚠️  พบปัญหาการเชื่อมต่อ กำลังพยายาม Force Push...{RESET}")
            if run("git push origin main --force"):
                 print(f"\n{GREEN}{BOLD}🎉 สำเร็จ! (Force Pushed){RESET}")
                 print(f"   รอประมาณ 1-2 นาที แล้วเช็คได้ที่: https://ZXD44.github.io/about-me")
            else:
                 print(f"{RED}💥 ผิดพลาด: ไม่สามารถอัปโหลดได้ กรุณาเช็คอินเทอร์เน็ต{RESET}")

if __name__ == "__main__":
    main()
