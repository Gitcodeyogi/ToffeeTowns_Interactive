import json

transcript_path = r"C:\Users\yoges\.gemini\antigravity-ide\brain\8ab78aa2-306c-47f9-b979-0298aba6169f\.system_generated\logs\transcript.jsonl"

print("Searching transcript...")
count = 0
with open(transcript_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if "TownTalkModal.tsx" in line:
            count += 1
            print(f"\n--- Match {count} at line {i} ---")
            try:
                data = json.loads(line)
                # Print a clean summary of keys/types
                print(f"Step index: {data.get('step_index')}")
                print(f"Source: {data.get('source')}")
                print(f"Type: {data.get('type')}")
                print(f"Status: {data.get('status')}")
                print(f"Keys: {list(data.keys())}")
                if "tool_calls" in data:
                    print("Tool Calls:")
                    for tc in data["tool_calls"]:
                        print(f"  Name: {tc.get('name')}")
                        args = tc.get('args', {})
                        if isinstance(args, str):
                            print(f"  Args string prefix: {args[:200]}")
                        else:
                            print(f"  Args keys: {list(args.keys()) if isinstance(args, dict) else type(args)}")
                if "content" in data:
                    print(f"Content length: {len(data['content'])}")
            except Exception as e:
                print("Error parsing line:", e)
                # Print first 500 chars of raw line
                print(line[:500])
            if count >= 10:
                print("\nReached limit of 10 matches.")
                break
