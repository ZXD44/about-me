import os
import subprocess
import time
import sys
import urllib.request
import json
from datetime import datetime

# --- การตั้งค่า (Configuration) ---
BRANCH = "main"
REPO_NAME = "ZXD44/about-me"
WEB_URL = "https://ZXD44.github.io/about-me"

# --- สีและสไตล์ (Colors & Styles) ---
class Style:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    RESET = '\033[0m'
    DIM = '\033[2m'

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_banner():
    clear_screen()
    print(f"{Style.CYAN}{Style.BOLD}" + "╔" + "═"*48 + "╗")
    print(f"║   🚀  ระบบอัปเดตเว็บไซต์อัตโนมัติ (Auto Deploy)   ║")
    print("╚" + "═"*48 + "╝" + f"{Style.RESET}\n")

def run(cmd):
    res = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    return res.returncode == 0, res.stdout + res.stderr

def get_latest_run():
    """ดึงข้อมูล Run ล่าสุดจาก GitHub API"""
    url = f"https://api.github.com/repos/{REPO_NAME}/actions/runs?per_page=1"
    try:
        # ใช้ User-Agent เพื่อป้องกัน HTTP 403
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data['workflow_runs']:
                return data['workflow_runs'][0]
    except Exception as e:
        return None
    return None

def check_deployment_status():
    """วนลูปเช็คสถานะจนกว่าจะเสร็จ"""
    print(f"\n{Style.CYAN}📡 กำลังเชื่อมต่อกับ GitHub เพื่อเช็คสถานะการ Build...{Style.RESET}")
    print(f"{Style.DIM}   (กด Ctrl+C เพื่อข้ามการตรวจสอบ){Style.RESET}")
    
    # รอสักครู่ให้ GitHub สร้าง Run ใหม่ (Delay 5 วินาที)
    sys.stdout.write(f"\r{Style.YELLOW}⏳ กำลังรอ GitHub เริ่มต้นทำงาน...{Style.RESET}")
    sys.stdout.flush()
    time.sleep(5) 
    
    start_time = time.time()
    last_status = ""
    
    try:
        while True:
            run_data = get_latest_run()
            if not run_data:
                sys.stdout.write(f"\r{Style.YELLOW}⚠️  ยังไม่พบสถานะ... (กำลังลองใหม่){Style.RESET}   ")
                sys.stdout.flush()
                time.sleep(3)
                continue
                
            status = run_data['status']      # queued, in_progress, completed
            conclusion = run_data['conclusion'] # success, failure, etc.
            name = run_data['name']
            
            elapsed = int(time.time() - start_time)
            
            # --- สร้างข้อความสถานะ ---
            if status == "queued":
                msg = f"⏳ กำลังรอคิว Build ({name})..."
            elif status == "in_progress":
                msg = f"⚙️  กำลัง Build ({name})... {elapsed}s"
            elif status == "completed":
                # ลบข้อความเก่า
                sys.stdout.write(f"\r{' '*80}\r")
                
                if conclusion == "success":
                    print(f"{Style.GREEN}✅ Build สำเร็จ! ({name}) - ใช้เวลา {elapsed} วินาที{Style.RESET}")
                    print("\n" + "="*50)
                    print(f"{Style.GREEN}✨ เว็บไซต์ของคุณพร้อมใช้งานแล้ว!{Style.RESET}")
                    print(f"🌐 ไปที่ลิงก์: {Style.CYAN}{WEB_URL}{Style.RESET}")
                    print("="*50 + "\n")
                    return
                else:
                    print(f"{Style.RED}❌ Build ล้มเหลว ({name}) - {conclusion}{Style.RESET}")
                    print(f"   เช็ค Error ได้ที่: {run_data['html_url']}")
                    return
            
            # แสดง Progress Bar แบบง่ายๆ
            spinners = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
            spinner = spinners[elapsed % len(spinners)]
            
            if msg != last_status or elapsed % 1 == 0:
                sys.stdout.write(f"\r{Style.CYAN}{spinner} {msg}{Style.RESET}           ")
                sys.stdout.flush()
                last_status = msg
                
            time.sleep(2)
            
            # Timeout check (5 นาที)
            if elapsed > 300:
                print(f"\n{Style.YELLOW}⚠️ รอนานเกินไป กรุณาเช็คผลในเว็บ GitHub แทนครับ{Style.RESET}")
                break
                
    except KeyboardInterrupt:
        print(f"\n\n{Style.DIM}⏭️  ข้ามการตรวจสอบสถานะ{Style.RESET}")
        print(f"🌐 ลิงก์ของคุณคือ: {Style.CYAN}{WEB_URL}{Style.RESET}")

