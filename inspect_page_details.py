import re

with open('parse_raw.py', 'r', encoding='utf-8') as f:
    text = f.read()

pages = re.split(r'Total de Artículos:\s*\d+\s+Page\s+\d+\s+of\s+\d+\s*(?:FERRETERIA)?', text)

for i in [0, 1, 2, 3, 11, 20]:
    print(f'================= PAGE {i+1} =================')
    print(pages[i].strip()[:600])
