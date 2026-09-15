import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

pages = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)

# Let's inspect page by page how rows are split
def get_page_rows(page_text):
    lines = [l.strip() for l in page_text.replace('\x0c', '').split('\n') if l.strip()]
    if lines and lines[0] == 'FERRETERIA':
        lines = lines[1:]
    return lines

for p_idx in range(5):
    print(f"--- Page {p_idx+1} ---")
    lines = get_page_rows(pages[p_idx])
    # Let's print out lines
    for i, l in enumerate(lines):
        print(f"{i:02d}: {l}")
