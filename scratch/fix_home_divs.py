file_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\src\components\desk\GG_TravellerDeck_Home.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Let's inspect line 1580 (which is index 1579)
print(f"Line 1580 content: {lines[1579]!r}")

# Remove line 1580 (index 1579)
del lines[1579]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Line 1580 removed. Running typecheck...")

import subprocess
res = subprocess.run(["npx", "tsc", "--noEmit"], capture_output=True, text=True, shell=True)
print("STDOUT:")
print(res.stdout)
print("STDERR:")
print(res.stderr)
