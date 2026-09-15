import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# Let's inspect each page's text line by line
pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

parsed_products = []

def clean_val(s):
    return s.strip() if s else ""

# Let's write a parser that handles rows in each page
for page_num, page_raw in enumerate(pages_raw):
    p = page_raw.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # Let's see how lines are structured
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    
    # We can use regex to find all tokens in the page
    # Let's see: on each page, we have a set of product codes, models, empaque, peso, pie/cub, cbm, precio, inv
    pass
