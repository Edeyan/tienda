import re

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

pages = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)

# Known keywords that are NOT titles
SYSTEM_KEYWORDS = {'FERRETERIA', 'Empaque:', 'Peso:', 'Precio:', 'Pie/Cub:', 'CBM:', 'Inv:', 'PZA', 'ROL', 'SET', 'L', 'Par'}

def extract_titles_page(page_idx, page_str):
    p = page_str.replace('\x0c', '').strip()
    if p.startswith('FERRETERIA'):
        p = p[len('FERRETERIA'):].strip()
    
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    
    # Filter out pure numbers, keywords, models, prices, weights
    candidate_titles = []
    current_title = []
    
    for l in lines:
        if l in SYSTEM_KEYWORDS:
            continue
        if re.match(r'^\d+$', l): # pure number (code or quantity)
            continue
        if re.match(r'^\d+(\.\d+)?\s*KG$', l): # weight
            continue
        if re.match(r'^\d+\.\d+$', l): # float (cbm or pie/cub)
            continue
        if re.match(r'^\$\d+(\.\d+)?', l): # price
            continue
        if re.match(r'^(?:GP|MP)-\s*[A-Za-z0-9\-\/]+$', l): # SKU
            continue
        if 'Inv:' in l:
            continue
        if l == 'GREENPRO' or l == 'GREEN' or l == 'PRO':
            continue
        
        # It's part of a product title!
        candidate_titles.append(l)
        
    return candidate_titles

for p_idx in range(6):
    titles = extract_titles_page(p_idx, pages[p_idx])
    print(f"Page {p_idx+1} titles ({len(titles)} lines): {titles[:8]}")
