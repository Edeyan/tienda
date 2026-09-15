import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_items = []

for page_idx in range(len(pages_raw)):
    page_text = pages_raw[page_idx].replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not page_text:
        continue
    
    # We want to extract:
    # 1. Product title
    # 2. Code (5 digits)
    # 3. Model
    # 4. Empaque
    # 5. Peso
    # 6. Pie/Cub
    # 7. CBM
    # 8. Price
    # 9. Inventory
    
    # Let's inspect this page
    codes = re.findall(r'\b(1[23]\d{3})\b', page_text)
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', page_text)
    models = [m for m in models_raw if m not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    prices_invs = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', page_text)
    
    # Let's print this page's text lines
    lines = [l.strip() for l in page_text.split('\n') if l.strip()]
    # print(f"Page {page_idx+1} lines:", lines)
