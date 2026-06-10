import json
d = json.load(open("graphify-out/.graphify_detect.json", encoding="utf-8-sig"))
f = d["files"]
print(f"Corpus: {d['total_files']} files, ~{d['total_words']:,} words")
if f["code"]:   print(f"  code:     {len(f['code'])} files")
if f["document"]: print(f"  docs:     {len(f['document'])} files")
if f["paper"]:  print(f"  papers:   {len(f['paper'])} files")
if f["image"]:  print(f"  images:   {len(f['image'])} files")
if f["video"]:  print(f"  video:    {len(f['video'])} files")
