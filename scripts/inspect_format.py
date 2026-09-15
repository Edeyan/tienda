import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Page\s+\d+\s+of\s+31', raw)

for i in range(min(5, len(pages_raw))):
    p = pages_raw[i].replace('Total de Artículos: 270', '').replace('\x0c', '').replace('FERRETERIA', '').strip()
    if p:
        print(f"\n================ PAGE {i+1} ================")
        print(p)
