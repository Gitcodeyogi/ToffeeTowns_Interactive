import os

cache_files = [
    r"C:\Users\yoges\AppData\Local\Google\Chrome\User Data\Default\Cache\Cache_Data\f_016820",
    r"C:\Users\yoges\AppData\Local\Google\Chrome\User Data\Default\Cache\Cache_Data\f_016807",
    r"C:\Users\yoges\AppData\Local\Google\Chrome\User Data\Default\Cache\Cache_Data\f_016440"
]

for fp in cache_files:
    if os.path.exists(fp):
        size = os.path.getsize(fp)
        print(f"\n--- File {fp} ({size} bytes) ---")
        try:
            with open(fp, 'rb') as f:
                data = f.read()
            
            # Print a preview of printable characters in the first 2000 bytes
            # Chrome cache files have an HTTP response header, search for the start of the JS code
            # Usually starts with 'import' or 'const' or '/\n'
            idx = data.find(b"import ")
            if idx == -1:
                idx = data.find(b"const ")
            if idx == -1:
                idx = 0
            
            preview = data[idx:idx+1500].decode('utf-8', errors='ignore')
            print("Preview:")
            print(preview)
            
            # Let's save a clean copy of the entire file to scratch/ for manual inspection
            basename = os.path.basename(fp)
            clean_fp = f"scratch/clean_{basename}.js"
            with open(clean_fp, 'w', encoding='utf-8') as out:
                out.write(data[idx:].decode('utf-8', errors='ignore'))
            print(f"Wrote clean preview to {clean_fp}")
        except Exception as e:
            print(f"Error: {e}")
