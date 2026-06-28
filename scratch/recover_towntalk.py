import subprocess

blobs = [
    "4b49667bc4e5d037e0ffe07ed77230dda3333843",
    "29cec209aec6f8d13831de3e13f5e310356f3d7d"
]

for blob in blobs:
    print(f"\nChecking blob {blob}...")
    try:
        res = subprocess.run(["git", "show", blob], capture_output=True, text=True, encoding='utf-8')
        content = res.stdout
        print(f"Content length: {len(content)} characters")
        if "Townsfolk Calling" in content or "TownTalkModal" in content:
            print(f">>> FOUND IN BLOB {blob}! Writing to src/components/TownTalkModal.tsx")
            with open("src/components/TownTalkModal.tsx", "w", encoding="utf-8") as out:
                out.write(content)
            print("Successfully recovered!")
            break
    except Exception as e:
        print(f"Error checking blob {blob}: {e}")
