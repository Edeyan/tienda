import re

with open('scripts/raw_megapro_part2.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's split by Page X of 82
pages_raw = re.split(r'Total de Artículos: \d+\s*\nPage\s+(\d+)\s+of\s+82', text)
print(f"Total raw splits: {len(pages_raw)}")

for idx in range(0, len(pages_raw)-1, 2):
    page_content = pages_raw[idx]
    page_num = pages_raw[idx+1]
    print(f"=== PAGE {page_num} ===")
    print(page_content.strip()[:200] + "...")
