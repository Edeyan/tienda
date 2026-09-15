import fs from 'fs';

// Read rawText from parse_impegni.js
const parseFile = fs.readFileSync('./scripts/parse_impegni.js', 'utf8');
const match = parseFile.match(/const rawText = `([\s\S]*?)`;/);
if (!match) {
  console.log("Could not find rawText");
  process.exit(1);
}
const text = match[1];

// Split by page
const pages = text.split(/Page \d+ of 31/);
console.log(`Found ${pages.length - 1} pages.`);

pages.forEach((page, idx) => {
  if (idx < pages.length - 1) {
    console.log(`--- Page ${idx + 1} ---`);
    console.log(page.trim().slice(0, 300) + '...\n');
  }
});
