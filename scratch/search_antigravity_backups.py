import os
import shutil

search_dirs = [
    os.path.expandvars(r"%APPDATA%\Antigravity"),
    os.path.expandvars(r"%APPDATA%\Antigravity IDE"),
    os.path.expandvars(r"%USERPROFILE%\AppData\Local\Antigravity"),
    os.path.expandvars(r"%USERPROFILE%\AppData\Local\Antigravity IDE")
]

print("Searching Antigravity directories...")

found_files = []

for d in search_dirs:
    if os.path.exists(d):
        print(f"Scanning {d}...")
        for root, dirs, files in os.walk(d):
            for file in files:
                filepath = os.path.join(root, file)
                try:
                    # Check size (50KB to 150KB) or file extension or content
                    size = os.path.getsize(filepath)
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
    found_files.sort(key=lambda x: os.path.getmtime(x[0]), reverse=True)
    latest_file, size = found_paths[0]
    print(f"Latest backup: {latest_file}")
    shutil.copy2(latest_file, "src/components/TownTalkModal.tsx")
    print("Restored successfully!")
