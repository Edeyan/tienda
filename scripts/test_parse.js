import fs from 'fs';
import path from 'path';

// Let's read scripts/parse_impegni.js and parse out the items
// In each page or across pages, items have:
// Name
// Code (numeric like 12237 or 13072)
// Model/SKU (e.g. FB02006, UBG08125, etc.)
// Empaque: X
// Peso: X.XXX KG
// Pie/Cub: X.XXXX
// CBM: X.XXX
// Precio: $X.XX
// Inv: X PZA

// Let's run a test extraction script
