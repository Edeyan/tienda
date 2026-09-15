import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# Let's inspect each of the 31 pages
# Clean raw text
clean_raw = raw.replace('\x0c', '').replace('Total de Artículos: 270', '')

# We know the pages are separated by "Page X of 31"
pages = re.split(r'Page\s+\d+\s+of\s+31', clean_raw)

products = []

for page_idx, page_str in enumerate(pages):
    p_text = page_str.replace('FERRETERIA', '').strip()
    if not p_text:
        continue
    
    # Let's see: on page 1 (6 items), page 31 (3 items), other pages (9 items)
    # Let's parse all items on this page
    # In each page, let's find all codes (12xxx, 13xxx)
    codes_in_page = re.findall(r'\b(1[23]\d{3})\b', p_text)
    
    # We want to extract each code, title, model, empaque, peso, pie_cub, cbm, precio, inv
    # Let's print out what we get
    # print(f"Page {page_idx+1}: {len(codes_in_page)} codes")
