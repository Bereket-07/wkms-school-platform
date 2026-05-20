import os
import subprocess
import glob

def main():
    print("Installing ffmpeg if needed...")
    os.system("apt-get update && apt-get install -y ffmpeg")
    
    upload_dir = "/app/static/uploads"
    if not os.path.exists(upload_dir):
        print(f"Directory {upload_dir} not found!")
        return

    mp4_files = glob.glob(os.path.join(upload_dir, "*.mp4"))
    if not mp4_files:
        print("No .mp4 files found in the uploads directory.")
        return

    print(f"Found {len(mp4_files)} videos. Applying Fast Start (Web Optimization)...")
    
    for file_path in mp4_files:
        temp_path = file_path + ".temp.mp4"
        print(f"\nProcessing: {os.path.basename(file_path)}")
        
        # Run ffmpeg to move the MOOV atom to the start of the file without re-encoding
        cmd = [
            "ffmpeg", "-y", "-i", file_path, 
            "-c", "copy", "-movflags", "+faststart", 
            temp_path
        ]
        
        try:
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            # Replace original file with the optimized one
            os.replace(temp_path, file_path)
            print(f"SUCCESS: {os.path.basename(file_path)} is now Web Optimized!")
        except Exception as e:
            print(f"FAILED to optimize {os.path.basename(file_path)}: {e}")
            if os.path.exists(temp_path):
                os.remove(temp_path)

if __name__ == "__main__":
    main()
