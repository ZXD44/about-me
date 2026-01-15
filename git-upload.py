import os
import subprocess
import time
import sys
import urllib.request
import json
import threading
from datetime import datetime

# --- การตั้งค่า (Configuration) ---
BRANCH = "main"
REPO_NAME = "ZXD44/about-me"
WEB_URL = "https://www.zirconx.my"

# --- สีและสไตล์ (Colors & Styles) ---
class Style:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    BOLD = '\033[1m'
    RESET = '\033[0m'
    DIM = '\033[2m'

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_banner():
    clear_screen()
    print(f"{Style.CYAN}{Style.BOLD}" + "╔" + "═"*58 + "╗")
    print(f"║     🚀  ZirconX Auto Deploy System v3.0 (Pro) 📦      ║")
    print("╚" + "═"*58 + "╝" + f"{Style.RESET}\n")

def run(cmd):
    res = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    return res.returncode == 0, res.stdout + res.stderr

def get_latest_run():
    """ดึงข้อมูล Run ล่าสุดจาก GitHub API"""
    url = f"https://api.github.com/repos/{REPO_NAME}/actions/runs?per_page=1"
    try:
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

def animated_loading(stop_event, message="กำลังทำงาน"):
    chars = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
    i = 0
    while not stop_event.is_set():
        sys.stdout.write(f"\r{Style.YELLOW}{chars[i % len(chars)]} {message}...{Style.RESET}")
        sys.stdout.flush()
        time.sleep(0.1)
        i += 1
    sys.stdout.write("\r" + " "*60 + "\r") # Clear line

def check_deployment_status():
    """วนลูปเช็คสถานะจนกว่าจะเสร็จ"""
    print(f"\n{Style.CYAN}📡 กำลังเชื่อมต่อดาวเทียม... (GitHub Actions){Style.RESET}")
    print(f"{Style.DIM}   (กด Ctrl+C เพื่อข้ามการตรวจสอบได้ตลอดเวลา){Style.RESET}")
    
    # รอสักครู่ให้ GitHub สร้าง Run ใหม่ (Delay 5 วินาที)
    stop_waiting = threading.Event()
    wait_thread = threading.Thread(target=animated_loading, args=(stop_waiting, "กำลังรอ GitHub เริ่มต้น"))
    wait_thread.start()
    
    time.sleep(5) 
    stop_waiting.set()
    wait_thread.join()
    
    start_time = time.time()
    last_status = ""
    
    try:
        while True:
            run_data = get_latest_run()
            if not run_data:
                sys.stdout.write(f"\r{Style.YELLOW}⚠️  ยังไม่พบสถานะ... (ลองใหม่){Style.RESET}   ")
                sys.stdout.flush()
                time.sleep(3)
                continue
                
            status = run_data['status']      # queued, in_progress, completed
            conclusion = run_data['conclusion'] # success, failure, etc.
            name = run_data['name']
            
            elapsed = int(time.time() - start_time)
            mins, secs = divmod(elapsed, 60)
            time_str = f"{mins}m {secs}s"
            
            # --- สร้างข้อความสถานะ ---
            if status == "queued":
                msg = f"⏳ กำลังรอคิว Build ({name})..."
                color = Style.YELLOW
            elif status == "in_progress":
                msg = f"⚙️  กำลัง Build... ({name}) [{time_str}]"
                color = Style.BLUE
            elif status == "completed":
                sys.stdout.write(f"\r{' '*80}\r") # Clear line
                
                if conclusion == "success":
                    print(f"{Style.GREEN}✅ Build สำเร็จแบบสวยงาม! 💖")
                    print(f"⏱️ ใช้เวลาทั้งหมด: {time_str}{Style.RESET}")
                    print("\n" + "="*60)
                    print(f"{Style.GREEN}{Style.BOLD}✨ เว็บไซต์ของคุณออนไลน์แล้วครับลูกพี่! 🚀{Style.RESET}")
                    print(f"{Style.DIM}🌐 Link: {Style.CYAN}{WEB_URL}{Style.RESET}")
                    print("="*60 + "\n")
                    return
                else:
                    print(f"{Style.RED}❌ Build ล้มเหลว ({name}) - {conclusion}{Style.RESET}")
                    print(f"👉 เช็ค Error ได้ที่: {run_data['html_url']}")
                    return
            
            # แสดง Progress Bar
            spinners = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
            spinner = spinners[elapsed % len(spinners)]
            
            if msg != last_status or elapsed % 1 == 0:
                sys.stdout.write(f"\r{color}{spinner} {msg}{Style.RESET}           ")
                sys.stdout.flush()
                last_status = msg
                
            time.sleep(1)
            
            if elapsed > 300: # 5 นาที
                print(f"\n{Style.YELLOW}⚠️ รอนานเกินไป กรุณาเช็คผลในเว็บ GitHub แทนครับ{Style.RESET}")
                break
                
    except KeyboardInterrupt:
        print(f"\n\n{Style.DIM}⏭️  ข้ามการตรวจสอบสถานะ{Style.RESET}")
        print(f"🌐 ลิงก์ของคุณคือ: {Style.CYAN}{WEB_URL}{Style.RESET}")

