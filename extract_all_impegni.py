import re, json

with open('parse_raw.py', 'r', encoding='utf-8') as f:
    full_text = f.read()

# Remove the wrapper
full_text = full_text.replace('raw_text = """', '').replace('"""', '').strip()

# Let's split by pages or process section by section
# Notice: Each page in PDF has up to 9 products (3 rows of 3 columns, or 3 rows of 2 columns, or 6 items, etc.)
# Let's write a parser that tokenizes and parses each page.

def clean_pages(text):
    pages = re.split(r'Total de Artículos:\s*\d+\s+Page\s+\d+\s+of\s+\d+\s*(?:FERRETERIA)?', text)
    return [p.strip() for p in pages if p.strip()]

pages = clean_pages(full_text)
print(f'Cleaned {len(pages)} pages.')
