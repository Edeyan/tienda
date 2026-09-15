import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# Let's inspect all lines across the document
pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_items = []

for p_idx, page in enumerate(pages_raw):
    p = page.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # Let's see: on each page, we can find:
    # 1. Product titles (lines with product names ending with or containing IMPEGNI or specific tool names)
    # 2. Codes (5 digits)
    # 3. Models
    # 4. Prices
    # 5. Invs
    # 6. Empaques
    # 7. Pesos
    # 8. Pie/Cubs
    # 9. CBMs
    
    # Let's write a test that checks each page's items
