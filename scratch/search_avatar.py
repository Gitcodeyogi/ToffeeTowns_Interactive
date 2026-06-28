import re

cache_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\scratch\clean_f_016440.js"

print(f"Reading {cache_path}...")
with open(cache_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for "c.avatar"
matches = [m.start() for m in re.finditer(r'avatar', content)]
print(f"Found {len(matches)} matches:")
for idx, pos in enumerate(matches):
    start = max(0, pos - 100)
    end = min(len(content), pos + 200)
    print(f"\nMatch {idx} at position {pos}:")
    print(content[start:end])
