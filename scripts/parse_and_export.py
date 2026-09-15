import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_parsed = []

# List of product names and specs across all 31 pages
# Let's write the complete parsing logic
for page_idx in range(len(pages_raw)):
    p = pages_raw[page_idx].replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # Lines
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    
    # Codes
    codes = re.findall(r'\b(1[23]\d{3})\b', p)
    # Models
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', p)
    models = [mod for mod in models_raw if mod not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    # Prices and Invs
    prices_invs = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', p)
    
    # CBMs
    cbms = re.findall(r'CBM:\s*(\d+\.\d+)', p)
    # Pesos
    pesos = re.findall(r'(\d+(?:\.\d+)?)\s*KG', p)
    # Pie/Cub
    pie_cubs = re.findall(r'Pie/Cub:\s*(\d+\.\d+)', p)
    
    # Empaques
    empaques = re.findall(r'Empaque:\s*(\d+)', p)
    
    # Let's extract titles for this page
    # Titles on each page can be identified by:
    # 1. Lines that are not numbers, not keywords like Empaque, Peso, Pie/Cub, CBM, Inv, Precio, $, etc.
    title_candidates = []
    for l in lines:
        if (not re.match(r'^(?:1[23]\d{3}|[A-Z]{2,3}\d{4,5}[A-Z0-9]*|\d+(?:\.\d+)?|Empaque:|Peso:|Pie/Cub:|CBM:|Precio:|\$\d+|Inv:)', l) and
            not l.startswith('$') and
            not l.endswith('KG') and
            not l.endswith('PZA') and
            not l in ['Empaque:', 'Peso:', 'Pie/Cub:', 'CBM:', 'Precio:']):
            title_candidates.append(l)
            
    # print(f"Page {page_idx+1}: {len(codes)} codes, {len(title_candidates)} title lines")

print("Done.")
