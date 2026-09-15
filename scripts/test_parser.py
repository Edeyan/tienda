import re
import json

with open("scripts/raw_megapro_part1.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Split by pages
pages = re.split(r'Total de Artículos: \d+\s*\nPage \d+ of \d+', content)

print(f"Total pages extracted: {len(pages)}")

# Let's inspect page by page
for i, page in enumerate(pages):
    page_clean = page.strip()
    if not page_clean:
        continue
    print(f"--- PAGE {i+1} ---")
    print(page_clean[:300])
    print("...\n")
