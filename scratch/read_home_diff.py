with open(r"c:\Yogesh Universe\TOFFEETOWNS_FUN\scratch\home_diff.txt", 'r', encoding='utf-8') as f:
    diff_text = f.read()

lines = diff_text.split('\n')
print(f"Total lines in diff: {len(lines)}")

# Let's find hunks where large deletions occurred
for i, line in enumerate(lines):
    if line.startswith('@@'):
        print(f"\nLine {i}: {line}")
        # Print next 20 lines of diff
        for j in range(1, 30):
            if i + j < len(lines):
                print(lines[i+j])
