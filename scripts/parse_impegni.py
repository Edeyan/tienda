import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract rawText
m = re.search(r'const rawText = `([\s\S]*?)`;', content)
if not m:
    print("No rawText found")
    exit(1)

raw = m.group(1)

# Let's see all codes (5 digit numbers 12xxx or 13xxx or similar)
codes = re.findall(r'\b(1[23]\d{3})\b', raw)
print(f"Total product codes found: {len(codes)}")
print(f"Unique product codes found: {len(set(codes))}")

# Let's find prices
prices = re.findall(r'\$(\d+(?:\.\d+)?)\s+Inv:\s*(\d+)\s*(?:PZA|SET)?', raw)
print(f"Total prices found: {len(prices)}")
