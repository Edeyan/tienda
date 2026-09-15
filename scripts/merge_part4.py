import json
import re

with open('scripts/part4_products.json', 'r', encoding='utf-8') as f:
    new_products = json.load(f)

print(f"Loaded {len(new_products)} products from scripts/part4_products.json")

with open('src/data/megaproCatalog.ts', 'r', encoding='utf-8') as f:
    existing_content = f.read()

# Extract existing codes/IDs
existing_ids = set(re.findall(r'id:\s*["\']([^"\']+)["\']', existing_content))
existing_codes = set(re.findall(r'["\']CÓDIGO["\']:\s*["\']([^"\']+)["\']', existing_content, re.IGNORECASE))
existing_codes.update(re.findall(r'["\']Código["\']:\s*["\']([^"\']+)["\']', existing_content, re.IGNORECASE))
print(f"Existing IDs: {len(existing_ids)}, Existing Codes: {len(existing_codes)}")

unique_new_products = []
skipped = 0
for p in new_products:
    code = p['specs'].get('Código') or p['specs'].get('CÓDIGO') or p['id'].replace('mp_', '').replace('megapro_', '')
    p_id = f"megapro_{code}"
    p['id'] = p_id

    if p_id in existing_ids:
        print(f"Skipping already existing ID: {p_id} ({p['name']})")
        skipped += 1
    else:
        unique_new_products.append(p)
        existing_ids.add(p_id)

print(f"Unique new products to add: {len(unique_new_products)} (skipped {skipped})")

ts_entries = []
for p in unique_new_products:
    specs_formatted = ",\n".join([f'      "{k}": {json.dumps(v, ensure_ascii=False)}' for k, v in p['specs'].items()])
    entry = f"""  {{
    id: {json.dumps(p['id'], ensure_ascii=False)},
    name: {json.dumps(p['name'], ensure_ascii=False)},
    price: {p['price']},
    category: {json.dumps(p['category'], ensure_ascii=False)},
    section: {json.dumps(p['section'], ensure_ascii=False)},
    brand: {json.dumps(p['brand'], ensure_ascii=False)},
    sku: {json.dumps(p['sku'], ensure_ascii=False)},
    specs: {{
{specs_formatted}
    }},
    image: {json.dumps(p['image'], ensure_ascii=False)},
    favorite: false,
    stock: {p['stock']},
    description: {json.dumps(p['description'], ensure_ascii=False)}
  }}"""
    ts_entries.append(entry)

new_ts_content = ",\n".join(ts_entries)

last_bracket_idx = existing_content.rfind('];')
if last_bracket_idx == -1:
    raise Exception("Could not find closing bracket in megaproCatalog.ts")

prefix = existing_content[:last_bracket_idx].rstrip()
if prefix.endswith('['):
    updated_content = prefix + "\n" + new_ts_content + "\n];\n"
else:
    if not prefix.endswith(','):
        prefix += ','
    updated_content = prefix + "\n" + new_ts_content + "\n];\n"

with open('src/data/megaproCatalog.ts', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print(f"Successfully appended {len(unique_new_products)} products to src/data/megaproCatalog.ts!")
