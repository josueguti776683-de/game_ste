import fs from 'fs';

const words = fs.readFileSync('spanish_words.txt', 'utf-8').split('\n');
const broken = [];
for (let w of words) {
    // Check for words where 'a', 'e', 'i', 'o', 'u' might be missing
    // e.g. crtico, altmetro...
    if (w.match(/[^aeiou]tica$/)) broken.push(w);
    if (w.match(/[^aeiou]tico$/)) broken.push(w);
    if (w.match(/[^aeiou]metro$/)) broken.push(w);
    if (w.match(/[^aeiou]grafo$/)) broken.push(w);
    if (w.match(/cin$/)) broken.push(w);
    if (w.match(/guinada/)) broken.push(w);
}
console.log([...new Set(broken)].join(', '));
