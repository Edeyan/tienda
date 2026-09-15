import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# Clean raw text
pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_items = []

for page_idx, page_str in enumerate(pages_raw):
    p = page_str.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # Codes
    codes = re.findall(r'\b(1[23]\d{3})\b', p)
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', p)
    models = [mod for mod in models_raw if mod not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    prices_inv = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', p)
    if len(prices_inv) < len(codes):
        prices_only = re.findall(r'\$(\d+(?:\.\d+)?)', p)
        invs_only = re.findall(r'Inv:\s*(\d+)', p)
        prices_inv = list(zip(prices_only, invs_only))
        
    pesos = re.findall(r'(\d+(?:\.\d+)?)\s*KG', p)
    cbms = re.findall(r'CBM:\s*(\d+\.\d+)', p)
    pie_cubs = re.findall(r'Pie/Cub:\s*(\d+\.\d+)', p)
    empaques = re.findall(r'Empaque:\s*(\d+)', p)
    
    for i in range(len(codes)):
        code = codes[i]
        model = models[i] if i < len(models) else ""
        price = float(prices_inv[i][0]) if i < len(prices_inv) else 0.0
        stock = int(prices_inv[i][1]) if i < len(prices_inv) else 0
        peso = (pesos[i] + " KG") if i < len(pesos) else ""
        cbm = cbms[i] if i < len(cbms) else ""
        pie_cub = pie_cubs[i] if i < len(pie_cubs) else ""
        empaque = empaques[i] if i < len(empaques) else ""
        
        all_items.append({
            'code': code,
            'model': model,
            'price': price,
            'stock': stock,
            'peso': peso,
            'cbm': cbm,
            'pie_cub': pie_cub,
            'empaque': empaque,
            'page': page_idx + 1
        })

print(f"Total structured items: {len(all_items)}")
