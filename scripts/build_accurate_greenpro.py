import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

pages = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)

def clean_page(p_str):
    p = p_str.replace('\x0c', '').strip()
    if p.startswith('FERRETERIA'):
        p = p[len('FERRETERIA'):].strip()
    return p

all_products = []

for page_idx, page_str in enumerate(pages):
    p = clean_page(page_str)
    if not p:
        continue
    page_num = page_idx + 1

    # Extract all models
    models = [m.replace(" ", "") for m in re.findall(r'\b(?:GP|MP)-\s*[A-Za-z0-9\-\/]+', p) if not m.replace(" ", "").endswith('PZA')]
    
    # Prices and Invs
    prices_matches = list(re.finditer(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*([\d,\s]+)\s*(?:PZA|ROL|SET|L|Par)?', p))
    prices_inv = []
    for m in prices_matches:
        price = float(m.group(1))
        inv_str = m.group(2)
        clean_inv = re.sub(r'[\s,]', '', inv_str)
        stock = int(clean_inv) if clean_inv.isdigit() else 0
        prices_inv.append((price, stock, inv_str.strip()))
        
    # Pesos
    pesos = [m + "KG" for m in re.findall(r'(\d+(?:\.\d+)?)\s*KG', p)]
    
    # CBMs
    cbms = re.findall(r'CBM:\s*\n?\s*(\d+\.\d+)', p)
    
    # Pie/Cub
    piecubs = re.findall(r'Pie/Cub:\s*\n?\s*([\d\.]+)', p)
    
    # Empaques
    empaques = re.findall(r'Empaque:\s*\n?\s*([\d,]+)', p)
    
    # Codes: 5 digits starting with 10xxx, 11xxx, 12xxx, 13xxx
    codes_all = re.findall(r'\b(1[0123]\d{3})\b', p)
    
    # Filter codes to match count of models
    if len(codes_all) > len(models):
        filtered_codes = []
        for c in codes_all:
            # check if it's subpart of a 6-digit inv e.g. 10610 in 106100
            is_sub = False
            for _, inv_val, _ in prices_inv:
                if len(str(inv_val)) > 5 and c in str(inv_val):
                    is_sub = True
            if not is_sub or len(filtered_codes) < len(models):
                filtered_codes.append(c)
        codes = filtered_codes[:len(models)]
    else:
        codes = codes_all
        
    num_items = len(models)
    
    for i in range(num_items):
        sku = models[i] if i < len(models) else f"GP-{page_num}-{i+1}"
        code = codes[i] if i < len(codes) else f"100{page_num:02d}{i}"
        price = prices_inv[i][0] if i < len(prices_inv) else 0.0
        stock = prices_inv[i][1] if i < len(prices_inv) else 0
        inv_display = f"{stock:,} PZA".replace(",", ".")
        
        peso = pesos[i] if i < len(pesos) else "0.000KG"
        cbm = cbms[i] if i < len(cbms) else "0.000"
        piecub = piecubs[i] if i < len(piecubs) else "0.0000"
        empaque = (empaques[i] + " PZA") if i < len(empaques) else "1 PZA"
        
        all_products.append({
            'code': code,
            'sku': sku,
            'price': price,
            'stock': stock,
            'inv': inv_display,
            'peso': peso,
            'cbm': cbm,
            'pieCub': piecub,
            'empaque': empaque,
            'page': page_num
        })

print(f"Total structured items: {len(all_products)}")
