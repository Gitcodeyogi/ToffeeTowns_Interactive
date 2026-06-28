# fix_diff.py
import sys

# Reconfigure stdout for UTF-8 just in case
sys.stdout.reconfigure(encoding='utf-8')

try:
    with open("diff.txt", "r", encoding="utf-8-sig") as f:
        text = f.read()

    # Encode to bytes as cp437, decode as utf-8
    fixed_bytes = text.encode("cp437", errors="replace")
    fixed_text = fixed_bytes.decode("utf-8", errors="replace")

    with open("diff_fixed.txt", "w", encoding="utf-8") as f_out:
        f_out.write(fixed_text)

    print("Success! Cleaned diff file written to diff_fixed.txt")
    print("First 20 lines of fixed diff:")
    for line in fixed_text.splitlines()[:20]:
        print(line)
except Exception as e:
    print(f"Error: {e}")
