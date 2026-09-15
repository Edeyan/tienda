import re
import json

with open('scripts/raw_megapro_part2.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

pages_raw = re.split(r'Total de Artículos: \d+\s*\nPage\s+(\d+)\s+of\s+82', raw)

pages_dict = {}
for idx in range(0, len(pages_raw)-1, 2):
    p_content = pages_raw[idx].strip()
    p_num = int(pages_raw[idx+1])
    pages_dict[p_num] = p_content

print("Pages parsed:", sorted(pages_dict.keys()))

# Let's inspect each page's content line by line
for p_num in sorted(pages_dict.keys()):
    print(f"\n================ PAGE {p_num} ================")
    print(pages_dict[p_num])
