import fs from 'fs';

const parseFile = fs.readFileSync('./scripts/parse_impegni.js', 'utf8');
const match = parseFile.match(/const rawText = `([\s\S]*?)`;/);
const text = match[1];

// Print page 1 and page 2 raw
const pages = text.split(/Page \d+ of 31/);
console.log("=== PAGE 1 ===");
console.log(pages[0]);
console.log("=== PAGE 2 ===");
console.log(pages[1]);
