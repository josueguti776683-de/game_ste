import fs from 'fs';

const words = fs.readFileSync('spanish_words.txt', 'utf-8').split('\n');
const broken = [];
for (let w of words) {
    if (w.match(/cin$/)) broken.push([w, w.replace(/cin$/, 'ción')]);
    else if (w.match(/sio$/)) broken.push([w, w.replace(/sio$/, 'sión')]);
    else if (w.match(/tica$/) && !w.match(/[aeiou]tica$/)) broken.push([w, w.replace(/tica$/, 'ática')]);
    else if (w.match(/tico$/) && !w.match(/[aeiou]tico$/)) broken.push([w, w.replace(/tico$/, 'ático')]);
    else if (w.match(/metro$/) && !w.match(/[aeiou]metro$/)) broken.push([w, w.replace(/metro$/, 'ímetro')]);
    else if (w === 'accin') broken.push([w, 'acción']);
}
console.log(JSON.stringify(broken, null, 2));
