import json

transcript_path = r"C:\Users\yoges\.gemini\antigravity-ide\brain\8ab78aa2-306c-47f9-b979-0298aba6169f\.system_generated\logs\transcript.jsonl"

print("Scanning for VIEW_FILE outputs of TownTalkModal.tsx...")
matches = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if "TownTalkModal.tsx" in line:
            try:
                data = json.loads(line)
                step_type = data.get("type", "")
                content = data.get("content", "")
                
                if content and step_type.upper() == "VIEW_FILE":
                    print(f"Line {i}: VIEW_FILE, content length={len(content)}")
                    matches.append((i, content))
            except Exception as e:
                pass

with open("scratch/view_file_matches.json", "w", encoding="utf-8") as out:
    json.dump(matches, out, indent=2)
print(f"Saved {len(matches)} matches to scratch/view_file_matches.json")
