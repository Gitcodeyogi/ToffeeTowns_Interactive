import os
import re

history_dirs = [
    os.path.expandvars(r"%APPDATA%\Code\User\History"),
    os.path.expandvars(r"%APPDATA%\VSCodium\User\History"),
    os.path.expandvars(r"%USERPROFILE%\.cursor\User\History"),
    os.path.expandvars(r"%APPDATA%\Cursor\User\History")
]

print("Searching IDE Local History directories...")

found_files = []

for d in history_dirs:
    if os.path.exists(d):
        print(f"Scanning {d}...")
        for root, dirs, files in os.walk(d):
            for file in files:
                filepath = os.path.join(root, file)
                try:
                    size = os.path.getsize(filepath)
                    # We are looking for something around 50KB - 150KB
                    if 50000 <= size <= 150000:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            header = f.read(1000)
                            if "TownTalkModal" in header or "Townsfolk Calling" in header:
                                print(f"FOUND MATCH: {filepath} ({size} bytes)")
                                found_files.append((filepath, size))
                except Exception as e:
                    pass

print(f"Search complete. Found {len(found_files)} files.")
if found_files:
    # Sort by size or modification time (latest first)
    found_files.sort(key=lambda x: os.path.getmtime(x[0]), reverse=True)
    latest_file = found_files[0][0]
    print(f"Latest backup: {latest_file}")
    # Copy latest backup to TownTalkModal.tsx
    import shutil
    shutil.copy2(latest_file, "src/components/TownTalkModal.tsx")
    print("Successfully restored latest backup to src/components/TownTalkModal.tsx!")
