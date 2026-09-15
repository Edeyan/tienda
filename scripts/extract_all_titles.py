import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_titles_extracted = []

for page_idx in range(len(pages_raw)):
    page_text = pages_raw[page_idx].replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not page_text:
        continue
    
    # Let's inspect titles on this page
    # In each page, lines before the first code or between rows contain titles
    lines = [l.strip() for l in page_text.split('\n') if l.strip()]
    
    # Let's see: on each page, we know the codes
    codes = re.findall(r'\b(1[23]\d{3})\b', page_text)
    # print(f"Page {page_idx+1}: {len(codes)} codes")
