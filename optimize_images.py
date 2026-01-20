import ROOT
import os
import shutil

# Threshold size in bytes (e.g., 1MB)
SIZE_THRESHOLD = 1 * 1024 * 1024 

# Target max width
MAX_WIDTH_BANNER = 1920
MAX_WIDTH_DEFAULT = 1000

def optimize_image(filepath):
    try:
        if not os.path.exists(filepath):
            return

        file_size = os.path.getsize(filepath)
        if file_size < SIZE_THRESHOLD:
            return

        print(f"Optimizing {filepath} ({file_size/1024/1024:.2f} MB)...")

        # Backup
        backup_path = filepath + ".bak"
        if not os.path.exists(backup_path):
            shutil.copy2(filepath, backup_path)

        img = ROOT.TImage.Open(filepath)
        if not img:
            print(f"  Could not open {filepath}")
            return

        w = img.GetWidth()
        h = img.GetHeight()
        
        # Determine target width
        if "banner" in os.path.basename(filepath).lower():
            target_w = MAX_WIDTH_BANNER
        else:
            target_w = MAX_WIDTH_DEFAULT
            
        # Only downscale
        if w > target_w:
            ratio = h / w
            new_w = target_w
            new_h = int(new_w * ratio)
            
            print(f"  Resizing from {w}x{h} to {new_w}x{new_h}")
            img.Scale(new_w, new_h)
            
            # Save (TImage determines format by extension)
            # TImage doesn't have explicit quality setting in simple API, 
            # but usually defaults are reasonable or we can just save.
            # However TImage.WriteImage overwrites.
            img.WriteImage(filepath)
            
            new_size = os.path.getsize(filepath)
            print(f"  Done. New size: {new_size/1024/1024:.2f} MB")
        else:
            print(f"  Skipping resize (Width {w} <= {target_w}).")
            # Even if we don't resize, simply re-saving might compress it if it was huge uncompressed?
            # But TImage might be tricky with compression params. 
            # Let's trust that if it's < target_w but > 1MB, it might be high DPI or just huge.
            # If we assume mainly dimension reduction is the key. 
            pass

    except Except as e:
        print(f"  Error processing {filepath}: {e}")

def main():
    assets_dir = "assets"
    for filename in os.listdir(assets_dir):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            filepath = os.path.join(assets_dir, filename)
            optimize_image(filepath)

if __name__ == "__main__":
    main()
