import json

transcript_path = r"C:\Users\yoges\.gemini\antigravity-ide\brain\8ab78aa2-306c-47f9-b979-0298aba6169f\.system_generated\logs\transcript.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if i in [73, 74]:
            print(f"\n--- Line {i} ---")
            print(line[:1000]) # Print first 1000 chars of raw line
