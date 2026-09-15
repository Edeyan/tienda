import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# Split by page marker "Page X of 31"
pages_raw = re.split(r'Page\s+\d+\s+of\s+31', raw)
print(f"Number of page sections: {len(pages_raw)}")

all_products = []

for page_idx, page_text in enumerate(pages_raw):
    page_text = page_text.replace('Total de Artículos: 270', '').replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not page_text:
        continue
    
    # Let's find all codes in this page
    # Each product has a 5-digit code: 12xxx or 13xxx
    # Let's inspect this page
    # print(f"--- Page {page_idx+1} ---")
