import re
import os

target_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\src\components\TownTalkModal.tsx"

print(f"Reading {target_path}...")
with open(target_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Unescape unicode escapes like \u003c to <, etc.
# In Python, we can find literal \uXXXX sequences and convert them
def replace_unicode_escape(match):
    hex_val = match.group(1)
    return chr(int(hex_val, 16))

unescaped = re.sub(r'\\u([0-9a-fA-F]{4})', replace_unicode_escape, content)

# 2. Let's find the true end of the file.
# The component ends at:
# };
# Everything after that is error overlay HTML/JS.
# Let's locate the last "export const TownTalkModal" or "onClose" etc.
# We know the file should end with:
#     </div>
#   );
# };
# Let's search for "onClose();\n        }, 3000);\n      } else {\n        const reply = getCharacterReply(currentChar, text);\n        addMessageToLog(selectedCharId, { sender: 'npc', text: reply, time: respTimeStr });\n        cozyAudio.playClick();\n      }\n    }, 700);\n  };\n\n  const getCharacterReply = (char: CharacterTalk, text: string): string => {"
# Or let's search for the pattern of closing div tags at the end of the file.
# Let's check how the file ends before the HTML section:
# 2080:         </div>
# 2081:       )}
# 2082:     </div>
# 2083:   );
# 2084: };

# Let's search for the first occurrence of "</html>" or "Vite" or the end of the react component
# Actually, the garbage starts around:
# };
# "}
# try {
#   const { ErrorOverlay } = await import("/@vite/client")

garbage_marker = '"};\nexport const ' # Wait, is there an export after it? No.
# Let's see:
# 2084: };
# 2085: "}
# 2086:               try {

# We can search for the last occurrence of "export const TownTalkModal" and then the corresponding closing brackets,
# or we can find `};\n"}` or simply slice up to `};` around the end.
# Let's find `};\n"}` or `};\n"}\n`
end_idx = unescaped.find('};\n"}')
if end_idx != -1:
    print(f"Found end marker at index {end_idx}")
    unescaped = unescaped[:end_idx + 2] # Include the };
else:
    # If not found, let's find `};\n` near the very end
    # Let's search for the last `};` before the HTML tags
    html_idx = unescaped.find('<html')
    if html_idx == -1:
        html_idx = unescaped.find('<!DOCTYPE')
    if html_idx == -1:
        html_idx = unescaped.find('ErrorOverlay')
        
    if html_idx != -1:
        # search backwards for };
        last_bracket = unescaped[:html_idx].rfind('};')
        if last_bracket != -1:
            unescaped = unescaped[:last_bracket + 2]
            print(f"Truncated file at last bracket before HTML: {last_bracket}")

# Write the cleaned file back
with open(target_path, 'w', encoding='utf-8') as out:
    out.write(unescaped)

print("Saved cleaned file successfully!")
