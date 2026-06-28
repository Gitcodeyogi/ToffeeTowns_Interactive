import json
import re

transcript_path = r"C:\Users\yoges\.gemini\antigravity-ide\brain\8ab78aa2-306c-47f9-b979-0298aba6169f\.system_generated\logs\transcript.jsonl"

# We will collect lines: line_number -> text
reconstructed_lines = {}
max_line = 0

print("Parsing transcript chronologically...")

with open(transcript_path, 'r', encoding='utf-8') as f:
    for i, line_record in enumerate(f):
        try:
            data = json.loads(line_record)
            step_type = data.get("type", "")
            
            # 1. Parse VIEW_FILE outputs
            if step_type.upper() == "VIEW_FILE" and "TownTalkModal.tsx" in data.get("content", ""):
                content = data["content"]
                # Parse lines of the form "123: text"
                # Be careful: lines may contain colons themselves, so split by the first colon.
                for line in content.split("\n"):
                    match = re.match(r"^(\d+):\s(.*)$", line)
                    if match:
                        line_num = int(match.group(1))
                        line_text = match.group(2)
                        reconstructed_lines[line_num] = line_text
                        max_line = max(max_line, line_num)
            
            # 2. Parse tool calls for edits
            # Model response steps contain tool calls
            tool_calls = data.get("tool_calls", [])
            for call in tool_calls:
                name = call.get("name")
                args = call.get("args", {})
                if isinstance(args, str):
                    try:
                        args = json.loads(args)
                    except:
                        pass
                
                target = args.get("TargetFile", "") if isinstance(args, dict) else ""
                if "TownTalkModal.tsx" in target:
                    if name == "replace_file_content":
                        start = int(args.get("StartLine", 0))
                        end = int(args.get("EndLine", 0))
                        target_content = args.get("TargetContent", "")
                        replacement_content = args.get("ReplacementContent", "")
                        print(f"Found replace_file_content on line {i} (lines {start}-{end})")
                        
                        # Apply edit to reconstructed_lines if possible
                        # For simple replacements, we can replace the lines from start to end with replacement_content lines
                        rep_lines = replacement_content.split("\n")
                        # Clear old lines in range
                        for l in list(reconstructed_lines.keys()):
                            if start <= l <= end:
                                del reconstructed_lines[l]
                        # Insert new lines starting at start
                        for idx, rl in enumerate(rep_lines):
                            reconstructed_lines[start + idx] = rl
                        
                    elif name == "multi_replace_file_content":
                        chunks = args.get("ReplacementChunks", [])
                        print(f"Found multi_replace_file_content on line {i} with {len(chunks)} chunks")
                        for chunk in chunks:
                            start = int(chunk.get("StartLine", 0))
                            end = int(chunk.get("EndLine", 0))
                            replacement_content = chunk.get("ReplacementContent", "")
                            rep_lines = replacement_content.split("\n")
                            # Clear old lines in range
                            for l in list(reconstructed_lines.keys()):
                                if start <= l <= end:
                                    del reconstructed_lines[l]
                            for idx, rl in enumerate(rep_lines):
                                reconstructed_lines[start + idx] = rl
        except Exception as e:
            # print(f"Error parsing line {i}: {e}")
            pass

print(f"Reconstruction finished. Max line number: {max_line}")
print(f"Total unique lines captured: {len(reconstructed_lines)}")

# Check if there are any missing line numbers between 1 and max_line
missing = []
for l in range(1, max_line + 1):
    if l not in reconstructed_lines:
        missing.append(l)

if missing:
    print(f"Warning: {len(missing)} missing lines! E.g.: {missing[:20]}")
else:
    print("Success: All lines from 1 to max_line are present!")

# Write out the reconstructed file
out_lines = []
for l in sorted(reconstructed_lines.keys()):
    out_lines.append(reconstructed_lines[l])

with open("src/components/TownTalkModal.tsx", "w", encoding="utf-8") as out:
    out.write("\n".join(out_lines))
print("Written reconstructed code to src/components/TownTalkModal.tsx")
