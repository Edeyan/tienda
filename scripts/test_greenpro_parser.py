import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Split by pages
pages = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)
print(f"Total page chunks: {len(pages)}")

# Let's inspect page by page
all_products = []
seen_codes = set()

for page_num, page_str in enumerate(pages):
    cleaned = page_str.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not cleaned:
        continue
    
    # Let's find all products on this page
    # In each page, products have:
    # Title(s)
    # Code (5 digits, e.g. 11940, 10003, etc.)
    # Model (GP-...) or (MP-...)
    # Empaque: ...
    # Pie/Cub: ...
    # Peso: ...
    # CBM: ...
    # Precio: $... Inv: ... PZA / ROL / SET
    
    # Let's find codes
    codes = re.findall(r'\b(1\d{4})\b', cleaned)
    models = re.findall(r'\b(GP-[A-Z0-9\-\/]+|MP-[A-Z0-9\-\/]+)\b', cleaned)
    
    # Prices and inventories
    # format: $24.21 Inv: 12 PZA Precio: or $0.07 Inv: 106100 PZA
    prices_inv = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*([\d,]+(?:\s*\n\s*\d+)?)\s*(?:PZA|ROL|SET|L)?', cleaned)
    
    # If standard regex finds counts matching codes
    print(f"Page {page_num + 1}: {len(codes)} codes, {len(models)} models, {len(prices_inv)} price/inv")