def main():
    print_banner()

    # 1. ตรวจสอบสถานะ (Check Status)
    print(f"{Style.DIM}🔍 กำลังสแกนความเปลี่ยนแปลง...{Style.RESET}")
    has_changes, output = run("git status --porcelain")
    
    if not output.strip():
        print(f"\n{Style.GREEN}✨ ยินดีด้วย! โค้ดของคุณเป็นเวอร์ชันล่าสุดแล้ว{Style.RESET}")
        
        # เพิ่ม Option ให้เช็คสถานะล่าสุดได้แม้ไม่มีการเปลี่ยนแปลง
        ans = input(f"{Style.DIM}👉 อยากเช็คสถานะการ Build ล่าสุดเล่นๆ ไหม? (y/n): {Style.RESET}")
        if ans.lower() == 'y':
            check_deployment_status()
        return

    change_list = output.strip().splitlines()
    change_count = len(change_list)
    
    print(f"\n{Style.YELLOW}📂 พบไฟล์ที่มีการแก้ไข {change_count} รายการ:{Style.RESET}")
    # แสดงรายชื่อไฟล์ที่แก้ (สูงสุด 5 ไฟล์)
    for i, line in enumerate(change_list[:5]):
        print(f"  {Style.DIM}- {line.strip()}{Style.RESET}")
    if change_count > 5:
        print(f"  {Style.DIM}... และอีก {change_count - 5} ไฟล์{Style.RESET}")

    # 2. ยืนยันการอัปโหลด (Confirm)
    print(f"\n{Style.BOLD}พร้อมจะส่งงานขึ้นฟ้าหรือยังครับ?{Style.RESET}")
    try:
        input(f"👉 กดปุ่ม {Style.GREEN}[ENTER]{Style.RESET} เพื่อเริ่มภารกิจ... ")
    except KeyboardInterrupt:
        print(f"\n{Style.RED}❌ ยกเลิกภารกิจ{Style.RESET}")
        return

    print("\n" + "-"*60)
    
    # 3. เริ่มกระบวนการ Workflow
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Step 1: Add
    sys.stdout.write(f"{Style.CYAN}📦 [1/3] กำลังแพ็คของ (Adding)...{Style.RESET}")
    if run("git add .")[0]:
        sys.stdout.write(f"\r{Style.GREEN}✅ [1/3] แพ็คของเรียบร้อย!       {Style.RESET}\n")
    else:
        print(f"\n{Style.RED}❌ Add ไฟล์ไม่ผ่าน (ลองเช็ค Permission ดูนะ){Style.RESET}")
        return

    # Step 2: Commit
    sys.stdout.write(f"{Style.CYAN}💾 [2/3] กำลังบันทึกความทรงจำ (Committing)...{Style.RESET}")
    commit_msg = f"Update: {timestamp} (Auto-Deploy)"
    if run(f'git commit -m "{commit_msg}"')[0]:
        sys.stdout.write(f"\r{Style.GREEN}✅ [2/3] บันทึกความทรงจำเรียบร้อย!  {Style.RESET}\n")
    else:
        sys.stdout.write(f"\r{Style.GREEN}✅ [2/3] ไม่มีอะไรใหม่ต้องบันทึกเพิ่ม  {Style.RESET}\n")

    # Step 3: Push
    sys.stdout.write(f"{Style.CYAN}🚀 [3/3] กำลังส่งจรวดขึ้นฟ้า (Pushing)...{Style.RESET}")
    sys.stdout.flush()
    
    # ใช้ Thread เพื่อแสดง Animation ระหว่างรอ Push นานๆ
    stop_push = threading.Event()
    push_thread = threading.Thread(target=animated_loading, args=(stop_push, "กำลังส่งข้อมูล"))
    push_thread.start()
    
    success, push_output = run(f"git push origin {BRANCH}")
    
    stop_push.set()
    push_thread.join()
    
    if success:
        sys.stdout.write(f"\r{Style.GREEN}✅ [3/3] ส่งจรวดถึงฐานเรียบร้อย!          {Style.RESET}\n")
        print("\n" + "="*60)
        print(f"{Style.MAGENTA}{Style.BOLD}🎉 ภารกิจเสร็จสิ้น! โค้ดของคุณปลอดภัยบน GitHub แล้วครับ{Style.RESET}")
        
        # 4. เรียกใช้ฟังก์ชันเช็คสถานะ
        check_deployment_status()
        
    else:
        sys.stdout.write(f"\r{Style.RED}❌ [3/3] จรวดตก! การส่งข้อมูลล้มเหลว          {Style.RESET}\n")
        print(f"\n{Style.YELLOW}⚠️  เกิดปัญหาบางอย่าง...{Style.RESET}")
        
        # ถามเพื่อ Force Push
        print(f"\n{Style.BOLD}ต้องการใช้พลังพิเศษ (Force Push) เพื่อทับเลยไหม?{Style.RESET}")
        ans = input(f"👉 พิมพ์ {Style.RED}yes{Style.RESET} เพื่อยืนยันพลังพิเศษ: ")
        if ans.lower().strip() == "yes":
            print(f"\n{Style.YELLOW}💪 กำลังใช้พลังพิเศษ...{Style.RESET}")
            if run(f"git push origin {BRANCH} --force")[0]:
                print(f"{Style.GREEN}✅ Force Push สำเร็จ! (โหดมาก){Style.RESET}")
                check_deployment_status() # เช็คหลัง force push
            else:
                print(f"{Style.RED}💥 ยังคงล้มเหลว... อาจจะต้องเช็ค Git Manual แล้วล่ะ{Style.RESET}")
        else:
            print("รับทราบครับ ไว้วันหลังค่อยลองใหม่")

if __name__ == "__main__":
    main()
