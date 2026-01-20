import ROOT
import os

try:
    test_file = "assets/S100.jpg" # Small file for test
    if not os.path.exists(test_file):
        print(f"File {test_file} not found")
        exit(1)
        
    img = ROOT.TImage.Open(test_file)
    if not img:
        print("Could not open image")
        exit(1)
        
    print(f"Original size: {img.GetWidth()}x{img.GetHeight()}")
    
    # Scale (resize)
    img.Scale(100, 100)
    print("Scaled")
    
    img.WriteImage("assets/test_resize.jpg")
    print("Saved")
    
except Exception as e:
    print(f"Error: {e}")
