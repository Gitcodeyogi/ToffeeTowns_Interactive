import os

roaming = os.path.expandvars(r"%APPDATA%")
local = os.path.expandvars(r"%USERPROFILE%\AppData\Local")

print(f"Roaming subdirs:")
try:
    for item in os.listdir(roaming):
        if os.path.isdir(os.path.join(roaming, item)):
            print(f"  {item}")
except Exception as e:
    print(e)

print(f"\nLocal subdirs:")
try:
    for item in os.listdir(local):
        if os.path.isdir(os.path.join(local, item)):
            print(f"  {item}")
except Exception as e:
    print(e)
