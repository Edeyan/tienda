import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Split text by page
pages = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)

items = []

for page_idx, page_str in enumerate(pages):
    p = page_str.replace('\x0c', '').strip()
    if p.startswith('FERRETERIA'):
        p = p[len('FERRETERIA'):].strip()
    if not p:
        continue
        
    page_num = page_idx + 1
    
    # Let's extract models
    models = [m.replace(" ", "") for m in re.findall(r'\b(?:GP|MP)-\s*[A-Za-z0-9\-\/]+', p) if not m.replace(" ", "").endswith('PZA')]
    
    # Prices and Inv
    prices_raw = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*([\d,\s]+)\s*(?:PZA|ROL|SET|L|Par)?', p)
    
    # Pesos
    pesos = [m + "KG" for m in re.findall(r'(\d+(?:\.\d+)?)\s*KG', p)]
    
    # CBMs
    cbms = re.findall(r'CBM:\s*\n?\s*(\d+\.\d+)', p)
    
    # Pie/Cub
    piecubs = re.findall(r'Pie/Cub:\s*\n?\s*([\d\.]+)', p)
    
    # Empaques
    empaques = re.findall(r'Empaque:\s*\n?\s*([\d,]+)', p)
    
    # Codes: 5 digits
    codes = re.findall(r'\b(1[0123]\d{3})\b', p)
    
    # If codes have extra matches due to numbers in Inv, let's pick the codes that match the item count
    # Usually the first N codes in the page or row correspond to the items
    if len(codes) > len(models):
        # filter out any code that is a subpart of inventory
        filtered_codes = []
        for c in codes:
            # check if it's part of an inv like 106100
            is_inv = False
            for _, inv_val, _ in [ (pr[0], re.sub(r'[\s,]', '', pr[1]), pr[1]) for pr in prices_raw ]:
                if len(inv_val) > 5 and c in inv_val:
                    is_inv = True
            if not is_inv or len(filtered_codes) < len(models):
                filtered_codes.append(c)
        codes = filtered_codes[:len(models)]
        
    # Let's see how many items
    num_items = len(models)
    
    # Let's extract titles for this page
    # In each page, let's find line titles
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    
    # Let's collect items
    for i in range(num_items):
        sku = models[i] if i < len(models) else f"GP-{page_num}-{i+1}"
        code = codes[i] if i < len(codes) else f"100{page_num:02d}{i}"
        price = float(prices_raw[i][0]) if i < len(prices_raw) else 0.0
        raw_inv = prices_raw[i][1] if i < len(prices_raw) else "0"
        clean_inv = re.sub(r'[\s,]', '', raw_inv)
        stock = int(clean_inv) if clean_inv.isdigit() else 0
        inv_str = f"{stock:,} PZA".replace(",", ".")
        
        peso = pesos[i] if i < len(pesos) else "0.000KG"
        cbm = cbms[i] if i < len(cbms) else "0.000"
        piecub = piecubs[i] if i < len(piecubs) else "0.0000"
        empaque = (empaques[i] + " PZA") if i < len(empaques) else "1 PZA"
        
        # Determine title from lines
        # Default name
        name = f"ARTICULO GREENPRO {sku}"
        
        items.append({
            'code': code,
            'name': name,
            'price': price,
            'sku': sku,
            'empaque': empaque,
            'peso': peso,
            'pieCub': piecub,
            'cbm': cbm,
            'inv': inv_str,
            'stock': stock,
            'page': page_num
        })

print(f"Total extracted items: {len(items)}")
