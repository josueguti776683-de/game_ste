import fs from 'fs';

const words = fs.readFileSync('pure_spanish_words.txt', 'utf-8').split('\n');
const broken = [];
for (let w of words) {
    if (w.match(/ion$/) && w !== 'avion') broken.push(w);
    if (w.match(/tica$/) && !w.match(/[aeiou]tica$/)) broken.push(w);
    if (w.match(/tico$/) && !w.match(/[aeiou]tico$/)) broken.push(w);
    if (w.match(/metro$/) && !w.match(/[aeiou]metro$/)) broken.push(w);
    if (w.match(/grafo$/) && !w.match(/[aeiou]grafo$/)) broken.push(w);
    if (w.match(/cin$/)) broken.push(w);
    if (w.match(/sin$/)) broken.push(w);
    if (['altimetro', 'timon', 'recuperese', 'presion', 'tension', 'revision', 'porcion', 'proporcion'].includes(w)) broken.push(w);
    if (w.includes('enva')) broken.push(w);
    if (w.includes('seal')) broken.push(w);
    if (w.includes('diseo')) broken.push(w);
    if (w.includes('ao') && w !== 'cadao') broken.push(w); // daño -> dao
}
console.log(broken.join(', '));
