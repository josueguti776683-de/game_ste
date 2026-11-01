import fs from 'fs';

let words = fs.readFileSync('all_words.txt', 'utf-8').split('\n');

const broken = [];
for (let w of words) {
    if (w.match(/ion$/) && w !== 'avion') broken.push(w);
    if (w.match(/tica$/)) broken.push(w);
    if (w.match(/tico$/)) broken.push(w);
    if (w.match(/metro$/)) broken.push(w);
    if (w.match(/grafo$/)) broken.push(w);
    if (['altimetro', 'timon', 'recuperese', 'presion', 'tension', 'revision', 'porcion', 'proporcion'].includes(w)) broken.push(w);
    
    // corrupted forms specific to dropped accented letters
    if (w.includes('enva')) broken.push(w);
    if (w.includes('seal')) broken.push(w);
    if (w.includes('diseo')) broken.push(w);
    if (w.includes('presin')) broken.push(w);
    // etc
    if (w.includes('acin') || w.includes('cin')) broken.push(w);
    if (w.includes('cnica') || w.includes('cnico') || w.includes('mico') || w.includes('ulica') || w.includes('trica')) broken.push(w);
}

console.log(broken.join(', '));
