file_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\src\components\desk\GG_TravellerDeck_Home.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    # Print only ascii safe characters to avoid cp1252 print errors
    if "Cottage" in line or "Dashboard Card" in line or "Daily Routine" in line or "DAILY DISPATCH" in line or "select-none" in line:
        safe_line = line.encode('ascii', errors='ignore').decode('ascii').strip()
        print(f"Line {i+1}: {safe_line}")
