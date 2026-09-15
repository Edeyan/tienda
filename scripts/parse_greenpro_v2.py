import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

pages_raw = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)

# Let's inspect each page
parsed_products = []

for page_idx, page_str in enumerate(pages_raw):
    p = page_str.replace('\x0c', '').strip()
    if p.startswith('FERRETERIA'):
        p = p[len('FERRETERIA'):].strip()
    if not p:
        continue

    # Let's find models
    models_matches = list(re.finditer(r'\b(?:GP|MP)-\s*[A-Za-z0-9\-\/]+', p))
    models = []
    for m in models_matches:
        mod = m.group(0).replace(" ", "")
        if not mod.endswith('PZA'):
            models.append((mod, m.start()))
            
    # Prices and inv
    prices_matches = list(re.finditer(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*([\d,\s]+)\s*(?:PZA|ROL|SET|L|Par)?', p))
    
    # Pesos
    pesos_matches = list(re.finditer(r'(\d+(?:\.\d+)?)\s*KG', p))
    
    # CBM
    cbms_matches = list(re.finditer(r'CBM:\s*\n?\s*(\d+\.\d+)', p))
    
    # Pie/Cub
    piecubs_matches = list(re.finditer(r'Pie/Cub:\s*\n?\s*(\d+\.\d+)', p))
    
    # Empaque
    empaques_matches = list(re.finditer(r'Empaque:\s*\n?\s*([\d,]+)', p))
    
    # Codes: 5 digits
    codes_matches = list(re.finditer(r'\b(1[0123]\d{3})\b', p))
    # Filter codes that are actually part of Inv counts (e.g. 10610 in 106100)
    # We know how many models are on this page
    num_items = len(models)
    
    # Let's see: on this page, let's extract each of the num_items
    print(f"Page {page_idx+1}: {num_items} items")

