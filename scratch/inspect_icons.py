import os
from PIL import Image

icons_dir = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\public\Assets\Icons"
cropped_dir = os.path.join(icons_dir, "cropped")

files = os.listdir(icons_dir)
print("Icons dir files:")
for f in files:
    if f.endswith('.png'):
        p = os.path.join(icons_dir, f)
        img = Image.open(p)
        print(f"{f}: size={img.size}, mode={img.mode}")

if os.path.exists(cropped_dir):
    print("\nCropped dir files:")
    for f in os.listdir(cropped_dir):
        if f.endswith('.png'):
            p = os.path.join(cropped_dir, f)
            img = Image.open(p)
            print(f"{f}: size={img.size}, mode={img.mode}")
