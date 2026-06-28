import os
import re

search_dirs = [
    os.path.expandvars(r"%APPDATA%\Code\Backups"),
    os.path.expandvars(r"%APPDATA%\VSCodium\Backups"),
    os.path.expandvars(r"%USERPROFILE%\AppData\Local\Temp"),
    os.path.expandvars(r"%TEMP%"),
    r"c:\Yogesh Universe\TOFFEETOWNS_FUN\.git"
]

print("Searching system backup and temp directories...")

found_files = []

for d in search_dirs:
    if os.path.exists(d):
        print(f"Scanning {d}...")
        for root, dirs, files in os.walk(d):
            for file in files:
                filepath = os.path.join(root, file)
                try:
                    # Look for large files or files with names that might match
                    # Or scan contents for "TownTalkModal"
                    if file.endswith(".tsx") or file.endswith(".tmp") or file.endswith(".bak") or len(file) > 20:
                        size = os.path.getsize(filepath)
                        # We are looking for something around 70KB - 110KB
                        if 50000 <= size <= 150000:
                            # Let's inspect the first 1KB for TownTalkModal text
                            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                                header = f.read(1000)
                                if "TownTalkModal" in header or "Townsfolk Calling" in header:
                                    print(f"FOUND MATCH: {filepath} ({size} bytes)")
                                    found_files.append((filepath, size))
                except Exception as e:
                    pass

print(f"Search complete. Found {len(found_files)} files.")
