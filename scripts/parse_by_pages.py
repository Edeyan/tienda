import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# Split into 31 pages
page_splits = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)
print(f"Total page splits: {len(page_splits)}")

for idx, p in enumerate(page_splits):
    p = p.replace('\x0c', '').replace('FERRETERIA', '').strip()
    codes = re.findall(r'\b(1[23]\d{3})\b', p)
    print(f"Page {idx+1}: {len(codes)} codes: {codes}")
