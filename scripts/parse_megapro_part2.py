import re
import json

with open('scripts/raw_megapro_part2.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Normalize text lines
lines = [l.strip() for l in text.split('\n') if l.strip()]

# Remove footer / header lines
filtered_lines = []
for l in lines:
    if re.match(r'^Total de Art[ií]culos:\s*\d+', l, re.IGNORECASE):
        continue
    if re.match(r'^Page\s+\d+\s+of\s+\d+', l, re.IGNORECASE):
        continue
    if l == 'FERRETERIA':
        continue
    filtered_lines.append(l)

print(f"Total filtered lines: {len(filtered_lines)}")

# Let's inspect tokens and parse
# Let's write a parser that identifies item blocks
# In the raw text, items follow patterns like:
# Title (1 or more lines, or multi-line)
# Brand (MEGAPRO or similar, or sometimes part of title)
# Code (5 digits, or alphanumeric e.g. 12514, 11937, 10542)
# Model (MP-..., PFC..., MG-..., MO-...)
# Empaque: \d+
# Pie/Cub: \d+\.\d+
# Peso: \d+\.\d+KG
# CBM: \d+\.\d+
# Price: $\d+\.\d+ Inv: \d+ (PZA|KG|SETS|BAG|ROLL)

# Sometimes the lines in the raw text have interleaving or columns if copied across columns.
# Let's check how lines are laid out by inspecting segments of filtered_lines.

for idx, l in enumerate(filtered_lines[:100]):
    print(f"{idx}: {l}")
