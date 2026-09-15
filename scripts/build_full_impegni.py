import re
import json

with open('./scripts/parse_impegni.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'const rawText = `([\s\S]*?)`;', content)
raw = m.group(1)

# In the PDF:
# Every item has:
# 1. Code: 5-digit number (12xxx or 13xxx)
# 2. Model: alphanumeric code e.g. FB02006, UBG08125, JA01040, DB01010, NA02120, CG01025, EA01001, CA04101, CC01100, FA01018, IE02042, IG01002, DC01008, IC01001, OD02700, OA01140, OC03450, HD01001, DH01010, IL01195, ZB01001, KB01010, ZA02001, JB05260, EJ01600, GA03832, GB03632, OG05032, AZ01001, UBK21320, DD01002, GD03001, FM01012, FM02012, UBH01200, BH01250, EB01050, EC01100, QC04213, CB01100, CH02016, FL04001, CF01020, FC02006, FF01007, KE01900, KA01016, KD01600, UBL03850, AH01001, MB04015, EE01002, FI01800, CF01314, OG01622, IC03118, DA01004, UBC01800, AD01001, UBD06254, UBE01420, AF01001, ZA01180, AA01001, ID01008, IH02010, UBD02355, JC01040, JC01041, etc.
# 3. Empaque: integer
# 4. Peso: float + KG
# 5. Pie/Cub: float
# 6. CBM: float
# 7. Precio: float ($X.XX)
# 8. Inv: integer (X PZA or X SET)

# Let's write a script that processes each page into its exact products.
