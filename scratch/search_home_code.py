import re

path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\src\components\desk\GG_TravellerDeck_Home.tsx"
out_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\scratch\home_search_results.txt"

print(f"Reading {path}...")
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

out_lines = []

# Let's search for some keys
for key in ['dispatch', 'widget', 'HomeBox', 'playcard', 'Guide']:
    matches = [m.start() for m in re.finditer(key, content, re.IGNORECASE)]
    out_lines.append(f"Key '{key}': found {len(matches)} occurrences")
    for idx, pos in enumerate(matches):
        start = max(0, pos - 150)
        end = min(len(content), pos + 250)
        out_lines.append(f"  Match {idx}:")
        out_lines.append(content[start:end])
        out_lines.append("-" * 40)

with open(out_path, 'w', encoding='utf-8') as f:
    f.write("\n".join(out_lines))

print(f"Saved results to {out_path}")
