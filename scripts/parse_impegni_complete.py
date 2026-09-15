import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# Clean raw text
pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_parsed_products = []

for page_idx, page_str in enumerate(pages_raw):
    p = page_str.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # Let's inspect codes
    codes = re.findall(r'\b(1[23]\d{3})\b', p)
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', p)
    models = [mod for mod in models_raw if mod not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    prices_inv = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', p)
    
    # Let's split page into 3 rows (or 2 on p1, 1 on p31)
    # Let's see:
    expected_items = len(codes)
    
    # Let's extract items
    # In each page, let's look at lines
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    
    # Let's match each code with its title, model, price, inv
    for i in range(expected_items):
        code = codes[i]
        model = models[i] if i < len(models) else ""
        price = float(prices_inv[i][0]) if i < len(prices_inv) else 0.0
        stock = int(prices_inv[i][1]) if i < len(prices_inv) else 0
        
        # Let's find title
        all_parsed_products.append({
            'code': code,
            'model': model,
            'price': price,
            'stock': stock,
            'page': page_idx + 1
        })

print(f"Total extracted: {len(all_parsed_products)}")
