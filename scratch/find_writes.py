import json

transcript_path = r"C:\Users\yoges\.gemini\antigravity-ide\brain\8ab78aa2-306c-47f9-b979-0298aba6169f\.system_generated\logs\transcript.jsonl"

print("Scanning for write_to_file tool calls...")
with open(transcript_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if "write_to_file" in line:
            try:
                data = json.loads(line)
                tool_calls = data.get("tool_calls", [])
                for call in tool_calls:
                    name = call.get("name")
                    if name == "write_to_file":
                        args = call.get("args", {})
                        if isinstance(args, str):
                            args = json.loads(args)
                        target = args.get("TargetFile", "")
                        print(f"Line {i}: write_to_file for {target}")
                        if "TownTalkModal.tsx" in target:
                            print("FOUND TownTalkModal.tsx write_to_file!")
                            # Save the file content
                            content = args.get("CodeContent", "")
                            with open("src/components/TownTalkModal_recovered.tsx", "w", encoding="utf-8") as out:
                                out.write(content)
                            print("Wrote to src/components/TownTalkModal_recovered.tsx")
            except Exception as e:
                print(f"Error on line {i}: {e}")
