with open('src/data/megaproCatalog.ts', 'r', encoding='utf-8') as f:
    existing = f.read()

with open('scripts/part2_code.ts', 'r', encoding='utf-8') as f:
    part2_code = f.read()

# Find the last '];'
last_bracket_idx = existing.rfind('];')
if last_bracket_idx == -1:
    raise Exception("Could not find closing bracket in megaproCatalog.ts")

new_content = existing[:last_bracket_idx] + part2_code + "\n];\n"

with open('src/data/megaproCatalog.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated megaproCatalog.ts successfully!")
