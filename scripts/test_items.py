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
    
    lines = [l.strip() for l in page_text.split('\n') if l.strip()]
    
    codes = re.findall(r'\b(1[23]\d{3})\b', page_text)
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', page_text)
    models = [m for m in models_raw if m not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    prices_invs = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', page_text)
    cbms = re.findall(r'CBM:\s*(\d+\.\d+)', page_text)
    pesos = re.findall(r'(\d+(?:\.\d+)?)\s*KG', page_text)
    pie_cubs = re.findall(r'Pie/Cub:\s*(\d+\.\d+)', page_text)
    
    # Let's inspect titles on this page
    # Titles are lines that do not contain numbers only, Empaque, Peso, Pie/Cub, CBM, Inv, Precio, or $
    # Let's print out lines and extracted items for this page
    print(f"\n--- Page {page_idx+1} ({len(codes)} items) ---")
    for i in range(len(codes)):
        print(f"  Item {i+1}: Code={codes[i]}, Model={models[i]}, Price=${prices_invs[i][0]}, Inv={prices_invs[i][1]}")
