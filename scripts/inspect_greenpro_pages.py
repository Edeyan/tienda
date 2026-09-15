import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Split into pages by footer
pages = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)
print(f"Total page chunks: {len(pages)}")

def parse_page(page_idx, p_text):
    # Remove form feeds and FERRETERIA header
    p = p_text.replace('\x0c', '').strip()
    if p.startswith('FERRETERIA'):
        p = p[len('FERRETERIA'):].strip()
    if not p:
        return []
    
    # Let's inspect the page blocks
    # Often a page consists of rows. Each row has:
    # 1 to 3 Titles
    # 1 to 3 Codes
    # 1 to 3 Models
    # Empaque, Pie/Cub, Peso, CBM, Precio, Inv for each column
    return p

print("Page 1 preview:")
print(parse_page(0, pages[0]))
print("="*40)
print("Page 2 preview:")
print(parse_page(1, pages[1]))
