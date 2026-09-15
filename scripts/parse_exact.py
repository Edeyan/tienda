import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_parsed_items = []

for page_idx in range(len(pages_raw)):
    page_text = pages_raw[page_idx].replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not page_text:
        continue
    
    # Let's inspect this page
    # Find codes in this page
    codes = re.findall(r'\b(1[23]\d{3})\b', page_text)
    expected_n = len(codes)
    
    # Let's find prices and invs
    prices_invs = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', page_text)
    
    # Models
    models_raw = re.findall(r'\b([A-Z]{2,3}\d{4,5}[A-Z0-9]*)\b', page_text)
    models = [mod for mod in models_raw if mod not in ['IMPEGNI', 'FERRETERIA', 'KG', 'PZA', 'CBM', 'SET', 'USD', 'INV']]
    
    # CBMs
    cbms = re.findall(r'CBM:\s*(\d+\.\d+)', page_text)
    
    # Pesos
    pesos = re.findall(r'(\d+(?:\.\d+)?)\s*KG', page_text)
    
    # Pie/Cub
    pie_cubs = re.findall(r'Pie/Cub:\s*(\d+\.\d+)', page_text)
    
    # Empaques
    # Numbers associated with Empaque
    empaques = re.findall(r'Empaque:\s*(\d+)', page_text)
    if len(empaques) < expected_n:
        # Some numbers appear after Empaque:\n or next lines
        empaques_alt = re.findall(r'Empaque:\s*\n?\s*(\d+)', page_text)
        if len(empaques_alt) >= expected_n:
            empaques = empaques_alt
            
    # print(f"Page {page_idx+1}: codes={len(codes)}, models={len(models)}, prices={len(prices_invs)}, cbms={len(cbms)}, pesos={len(pesos)}, pie_cubs={len(pie_cubs)}, empaques={len(empaques)}")

print("Done inspecting counts.")
