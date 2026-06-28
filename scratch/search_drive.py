import os

search_root = r"c:\Yogesh Universe"
filename_to_find = "TownTalkModal.tsx"

print(f"Searching for {filename_to_find} in {search_root}...")

found_paths = []

for root, dirs, files in os.walk(search_root):
    # Skip the current project's component directory to avoid finding the empty one we are working on
    if r"TOFFEETOWNS_FUN\src\components" in root:
        continue
    for file in files:
        if file == filename_to_find:
            filepath = os.path.join(root, file)
            size = os.path.getsize(filepath)
            print(f"FOUND: {filepath} ({size} bytes)")
            found_paths.append((filepath, size))

print(f"Search complete. Found {len(found_paths)} files.")
if found_paths:
    # Sort by modification time (latest first)
    found_paths.sort(key=lambda x: os.path.getmtime(x[0]), reverse=True)
    latest_file, size = found_paths[0]
    print(f"Latest backup: {latest_file} ({size} bytes)")
    # Copy it back!
    import shutil
    shutil.copy2(latest_file, "src/components/TownTalkModal.tsx")
    print("Successfully restored from backup!")
