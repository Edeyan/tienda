import re
import json

with open("scripts/raw_greenpro.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's parse each page into row blocks
pages = re.split(r'Total de Artículos: 296\s*\n\s*Page \d+ of 34', text)

# Let's check how the PDF text dump orders items
# In each page, usually there are 2 or 3 rows.
# Row layout in text:
# Title 1
# Title 2
# Title 3
# Code 1
# Empaque:
# Peso:
# Precio:
# Model 1
# EmpaqueVal 1
# Pie/Cub:
# PesoVal 1
# CBM:
# PieCubVal 1
# CbmVal 1
# Code 2
# ...

# Or let's see how each page is arranged. Let's write a script to inspect pages 1 to 5 in detail.
for p_idx in range(5):
    print(f"=== PAGE {p_idx+1} ===")
    lines = [l.strip() for l in pages[p_idx].split('\n') if l.strip()]
    for idx, l in enumerate(lines[:30]):
        print(f"{idx:02d}: {l}")
