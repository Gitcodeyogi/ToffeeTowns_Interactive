import json
import os

fp = r"C:\Users\yoges\AppData\Local\Google\Chrome\User Data\Default\Cache\Cache_Data\f_016807"
target_path = r"c:\Yogesh Universe\TOFFEETOWNS_FUN\src\components\TownTalkModal.tsx"

print(f"Reading from {fp}...")
with open(fp, 'rb') as f:
    raw_data = f.read()

# Let's check if it's JSON or has a JSON string inside
# Often Chrome cache contains the HTTP headers at the beginning, followed by the response body.
# Let's find the start of the JSON or the raw body
# JSON usually starts with '{' or '[' or '"'
start_idx = raw_data.find(b'{"')
if start_idx == -1:
    start_idx = raw_data.find(b'["')
if start_idx == -1:
    start_idx = raw_data.find(b'{')

if start_idx != -1:
    print(f"Found potential JSON start at index {start_idx}")
    # Let's try parsing the remaining bytes as JSON
    try:
        json_str = raw_data[start_idx:].decode('utf-8', errors='ignore')
        # Chrome cache might have binary metadata at the end. We need to find where the JSON actually ends.
        # Let's search for the last matching '}'
        end_idx = json_str.rfind('}')
        if end_idx != -1:
            json_str = json_str[:end_idx+1]
        
        parsed = json.loads(json_str)
        print("Successfully parsed as JSON!")
        # If it's a JSON object, let's see what keys it has
        if isinstance(parsed, dict):
            print(f"Keys: {list(parsed.keys())}")
            # Look for file content key (often 'code', 'content', 'source', etc.)
            for k in ['code', 'content', 'source', 'text']:
                if k in parsed:
                    print(f"Found content in key '{k}'!")
                    with open(target_path, 'w', encoding='utf-8') as out:
                        out.write(parsed[k])
                    print("Restored successfully!")
                    exit(0)
    except Exception as e:
        print(f"JSON parsing failed: {e}")

# If JSON parsing failed, let's just do a string replacement of literal '\r\n' to real newlines
print("Falling back to escaping replacement of \\r\\n...")
try:
    # Decode the clean code that has the import
    import_idx = raw_data.find(b"import ")
    if import_idx != -1:
        code_str = raw_data[import_idx:].decode('utf-8', errors='ignore')
        # Replace literal \r\n and \n
        code_str = code_str.replace('\\r\\n', '\n').replace('\\n', '\n').replace('\\t', '\t').replace('\\"', '"')
        
        with open(target_path, 'w', encoding='utf-8') as out:
            out.write(code_str)
        print("Restored successfully using literal escapes replacement!")
    else:
        print("Could not find start of import in file.")
except Exception as e:
    print(f"Error during fallback replacement: {e}")
