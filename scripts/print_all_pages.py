import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

for page_idx in range(len(pages_raw)):
    p = pages_raw[page_idx].replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    print(f"=== PAGE {page_idx+1} ===")
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    for li, line in enumerate(lines):
        print(f"{li:02d}: {line}")
    print()
