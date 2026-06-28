# inspect_diff.py
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open("diff.txt", "r", encoding="utf-8-sig") as f:
    text = f.read()

# Let's print some lines
print("First 20 lines:")
for line in text.splitlines()[:20]:
    print(line)

print("\nSearching for garbled sequences:")
garbled = set(re.findall(r'[^\x00-\x7F]+', text))
for g in sorted(list(garbled))[:30]:
    print(f"Garbled: {g!r} -> bytes: {g.encode('utf-8')}")
