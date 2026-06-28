import os
import shutil

source_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\scratch\clean_f_016807.js"
target_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\src\components\TownTalkModal.tsx"

print(f"Restoring file from {source_path} to {target_path}...")
if os.path.exists(source_path):
    shutil.copy2(source_path, target_path)
    print("Restore completed successfully!")
else:
    print(f"Error: source file {source_path} does not exist!")
