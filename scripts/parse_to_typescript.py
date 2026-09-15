import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_parsed = []

for page_num, page_raw in enumerate(pages_raw):
    p = page_raw.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # We want to extract each item
    # Let's inspect each line
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    
    # Let's see: On each page:
    # Codes:
    codes = re.findall(r'\b(1[23]\d{3})\b', p)
    # Models:
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', p)
    models = [mod for mod in models_raw if mod not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    # Prices & Inv:
    prices_inv = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', p)
    # CBMs:
    cbms = re.findall(r'CBM:\s*(\d+\.\d+)', p)
    # Pesos:
    pesos = re.findall(r'(\d+(?:\.\d+)?)\s*KG', p)
    # Pie/Cubs:
    pie_cubs = re.findall(r'Pie/Cub:\s*(\d+\.\d+)', p)
    
    # Let's store raw page data
