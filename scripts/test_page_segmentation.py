import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    raw_content = f.read()

pages = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', raw_content)

# Let's inspect pages and test row segmentation
# On each page, how are titles organized?
# Let's write a script that breaks a page by '$' price markers or 'Inv:' markers or rows.
for p_idx in [0, 1, 2, 3, 25, 26, 27]:
    p = pages[p_idx].replace('\x0c', '').strip()
    if p.startswith('FERRETERIA'):
        p = p[len('FERRETERIA'):].strip()
    print(f"=== PAGE {p_idx+1} ===")
    print(p[:300])
    print("-" * 30)
