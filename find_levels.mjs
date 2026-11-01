import fs from 'fs';

const distPath = './dist/assets/';
const files = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));
const jsFile = fs.readFileSync(distPath + files[0], 'utf-8');

// The bundle might have `buildLevel(1,"LEVEL 1 - INTRODUCTION",` or something similar,
// but minified. So it might be `Ym=g(1,"LEVEL 1 - INTRODUCTION",`
// Let's find all occurrences of `"LEVEL `
const levelMatches = [];
const regex = /.{0,20}"LEVEL \d+ - [^"]+".{0,40}/g;
let m;
while ((m = regex.exec(jsFile)) !== null) {
   levelMatches.push(m[0]);
}

console.log(levelMatches.join('\n'));
