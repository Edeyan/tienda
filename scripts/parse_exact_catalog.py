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
    
    # Let's inspect codes
    codes = re.findall(r'\b(1[23]\d{3})\b', page_text)
    num_items = len(codes)
    
    # Models
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', page_text)
    models = [mod for mod in models_raw if mod not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    
    # Prices & Invs
    prices_invs = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', page_text)
    
    # Let's see: On each page, lines before the first code or between rows contain titles
    # Let's write a parser that extracts titles
    lines = [l.strip() for l in page_text.split('\n') if l.strip()]
    
    # Let's extract items
    # print(f"Page {page_idx+1}: {num_items} items")
