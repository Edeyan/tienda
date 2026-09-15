import re
import json

# Let's write a script that processes each page block by block.
# We'll print details of parsed products for each page to verify none is missed or misaligned.

with open('scripts/raw_megapro_part2.txt', 'r', encoding='utf-8') as f:
    raw = f.read()

# Split by pages
pages_raw = re.split(r'Total de Artículos: \d+\s*\nPage\s+(\d+)\s+of\s+82', raw)

parsed_products = []

def clean_val(val):
    if not val:
        return ""
    return str(val).strip()

print("Found total page segments:", len(pages_raw))
