import json, os
from collections import Counter

d = json.load(open("graphify-out/.graphify_detect.json", encoding="utf-8-sig"))
all_files = []
for cat in d["files"].values():
    all_files.extend(cat)

dirs = Counter()
for f in all_files:
    parent = os.path.dirname(f)
    if parent:
        parts = parent.replace("\\", "/").split("/")
        # Take from project-root level: TTL-Server/ or TTL-Website/
        idx = -1
        for i, p in enumerate(parts):
            if p in ("TTL-Server", "TTL-Website"):
                idx = i
                break
        if idx >= 0:
            sub = "/".join(parts[idx:min(idx+3, len(parts))])
            dirs[sub] += 1

print("Top subdirectories by file count:")
for d, c in dirs.most_common(15):
    print(f"  {d}/  ({c} files)")
