import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_items = []

# Model pattern: 2 uppercase letters + 5 digits/chars or similar (e.g. FB02006, UBG08125, DB01010, CA01519, OA01450, etc.)
MODEL_REGEX = r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b'

for p_num, page_raw in enumerate(pages_raw):
    p = page_raw.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # Let's inspect codes
    codes = re.findall(r'\b(1[23]\d{3})\b', p)
    
    # Let's inspect models
    models = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', p)
    # Filter out IMPEGNI or FERRETERIA or KG or PZA or CBM
    models = [m for m in models if m not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    
    # Prices: e.g. $1.79
    prices = re.findall(r'\$(\d+(?:\.\d+)?)', p)
    
    # Invs: e.g. Inv: 120 PZA
    invs = re.findall(r'Inv:\s*(\d+)', p)
    
    # Empaques: e.g. Empaque:\s*(\d+) or numbers following Empaque
    # Pesos: e.g. (\d+(?:\.\d+)?)\s*KG
    pesos = re.findall(r'(\d+(?:\.\d+)?)\s*KG', p)
    
    # CBMs: e.g. 0.046
    cbms = re.findall(r'CBM:\s*(\d+\.\d+)', p)
    
    # Pie/Cub: e.g. Pie/Cub:\s*(\d+\.\d+)
    pie_cubs = re.findall(r'Pie/Cub:\s*(\d+\.\d+)', p)
    
    print(f"Page {p_num+1}: codes={len(codes)}, models={len(models)}, prices={len(prices)}, invs={len(invs)}, pesos={len(pesos)}, cbms={len(cbms)}, pie_cubs={len(pie_cubs)}")
