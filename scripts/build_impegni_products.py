import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# Let's inspect each page and parse products
pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_items = []

for p_num, page_raw in enumerate(pages_raw):
    p = page_raw.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # Let's find all codes
    codes = re.findall(r'\b(1[23]\d{3})\b', p)
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', p)
    models = [mod for mod in models_raw if mod not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    prices_inv = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', p)
    
    # If prices_inv is smaller, find separately
    if len(prices_inv) < len(codes):
        prices_only = re.findall(r'\$(\d+(?:\.\d+)?)', p)
        invs_only = re.findall(r'Inv:\s*(\d+)', p)
        prices_inv = list(zip(prices_only, invs_only))
        
    cbms = re.findall(r'CBM:\s*(\d+\.\d+)', p)
    pesos = re.findall(r'(\d+(?:\.\d+)?)\s*KG', p)
    pie_cubs = re.findall(r'Pie/Cub:\s*(\d+\.\d+)', p)
    empaques = re.findall(r'Empaque:\s*(\d+)', p)
    if len(empaques) < len(codes):
        # find standalone numbers
        pass

print("Test complete.")
