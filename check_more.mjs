import fs from 'fs';

const words = fs.readFileSync('spanish_words.txt', 'utf-8').split('\n');

const suspects = [];

for (let w of words) {
   if (w.match(/ion$/) && w !== 'avion') suspects.push(w);
   if (w.match(/mente$/)) suspects.push(w);
   if (w.match(/ica$/)) suspects.push(w);
   if (w.match(/ico$/) && w !== 'pico') suspects.push(w);
   if (['altimetro', 'timon', 'recuperese', 'presion', 'tension', 'revision', 'porcion', 'proporcion'].includes(w)) suspects.push(w);
}

console.log(suspects.join(', '));
