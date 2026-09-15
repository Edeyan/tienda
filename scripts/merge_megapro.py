import json
import re

with open('scripts/part2_products.json', 'r', encoding='utf-8') as f:
    part2 = json.load(f)

print(f"Part 2 products count: {len(part2)}")

# Read existing megaproCatalog.ts
with open('src/data/megaproCatalog.ts', 'r', encoding='utf-8') as f:
    cat_ts = f.read()

# Let's extract existing IDs
existing_ids = re.findall(r'id:\s*"([^"]+)"', cat_ts)
print(f"Existing IDs count in megaproCatalog: {len(existing_ids)}")

existing_set = set(existing_ids)
duplicates = []
seen_p2 = set()

for p in part2:
    pid = p['id']
    if pid in seen_p2:
        print(f"Duplicate within part 2: {pid} ({p['name']})")
        # disambiguate with sku or suffix
        clean_sku = re.sub(r'[^a-zA-Z0-9]', '_', p['sku']).lower()
        p['id'] = f"{pid}_{clean_sku}"
    elif pid in existing_set:
        print(f"Collision with part 1: {pid} ({p['name']})")
        clean_sku = re.sub(r'[^a-zA-Z0-9]', '_', p['sku']).lower()
        p['id'] = f"{pid}_{clean_sku}"
    seen_p2.add(p['id'])

print("All disambiguated!")

# Format part2 as TypeScript code
ts_lines = []
for p in part2:
    ts_lines.append("  {")
    ts_lines.append(f'    id: "{p["id"]}",')
    ts_lines.append(f'    name: {json.dumps(p["name"], ensure_ascii=False)},')
    ts_lines.append(f'    price: {p["price"]},')
    ts_lines.append(f'    category: "{p["category"]}",')
    ts_lines.append(f'    section: "{p["section"]}",')
    ts_lines.append(f'    brand: "{p["brand"]}",')
    ts_lines.append(f'    sku: "{p["sku"]}",')
    ts_lines.append("    specs: {")
    for k, v in p["specs"].items():
        ts_lines.append(f'      "{k}": {json.dumps(v, ensure_ascii=False)},')
    # remove trailing comma in specs if desired or keep
    ts_lines.append("    },")
    ts_lines.append(f'    image: "{p["image"]}",')
    ts_lines.append(f'    favorite: false,')
    ts_lines.append(f'    stock: {p["stock"]},')
    ts_lines.append(f'    description: {json.dumps(p["description"], ensure_ascii=False)}')
    ts_lines.append("  },")

part2_ts_block = "\n".join(ts_lines)

# Write to a helper file or update megaproCatalog.ts directly
# Let's inspect the end of megaproCatalog.ts
with open('scripts/part2_code.ts', 'w', encoding='utf-8') as f:
    f.write(part2_ts_block)

print("Saved part2_code.ts successfully!")
