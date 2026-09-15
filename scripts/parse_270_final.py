import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_products = []

for page_idx in range(len(pages_raw)):
    p = pages_raw[page_idx].replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # Let's inspect codes
    codes = re.findall(r'\b(1[23]\d{3})\b', p)
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', p)
    models = [mod for mod in models_raw if mod not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    prices_inv = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', p)
    if len(prices_inv) < len(codes):
        prices_only = re.findall(r'\$(\d+(?:\.\d+)?)', p)
        invs_only = re.findall(r'Inv:\s*(\d+)', p)
        prices_inv = list(zip(prices_only, invs_only))
    
    # We know how many items on this page
    n_items = len(codes)
    
    # Let's find titles:
    # Let's extract lines that form the titles for these items
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    
    # Let's store each product
    for i in range(n_items):
        code = codes[i]
        model = models[i] if i < len(models) else ""
        price = float(prices_inv[i][0]) if i < len(prices_inv) else 0.0
        stock = int(prices_inv[i][1]) if i < len(prices_inv) else 0
        
        all_products.append({
            'code': code,
            'model': model,
            'price': price,
            'stock': stock,
            'page': page_idx + 1
        })

print(f"Total products parsed: {len(all_products)}")
