import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

parsed_products = []

# List of all 31 page products
for page_idx in range(len(pages_raw)):
    page_text = pages_raw[page_idx].replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not page_text:
        continue
    
    # Let's inspect the lines in this page
    lines = [l.strip() for l in page_text.split('\n') if l.strip()]
    
    # Let's see: on each page, we have a sequence of items
    # Let's find all codes
    codes = re.findall(r'\b(1[23]\d{3})\b', page_text)
    
    # Let's find all models
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', page_text)
    models = [m for m in models_raw if m not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    
    # Let's find all prices & invs
    prices_invs = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', page_text)
    
    # Let's print out if any count mismatch
    if len(codes) != len(models) or len(codes) != len(prices_invs):
        print(f"Mismatch on Page {page_idx+1}: codes={len(codes)}, models={len(models)}, prices_invs={len(prices_invs)}")

print("Validation completed.")
