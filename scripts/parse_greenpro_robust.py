import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

pages_raw = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)

def clean_block(p):
    p = p.replace('\x0c', '').strip()
    if p.startswith('FERRETERIA'):
        p = p[len('FERRETERIA'):].strip()
    return p

total_parsed = 0
all_products = []

for page_idx, page_str in enumerate(pages_raw):
    p = clean_block(page_str)
    if not p:
        continue
    
    # Let's find codes
    # Codes are 5 digit numbers starting with 10xxx, 11xxx, 12xxx, 13xxx
    # Note: 106100 is 6 digits, but split across lines as 10610\n0 in some text, let's normalize
    p_norm = p
    
    # Models: GP- or MP- (sometimes with space like GP- GLPO2)
    models = re.findall(r'\b(?:GP|MP)-\s*[A-Za-z0-9\-\/]+', p_norm)
    models = [m.replace(" ", "") for m in models if not m.endswith('PZA')]
    
    # Empaques: 'Empaque:\s*([\d,]+)'
    empaques = re.findall(r'Empaque:\s*\n?\s*([\d,]+)', p_norm)
    
    # Pesos: 'Peso:\s*\n?\s*([\d\.]+\s*KG)' or '(\d+(?:\.\d+)?)\s*KG'
    pesos = re.findall(r'(\d+(?:\.\d+)?)\s*KG', p_norm)
    
    # Pie/Cub: 'Pie/Cub:\s*\n?\s*([\d\.]+)'
    pie_cubs = re.findall(r'Pie/Cub:\s*\n?\s*([\d\.]+)', p_norm)
    
    # CBM: 'CBM:\s*\n?\s*([\d\.]+)'
    cbms = re.findall(r'CBM:\s*\n?\s*([\d\.]+)', p_norm)
    
    # Prices and Inv: '\$(\d+(?:\.\d+)?)\s+Inv:\s*([\d,\s]+)\s*(?:PZA|ROL|SET|L)?'
    prices_raw = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*([\d,\s]+)\s*(?:PZA|ROL|SET|L)?', p_norm)
    
    # Codes:
    codes = re.findall(r'\b(1[0123]\d{3})\b', p_norm)
    
    # Let's check counts
    print(f"P{page_idx+1:02d}: models={len(models)}, codes={len(codes)}, prices={len(prices_raw)}, empaques={len(empaques)}, pesos={len(pesos)}, cbms={len(cbms)}")
    total_parsed += len(models)

print(f"Total models found: {total_parsed}")
