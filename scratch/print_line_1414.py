import json

transcript_path = r"C:\Users\yoges\.gemini\antigravity-ide\brain\8ab78aa2-306c-47f9-b979-0298aba6169f\.system_generated\logs\transcript.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if i == 1414:
            print(f"Line 1414 raw length: {len(line)}")
            try:
                data = json.loads(line)
                content = data.get("content", "")
                print(f"Content length: {len(content)}")
                print("Content prefix:")
                print(content[:500])
                print("Content suffix:")
                print(content[-500:])
            except Exception as e:
                print("Error parsing JSON:", e)
                print(line[:1000])
