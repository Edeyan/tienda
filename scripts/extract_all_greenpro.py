import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    raw_content = f.read()

# Pages are split by:
pages = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', raw_content)

def parse_all_pages():
    all_products = []
    
    for page_idx, page_str in enumerate(pages):
        p = page_str.replace('\x0c', '').strip()
        if p.startswith('FERRETERIA'):
            p = p[len('FERRETERIA'):].strip()
        if not p:
            continue
            
        page_num = page_idx + 1
        
        # We need to extract items for this page
        # Let's inspect the page content
        # In each page, let's look for product blocks
        # First, find all prices and invs on this page
        price_inv_matches = list(re.finditer(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*([\d,\s]+)\s*(?:PZA|ROL|SET|L|Par)?', p))
        
        # Models
        model_matches = list(re.finditer(r'\b((?:GP|MP)-\s*[A-Za-z0-9\-\/]+)\b', p))
        models = [m.group(1).replace(" ", "") for m in model_matches if not m.group(1).replace(" ", "").endswith('PZA')]
        
        # Pesos
        peso_matches = list(re.finditer(r'(\d+(?:\.\d+)?)\s*KG', p))
        pesos = [m.group(1) + "KG" for m in peso_matches]
        
        # CBMs
        cbm_matches = list(re.finditer(r'CBM:\s*\n?\s*(\d+\.\d+)', p))
        cbms = [m.group(1) for m in cbm_matches]
        
        # Pie/Cub
        piecub_matches = list(re.finditer(r'Pie/Cub:\s*\n?\s*(\d+\.\d+)', p))
        piecubs = [m.group(1) for m in piecub_matches]
        
        # Empaque
        empaque_matches = list(re.finditer(r'Empaque:\s*\n?\s*([\d,]+)', p))
        empaques = [m.group(1) for m in empaque_matches]
        
        # Let's see: on this page, how many items?
        count = len(models)
        
        # Let's find codes
        # In each page, codes are 5-digit numbers that appear before/near models
        code_matches = list(re.finditer(r'\b(1[0123]\d{3})\b', p))
        # Filter codes
        raw_codes = [m.group(1) for m in code_matches]
        
        # Let's verify counts
        all_products.append({
            'page': page_num,
            'count': count,
            'models': models,
            'raw_codes': raw_codes,
            'prices_inv': [(float(m.group(1)), int(re.sub(r'[\s,]', '', m.group(2)) or 0), m.group(0)) for m in price_inv_matches],
            'pesos': pesos,
            'cbms': cbms,
            'piecubs': piecubs,
            'empaques': empaques,
            'raw_text': p
        })

    return all_products

pages_data = parse_all_pages()
total_items = sum(p['count'] for p in pages_data)
print(f"Parsed {len(pages_data)} pages, total items = {total_items}")
