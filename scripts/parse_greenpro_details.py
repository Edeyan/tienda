import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

pages_raw = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)

all_items = []

for page_idx, page_str in enumerate(pages_raw):
    p = page_str.replace('\x0c', '').strip()
    if p.startswith('FERRETERIA'):
        p = p[len('FERRETERIA'):].strip()
    if not p:
        continue
    
    # Let's extract items from page
    # Find all codes (5 digit codes)
    # Be careful not to match 5 digit inventory numbers or weights if any, so let's use regex
    # Codes in this catalog start with 10xxx, 11xxx, 12xxx, 13xxx
    codes = re.findall(r'\b(1[0123]\d{3})\b', p)
    
    # Models start with GP- or MP-
    models = re.findall(r'\b((?:GP|MP)-[A-Za-z0-9\-\/]+)\b', p)
    
    # Clean models to remove any that are not actual SKUs
    valid_models = [m for m in models if not m.endswith('PZA')]
    
    # Prices and inventories: $xx.xx Inv: xx PZA/ROL/SET/L
    # Sometimes Inv is on the next line or has comma e.g. 10610\n0 or 1,500
    prices_raw = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*([\d,\s]+)\s*(?:PZA|ROL|SET|L)?', p)
    
    # Let's clean prices and stock
    clean_prices_inv = []
    for price_str, inv_str in prices_raw:
        price = float(price_str)
        # remove whitespace and commas
        clean_inv = re.sub(r'[\s,]', '', inv_str)
        stock = int(clean_inv) if clean_inv.isdigit() else 0
        clean_prices_inv.append((price, stock, inv_str.strip()))
        
    pesos = re.findall(r'(\d+(?:\.\d+)?)\s*KG', p)
    cbms = re.findall(r'CBM:\s*(\d+\.\d+)', p)
    pie_cubs = re.findall(r'Pie/Cub:\s*(\d+\.\d+)', p)
    empaques = re.findall(r'Empaque:\s*([\d,]+)', p)
    
    # Let's see how many items on this page
    count = len(valid_models)
    
    print(f"Page {page_idx + 1}: {len(codes)} codes, {count} models, {len(clean_prices_inv)} prices, {len(pesos)} pesos, {len(cbms)} cbms, {len(empaques)} empaques")

