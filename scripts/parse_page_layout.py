import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# Let's inspect each of the 31 pages
pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_products = []

for page_idx in range(len(pages_raw)):
    page_text = pages_raw[page_idx].replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not page_text:
        continue
    
    # Let's split into lines
    raw_lines = [l.strip() for l in page_text.split('\n') if l.strip()]
    
    # We know the codes on this page
    codes = re.findall(r'\b(1[23]\d{3})\b', page_text)
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', page_text)
    models = [m for m in models_raw if m not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    prices_invs = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', page_text)
    cbms = re.findall(r'CBM:\s*(\d+\.\d+)', page_text)
    pesos = re.findall(r'(\d+(?:\.\d+)?)\s*KG', page_text)
    pie_cubs = re.findall(r'Pie/Cub:\s*(\d+\.\d+)', page_text)
    
    # Let's see: On each page, we have either:
    # 6 items (Page 1) -> 2 rows of 3 items
    # 9 items (Pages 2-30) -> 3 rows of 3 items
    # 3 items (Page 31) -> 1 row of 3 items
    
    # Let's inspect page 1, page 2, page 3 to see how titles are grouped
    print(f"\n================ PAGE {page_idx+1} ================")
    print(f"Codes ({len(codes)}): {codes}")
    print(f"Models ({len(models)}): {models}")
