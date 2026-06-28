import re

js_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\dist\assets\index-Dmj1dACR.js"

print(f"Reading compiled JS bundle from {js_path}...")
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

print(f"JS bundle length: {len(js_content)} characters")

# Let's search for some unique strings in TownTalkModal
# e.g., "Mrs. Petalworth's mailbox", "Bounce McDrizzle", "Townsfolk Calling"
search_terms = [
    "Townsfolk Calling",
    "Mrs. Petalworth's mailbox",
    "Bounce McDrizzle",
    "slingshot",
    "Gossip Exchange",
    "Gift Exchange"
]

for term in search_terms:
    idx = js_content.find(term)
    if idx != -1:
        print(f"Found term '{term}' at index {idx}")
        # Print context of 200 chars around it
        print(f"Context: {js_content[max(0, idx-100):min(len(js_content), idx+100)]}\n")
    else:
        print(f"Term '{term}' NOT found")
