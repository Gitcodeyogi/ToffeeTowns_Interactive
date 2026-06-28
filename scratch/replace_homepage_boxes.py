import os

file_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\src\components\desk\GG_TravellerDeck_Home.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add the imports at the top
import_target = "import type { SubPage } from '../../pages/TravellersDesk';"
import_replacement = import_target + "\nimport HomeBox2_Census from './home/HomeBox2_Census';\nimport HomeBox3_Chronicles from './home/HomeBox3_Chronicles';\nimport HomeBox4_Ledger from './home/HomeBox4_Ledger';\nimport HomeBox5_Orientation from './home/HomeBox5_Orientation';"

if import_target in content:
    if "import HomeBox2_Census" not in content:
        content = content.replace(import_target, import_replacement, 1)
        print("Imports added successfully.")
    else:
        print("Imports already present.")
else:
    print("Warning: Import target not found!")

# 2. Add the container replacement
start_marker = '<div className="w-full space-y-6 my-4 select-none">'
end_marker = '{/* ── DAILY DISPATCH POPUP ── */}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1:
    print("Error: Start marker not found!")
    exit(1)
if end_idx == -1:
    print("Error: End marker not found!")
    exit(1)

replace_script_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\scratch\replace_boxes.js"
with open(replace_script_path, 'r', encoding='utf-8') as f:
    script_lines = f.readlines()

script_content = "".join(script_lines)
rep_start = script_content.find("const replacement = `")
if rep_start == -1:
    print("Error: const replacement start not found in replace_boxes.js!")
    exit(1)
rep_start += len("const replacement = `")
rep_end = script_content.find("`;\n\nconst newContent = ")
if rep_end == -1:
    rep_end = script_content.find("`;\r\n\r\nconst newContent = ")
if rep_end == -1:
    print("Error: const replacement end not found in replace_boxes.js!")
    exit(1)

replacement_text = script_content[rep_start:rep_end]

# Now do the replacement
new_content = content[:start_idx] + replacement_text + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replacement applied successfully!")
