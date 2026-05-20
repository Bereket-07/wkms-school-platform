import os
import subprocess
import glob

def compress_video(file_path):
    temp_path = file_path + ".compressed.mp4"
    print(f"\nCompressing: {os.path.basename(file_path)}")
    
    # Compress to 720p, 30fps, with a reasonable web bitrate and faststart
    cmd = [
        "ffmpeg", "-y", "-i", file_path,
        "-vf", "scale=-2:720,fps=30", # Resize to 720p and 30 fps
        "-c:v", "libx264", "-crf", "28", "-preset", "faster", # Strong compression
        "-c:a", "aac", "-b:a", "128k", # Compress audio
        "-movflags", "+faststart", # Web optimize
        temp_path
    ]
    
    try:
        subprocess.run(cmd, check=True)
        # Check if the new file is smaller
        orig_size = os.path.getsize(file_path)
        new_size = os.path.getsize(temp_path)
        
        print(f"Original size: {orig_size / (1024*1024):.2f} MB")
        print(f"New size: {new_size / (1024*1024):.2f} MB")
        
        if new_size < orig_size and new_size > 0:
            os.replace(temp_path, file_path)
            print("SUCCESS! Video replaced with compressed version.")
        else:
            print("Original was already highly compressed. Keeping original.")
            os.remove(temp_path)
    except Exception as e:
        print(f"FAILED to compress {os.path.basename(file_path)}: {e}")
        if os.path.exists(temp_path):
            os.remove(temp_path)

def main():
    print("Installing ffmpeg if needed...")
    os.system("apt-get update && apt-get install -y ffmpeg")
    
    # Compress CMS Uploads
    upload_dir = "/app/static/uploads"
    if os.path.exists(upload_dir):
        mp4_files = glob.glob(os.path.join(upload_dir, "*.mp4"))
        for f in mp4_files:
            compress_video(f)

if __name__ == "__main__":
    main()
