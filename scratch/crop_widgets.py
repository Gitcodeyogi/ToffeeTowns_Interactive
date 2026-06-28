import os
from PIL import Image

icons_dir = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\public\Assets\Icons"
cropped_dir = os.path.join(icons_dir, "cropped")
os.makedirs(cropped_dir, exist_ok=True)

widget_sheet_path = os.path.join(icons_dir, "widgetIcons.png")
sheet = Image.open(widget_sheet_path)
width, height = sheet.size

# Since it has 3 columns and 2 rows
cols = 3
rows = 2

col_width = width // cols
row_height = height // rows

widget_names = [
    ["widget_guide_map.png", "widget_journey.png", "widget_dispatch.png"],
    ["widget_help.png", "widget_calling.png", "widget_logs.png"]
]

for r in range(rows):
    for c in range(cols):
        left = c * col_width
        top = r * row_height
        # Make sure the last column and row get all remaining pixels
        right = (c + 1) * col_width if c < cols - 1 else width
        bottom = (r + 1) * row_height if r < rows - 1 else height
        
        box = (left, top, right, bottom)
        cropped_img = sheet.crop(box)
        output_name = widget_names[r][c]
        output_path = os.path.join(cropped_dir, output_name)
        cropped_img.save(output_path)
        print(f"Saved {output_name} with size {cropped_img.size}")
