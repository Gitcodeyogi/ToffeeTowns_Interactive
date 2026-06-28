import json
import re

transcript_path = r"C:\Users\yoges\.gemini\antigravity-ide\brain\8ab78aa2-306c-47f9-b979-0298aba6169f\.system_generated\logs\transcript.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for i, line_record in enumerate(f):
        if "TownTalkModal.tsx" in line_record:
            try:
                data = json.loads(line_record)
                step_type = data.get("type", "")
                content = data.get("content", "")
                if step_type.upper() == "VIEW_FILE":
                    m = re.search(r"Showing lines (\d+) to (\d+)", content)
                    if m:
                        print(f"Line {i} (Step {data.get('step_index')}): VIEW_FILE showing lines {m.group(1)} to {m.group(2)}")
            except Exception as e:
                pass
