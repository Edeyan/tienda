import re
import json

# Let's write a detailed parser
with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# Let's inspect all codes in order
# Find all 5-digit codes (12xxx, 13xxx)
code_positions = []
for match in re.finditer(r'\b(1[23]\d{3})\b', raw):
    code_positions.append((match.start(), match.end(), match.group(1)))

print(f"Total codes found: {len(code_positions)}")

# Let's see each code and the text preceding it and following it
items = []
for i in range(len(code_positions)):
    start_idx = 0 if i == 0 else code_positions[i-1][1]
    curr_start, curr_end, code = code_positions[i]
    next_start = len(raw) if i == len(code_positions)-1 else code_positions[i+1][0]
    
    # Text between previous code and current code (contains title or titles)
    pre_text = raw[start_idx:curr_start].strip()
    # Text between current code and next code (contains model, specs, price, inv)
    post_text = raw[curr_end:next_start].strip()
    
    items.append({
        'index': i,
        'code': code,
        'pre': pre_text,
        'post': post_text
    })

print(f"Parsed {len(items)} item contexts.")
