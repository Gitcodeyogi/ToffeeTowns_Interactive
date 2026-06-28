import os
import re

user_profile = os.path.expandvars(r"%USERPROFILE%")
cache_paths = [
    os.path.join(user_profile, r"AppData\Local\Google\Chrome\User Data\Default\Cache\Cache_Data"),
    os.path.join(user_profile, r"AppData\Local\Microsoft\Edge\User Data\Default\Cache\Cache_Data"),
    os.path.join(user_profile, r"AppData\Roaming\Mozilla\Firefox\Profiles")
]

print("Searching browser cache directories for TownTalkModal.tsx...")

found_files = []

# Chrome and Edge cache files are usually named f_xxxxxx or data_x
# Let's search all files in these directories for Townsfolk Calling or TownTalkModal content
for cache_dir in cache_paths:
    if os.path.exists(cache_dir):
        print(f"Scanning {cache_dir}...")
        for root, dirs, files in os.walk(cache_dir):
            for file in files:
                filepath = os.path.join(root, file)
                try:
                    size = os.path.getsize(filepath)
                    # The file size should be between 30KB and 150KB
                    if 30000 <= size <= 150000:
                        with open(filepath, 'rb') as f:
                            content = f.read()
                            # Search for unique strings in the TSX
                            if b"TownTalkModal" in content or b"Townsfolk Calling" in content:
                                print(f"FOUND IN BROWSER CACHE: {filepath} ({size} bytes)")
                                found_files.append((filepath, size))
                except Exception as e:
                    pass

print(f"Search complete. Found {len(found_files)} files in browser cache.")
if found_files:
    # Sort by modification time (latest first)
    found_files.sort(key=lambda x: os.path.getmtime(x[0]), reverse=True)
    latest_file, size = found_files[0]
    print(f"Latest cache file: {latest_file} ({size} bytes)")
    
    # Let's read and write it back, cleaning up any binary headers if it's a Chrome cache file
    with open(latest_file, 'rb') as f:
        raw_data = f.read()
    
    # Chrome cache files sometimes start with a binary header (HTTP response headers)
    # The source code usually starts with standard JS/TS imports
    import_idx = raw_data.find(b"import React")
    if import_idx != -1:
        clean_code = raw_data[import_idx:].decode('utf-8', errors='ignore')
        # Write back to components
        with open("src/components/TownTalkModal.tsx", "w", encoding="utf-8") as out:
            out.write(clean_code)
        print("Successfully restored from browser cache!")
    else:
        print("Could not find 'import React' in the cache file. Writing raw data to scratch/raw_cache_blob.txt")
        with open("scratch/raw_cache_blob.txt", "wb") as out:
            out.write(raw_data)
