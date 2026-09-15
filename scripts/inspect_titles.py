import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

# Let's inspect page by page titles and fields
parsed_items = []

for p_num, page_raw in enumerate(pages_raw):
    p = page_raw.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # We know how many items on this page: 6 on page 1, 3 on page 31, 9 on others
    num_items = 6 if p_num == 0 else (3 if p_num == 30 else 9)
    
    # Let's extract items row by row (3 items per row)
    # Let's print out the raw text for this page to build a row-by-row parser