def main():
    print_banner()

    # 1. ตรวจสอบสถานะ (Check Status)
    print(f"{Style.DIM}🔍 กำลังตรวจสอบการเปลี่ยนแปลง...{Style.RESET}")
    has_changes, output = run("git status --porcelain")
    
    if not output.strip():
        print(f"\n{Style.GREEN}✨ เว็บไซต์ของคุณเป็นเวอร์ชันล่าสุดแล้ว!{Style.RESET}")
        
        # เพิ่ม Option ให้เช็คสถานะล่าสุดได้แม้ไม่มีการเปลี่ยนแปลง
        ans = input(f"{Style.DIM}👉 ต้องการเช็คสถานะ Build ล่าสุดหรือไม่? (y/n): {Style.RESET}")
        if ans.lower() == 'y':
            check_deployment_status()
        return

    change_count = len(output.strip().splitlines())
    print(f"{Style.YELLOW}📂 พบไฟล์ที่มีการแก้ไขทั้งหมด {change_count} รายการ{Style.RESET}")

    # 2. ยืนยันการอัปโหลด (Confirm)
    print(f"\n{Style.BOLD}ต้องการบันทึกและอัปขึ้นเว็บไซต์เลยไหม?{Style.RESET}")
    try:
        input(f"👉 กดปุ่ม {Style.GREEN}[ENTER]{Style.RESET} เพื่อเริ่มทันที... ")
    except KeyboardInterrupt:
        print(f"\n{Style.RED}❌ ยกเลิกรายการ{Style.RESET}")
        return

    print("\n" + "-"*50)
    
    # 3. เริ่มกระบวนการ Check-in
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    # Step 1: Add
    sys.stdout.write(f"{Style.CYAN}📦 [1/3] กำลังรวบรวมไฟล์...{Style.RESET}")
    if run("git add .")[0]:
        sys.stdout.write(f"\r{Style.GREEN}✅ [1/3] รวบรวมไฟล์เสร็จแล้ว   {Style.RESET}\n")
    else:
        print(f"\n{Style.RED}❌ เกิดข้อผิดพลาดในการ Add ไฟล์{Style.RESET}")
        return

    # Step 2: Commit
    sys.stdout.write(f"{Style.CYAN}💾 [2/3] กำลังบันทึกประวัติ...{Style.RESET}")
    if run(f'git commit -m "Auto Update: {timestamp}"')[0]:
        sys.stdout.write(f"\r{Style.GREEN}✅ [2/3] บันทึกประวัติเสร็จแล้ว  {Style.RESET}\n")
    else:
        sys.stdout.write(f"\r{Style.GREEN}✅ [2/3] ไม่มีอะไรต้องบันทึกเพิ่ม  {Style.RESET}\n")

    # Step 3: Push
    sys.stdout.write(f"{Style.CYAN}🚀 [3/3] กำลังส่งขึ้นเซิร์ฟเวอร์... (อาจใช้เวลาสักครู่){Style.RESET}")
    sys.stdout.flush()
    
    success, push_output = run(f"git push origin {BRANCH}")
    
    if success:
        sys.stdout.write(f"\r{Style.GREEN}✅ [3/3] ส่งข้อมูลสำเร็จ!           {Style.RESET}\n")
        print("\n" + "="*50)
        print(f"{Style.GREEN}{Style.BOLD}🎉 ส่งโค้ดขึ้น GitHub เรียบร้อยครับ{Style.RESET}")
        
        # 4. เรียกใช้ฟังก์ชันเช็คสถานะ
        check_deployment_status()
        
    else:
        sys.stdout.write(f"\r{Style.RED}❌ [3/3] การส่งข้อมูลล้มเหลว        {Style.RESET}\n")
        print(f"\n{Style.YELLOW}⚠️  พบปัญหาการเชื่อมต่อ...{Style.RESET}")
        
        # ถามเพื่อ Force Push
        print(f"\n{Style.BOLD}ต้องการบังคับอัปโหลด (Force Push) ไหม?{Style.RESET}")
        ans = input(f"👉 พิมพ์ {Style.RED}yes{Style.RESET} เพื่อยืนยัน: ")
        if ans.lower().strip() == "yes":
            print(f"\n{Style.YELLOW}💪 กำลังบังคับอัปโหลด...{Style.RESET}")
            if run(f"git push origin {BRANCH} --force")[0]:
                print(f"{Style.GREEN}✅ Force Push สำเร็จ!{Style.RESET}")
                check_deployment_status() # เช็คหลัง force push
            else:
                print(f"{Style.RED}💥 ยังคงล้มเหลว กรุณาตรวจสอบ Git ของคุณ{Style.RESET}")
        else:
            print("ยกเลิกครับ")

if __name__ == "__main__":
    main()
