import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

parsed_products = []

for page_idx, page_str in enumerate(pages_raw):
    p = page_str.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # Let's inspect the lines of this page
    lines = [line.strip() for line in p.split('\n') if line.strip()]
    
    # Let's see: How many items on this page?
    codes_on_page = re.findall(r'\b(1[23]\d{3})\b', p)
    num_items = len(codes_on_page)
    
    # Let's find all models on this page
    # In each page, rows are either 3 items or 2 items (page 1 has 2 rows of 3, page 31 has 1 row of 3)
    # Let's handle row by row
