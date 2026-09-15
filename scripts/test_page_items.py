import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

pages_raw = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)

# Let's inspect each page's text structure
def extract_page_items(page_idx, page_str):
    p = page_str.replace('\x0c', '').strip()
    if p.startswith('FERRETERIA'):
        p = p[len('FERRETERIA'):].strip()
    if not p:
        return []

    lines = [l.strip() for l in p.split('\n') if l.strip()]
    
    # Models in this page
    models = re.findall(r'\b(?:GP|MP)-\s*[A-Za-z0-9\-\/]+', p)
    models = [m.replace(" ", "") for m in models if not m.endswith('PZA')]
    
    # Prices and inv
    prices_raw = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*([\d,\s]+)\s*(?:PZA|ROL|SET|L)?', p)
    
    # Codes (5 digits starting with 1)
    codes_all = re.findall(r'\b(1[0123]\d{3})\b', p)
    
    # Let's check matching
    # Empaque
    empaques = re.findall(r'Empaque:\s*\n?\s*([\d,]+)', p)
    # Pesos
    pesos = re.findall(r'(\d+(?:\.\d+)?)\s*KG', p)
    # Pie/Cub
    pie_cubs = re.findall(r'Pie/Cub:\s*\n?\s*([\d\.]+)', p)
    # CBM
    cbms = re.findall(r'CBM:\s*\n?\s*([\d\.]+)', p)
    
    return {
        'page': page_idx + 1,
        'models': models,
        'codes': codes_all,
        'prices': prices_raw,
        'pesos': pesos,
        'pie_cubs': pie_cubs,
        'cbms': cbms,
        'empaques': empaques,
        'lines': lines
    }

for i in range(len(pages_raw)):
    res = extract_page_items(i, pages_raw[i])
    if res and len(res['models']) > 0:
        print(f"P{res['page']:02d}: models={len(res['models'])}, codes={len(res['codes'])}, prices={len(res['prices'])}, pesos={len(res['pesos'])}, cbm={len(res['cbms'])}")
