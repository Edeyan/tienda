import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

pages = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)

def parse_full_catalog():
    items = []
    
    for page_idx, page_str in enumerate(pages):
        p = page_str.replace('\x0c', '').strip()
        if p.startswith('FERRETERIA'):
            p = p[len('FERRETERIA'):].strip()
        if not p:
            continue
            
        page_num = page_idx + 1
        
        # Extract models
        model_matches = list(re.finditer(r'\b((?:GP|MP)-\s*[A-Za-z0-9\-\/]+)\b', p))
        models = [m.group(1).replace(" ", "") for m in model_matches if not m.group(1).replace(" ", "").endswith('PZA')]
        
        # Extract prices and invs
        price_inv_matches = list(re.finditer(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*([\d,\s]+)\s*(?:PZA|ROL|SET|L|Par)?', p))
        prices_inv = []
        for m in price_inv_matches:
            price = float(m.group(1))
            inv_str = m.group(2)
            clean_inv = re.sub(r'[\s,]', '', inv_str)
            stock = int(clean_inv) if clean_inv.isdigit() else 0
            prices_inv.append((price, stock, inv_str.strip()))
            
        # Pesos
        peso_matches = list(re.finditer(r'(\d+(?:\.\d+)?)\s*KG', p))
        pesos = [m.group(1) + "KG" for m in peso_matches]
        
        # CBMs
        cbm_matches = list(re.finditer(r'CBM:\s*\n?\s*(\d+\.\d+)', p))
        cbms = [m.group(1) for m in cbm_matches]
        
        # Pie/Cub
        piecub_matches = list(re.finditer(r'Pie/Cub:\s*\n?\s*([\d\.]+)', p))
        piecubs = [m.group(1) for m in piecub_matches]
        
        # Empaques
        empaque_matches = list(re.finditer(r'Empaque:\s*\n?\s*([\d,]+)', p))
        empaques = [m.group(1) for m in empaque_matches]
        
        # Codes
        code_matches = list(re.finditer(r'\b(1[0123]\d{3})\b', p))
        raw_codes = [m.group(1) for m in code_matches]
        
        # Filter codes to match count of models
        if len(raw_codes) > len(models):
            filtered_codes = []
            for c in raw_codes:
                # check if it's subpart of a 6-digit inv e.g. 10610 in 106100
                is_sub = False
                for _, inv_val, _ in prices_inv:
                    if len(str(inv_val)) > 5 and c in str(inv_val):
                        is_sub = True
                if not is_sub or len(filtered_codes) < len(models):
                    filtered_codes.append(c)
            codes = filtered_codes[:len(models)]
        else:
            codes = raw_codes
            
        # Parse titles for each item
        # We can extract candidate title phrases from the lines
        lines = [l.strip() for l in p.split('\n') if l.strip()]
        
        # Clean lines
        title_candidates = []
        for l in lines:
            if l in {'FERRETERIA', 'Empaque:', 'Peso:', 'Precio:', 'Pie/Cub:', 'CBM:', 'Inv:', 'PZA', 'ROL', 'SET', 'L', 'Par'}:
                continue
            if re.match(r'^\d+$', l): continue
            if re.match(r'^\d+(\.\d+)?\s*KG$', l): continue
            if re.match(r'^\d+\.\d+$', l): continue
            if re.match(r'^\$\d+(\.\d+)?', l): continue
            if re.match(r'^(?:GP|MP)-\s*[A-Za-z0-9\-\/]+$', l): continue
            if 'Inv:' in l: continue
            if l in {'GREENPRO', 'GREEN', 'PRO'}: continue
            title_candidates.append(l)
            
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
            
            # Form clean name
            # If title_candidates has entries, assign appropriately
            name = ""
            if i < len(title_candidates):
                name = title_candidates[i]
                if not name.endswith("GREENPRO") and not name.endswith("GP"):
                    name += " GREENPRO"
            else:
                name = f"PRODUCTO GREENPRO {sku}"
                
            items.append({
                'code': code,
                'name': name,
                'price': price,
                'sku': sku,
                'empaque': empaque,
                'peso': peso,
                'pieCub': piecub,
                'cbm': cbm,
                'inv': inv_display,
                'stock': stock,
                'page': page_num
            })
            
    return items

items = parse_full_catalog()
print(f"Total items parsed: {len(items)}")

# Let's write them to src/data/greenproCatalog.ts
ts_lines = [
    "import { Product } from '../types';",
    "",
    "export const createGreenproItem = (",
    "  code: string,",
    "  name: string,",
    "  price: number,",
    "  sku: string,",
    "  empaque: string,",
    "  peso: string,",
    "  pieCub: string,",
    "  cbm: string,",
    "  inv: string,",
    "  stock: number,",
    "  customImg?: string",
    "): Product => ({",
    "  id: `greenpro_${code}`,",
    "  name,",
    "  price,",
    "  category: '4',",
    "  section: 'nuevo',",
    "  brand: 'GREENPRO',",
    "  sku,",
    "  specs: {",
    "    'CÓDIGO': code,",
    "    'MODELO': sku,",
    "    'EMPAQUE': empaque,",
    "    'PESO': peso,",
    "    'PIE/CUB': pieCub,",
    "    'CBM': cbm,",
    "    'INVENTARIO': inv",
    "  },",
    "  image: customImg || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',",
    "  favorite: false,",
    "  stock,",
    "  description: `${name}. Modelo: ${sku}, Código: ${code}. Empaque: ${empaque}, Peso: ${peso}, CBM: ${cbm}. Stock disponible: ${inv}.`",
    "});",
    "",
    "export const greenproProducts: Product[] = ["
]

for idx, item in enumerate(items):
    comma = "," if idx < len(items) - 1 else ""
    name_escaped = item['name'].replace("'", "\\'")
    ts_lines.append(
        f"  createGreenproItem('{item['code']}', '{name_escaped}', {item['price']}, '{item['sku']}', '{item['empaque']}', '{item['peso']}', '{item['pieCub']}', '{item['cbm']}', '{item['inv']}', {item['stock']}){comma}"
    )

ts_lines.append("];")
ts_lines.append("")

with open("src/data/greenproCatalog.ts", "w", encoding="utf-8") as f:
    f.write("\n".join(ts_lines))

print("Successfully written src/data/greenproCatalog.ts")
