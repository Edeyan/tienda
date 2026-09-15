import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# Let's inspect each page
pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_extracted_products = []

for page_idx, page_str in enumerate(pages_raw):
    p = page_str.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    # Let's see: how many items on this page?
    expected_count = 6 if page_idx == 0 else (3 if page_idx == 30 else 9)
    
    # Let's find codes
    codes = re.findall(r'\b(1[23]\d{3})\b', p)
    
    # Let's find prices and invs:
    # Pattern: \$(X.XX)\s+Inv:\s*(\d+)\s*(PZA|SET)?
    # Or just \$(\d+\.\d+) and Inv:\s*(\d+)
    price_matches = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)', p)
    if len(price_matches) < expected_count:
        # Check prices and invs separately
        prices_only = re.findall(r'\$(\d+(?:\.\d+)?)', p)
        invs_only = re.findall(r'Inv:\s*(\d+)', p)
        price_matches = list(zip(prices_only, invs_only))
    
    # Models:
    # Models are like FB02006, UBG08125, etc.
    # Let's check
    # print(f"Page {page_idx+1}: codes={len(codes)}, price_matches={len(price_matches)}")

print("Test complete.")
