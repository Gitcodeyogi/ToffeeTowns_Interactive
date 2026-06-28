import os
import zlib
import re

git_objects_dir = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\.git\objects"

print(f"Scanning loose git objects in {git_objects_dir}...")

found_count = 0

for root, dirs, files in os.walk(git_objects_dir):
    for file in files:
        if len(file) == 38:  # Loose object filenames are 38 hex chars (the first 2 are the directory name)
            dir_name = os.path.basename(root)
            sha = dir_name + file
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'rb') as f:
                    compressed_data = f.read()
                    decompressed_data = zlib.decompress(compressed_data)
                    # Git object header format: type size\0content
                    header_end = decompressed_data.find(b'\x00')
                    if header_end != -1:
                        header = decompressed_data[:header_end].decode('ascii', errors='ignore')
                        obj_type, obj_size = header.split(' ')
                        obj_size = int(obj_size)
                        content = decompressed_data[header_end+1:]
                        
                        if obj_type == "blob" and obj_size > 10000:
                            content_str = content.decode('utf-8', errors='ignore')
                            if "TownTalkModal" in content_str or "Townsfolk Calling" in content_str:
                                print(f"FOUND MATCH: SHA {sha}, type {obj_type}, size {obj_size} bytes")
                                # Write to a temp file
                                temp_out = f"scratch/blob_{sha[:8]}.tsx"
                                with open(temp_out, 'w', encoding='utf-8') as out:
                                    out.write(content_str)
                                print(f"Wrote match to {temp_out}")
                                found_count += 1
            except Exception as e:
                pass

print(f"Finished scanning. Found {found_count} matching blobs.")
