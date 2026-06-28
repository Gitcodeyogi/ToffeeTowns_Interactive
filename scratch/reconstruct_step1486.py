import json
import re

transcript_path = r"C:\Users\yoges\.gemini\antigravity-ide\brain\8ab78aa2-306c-47f9-b979-0298aba6169f\.system_generated\logs\transcript.jsonl"

reconstructed_lines = {}

steps_to_match = [1476, 1484, 1486]

with open(transcript_path, 'r', encoding='utf-8') as f:
    for i, line_record in enumerate(f):
        try:
            data = json.loads(line_record)
            step_idx = data.get("step_index")
            if step_idx in steps_to_match and data.get("type", "").upper() == "VIEW_FILE":
                content = data["content"]
                print(f"Parsing Step {step_idx} content (length {len(content)})...")
                for line in content.split("\n"):
                    match = re.match(r"^(\d+):\s(.*)$", line)
                    if match:
                        line_num = int(match.group(1))
                        line_text = match.group(2)
                        reconstructed_lines[line_num] = line_text
        except Exception as e:
            pass

print(f"Reconstructed lines: {len(reconstructed_lines)} (max line: {max(reconstructed_lines.keys()) if reconstructed_lines else 0})")

# Check for gaps
missing = []
for l in range(1, 1991):
    if l not in reconstructed_lines:
        missing.append(l)

if missing:
    print(f"Warning: {len(missing)} missing lines: {missing[:20]}")
else:
    print("Success: File at Step 1486 reconstructed perfectly with 1990 lines!")

# Write to temp file
out_path = "src/components/TownTalkModal_step1486.tsx"
out_lines = [reconstructed_lines[l] for l in sorted(reconstructed_lines.keys())]
with open(out_path, "w", encoding="utf-8") as out:
    out.write("\n".join(out_lines))
print(f"Written to {out_path}")
