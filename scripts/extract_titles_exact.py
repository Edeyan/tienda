import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

pages_raw = re.split(r'Total de Artículos: 270\s*\n\s*Page \d+ of 31', raw)

all_titles = []

# List of known uppercase Spanish tool / hardware keywords:
# ALICATE, ARCO, BOLSA, BOMBA, BOTA, BROCHA, CEPILLO, CERRADURA, CHIPEADORA, CIERRA, SIERRA, CINCEL, CINTA, CIZALLA, CORTA, CORTADOR, CUCHARAS, CUCHILLO, DISCO, ENGRAPADORA, ESCUADRA, ESMERIL, ESPATULA, ESTANTE, GATO, GORRA, GUANTE, HACHA, JUEGO, KIT, LIJADORA, LLANA, LLAVE, MAQUINA, MARTILLO, MAZO, MOCHILA, NIVEL, PELACABLE, PESO, PINZA, PISTOLA, PORRA, PORTA, PROBADOR, PUNTAS, REPUESTO, RODILLO, ROTOMARTILLO, SOPLADORA, SWTERS, TALADRO, TIJERA, TRONZADORA, ZAPATO, etc.

for p_num, page_raw in enumerate(pages_raw):
    p = page_raw.replace('\x0c', '').replace('FERRETERIA', '').strip()
    if not p:
        continue
    
    codes = re.findall(r'\b(1[23]\d{3})\b', p)
    # Let's inspect titles on this page
    lines = [l.strip() for l in p.split('\n') if l.strip()]
    # print(f"Page {p_num+1} ({len(codes)} items)")
