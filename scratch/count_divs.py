file_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\src\components\desk\GG_TravellerDeck_Home.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's extract the return block starting around line 952
start_idx = content.find("return (")
if start_idx == -1:
    print("Could not find return statement!")
    exit(1)

sub_content = content[start_idx:]

import re

# Tokenize into tags/braces
tokens = re.findall(r'(<div[^>]*>|</div>|{|}|\(|\))', sub_content)

div_stack = []
brace_count = 0
paren_stack = []

for i, tok in enumerate(tokens):
    if tok.startswith("<div"):
        div_stack.append(f"div (token {i})")
    elif tok == "</div>":
        if div_stack:
            div_stack.pop()
        else:
            print(f"Error: Excess </div> at token {i}: {tok}")
    elif tok == "{":
        brace_count += 1
    elif tok == "}":
        brace_count -= 1
        if brace_count < 0:
            print(f"Error: Excess }} at token {i}")
    elif tok == "(":
        paren_stack.append(f"( (token {i})")
    elif tok == ")":
        if paren_stack:
            paren_stack.pop()
        else:
            print(f"Error: Excess ) at token {i}")

print(f"Remaining divs in stack: {len(div_stack)}")
print(f"Remaining braces: {brace_count}")
print(f"Remaining parens in stack: {len(paren_stack)}")
