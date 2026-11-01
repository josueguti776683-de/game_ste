import fs from 'fs';

const distPath = './dist/assets/';
const files = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));

if (files.length === 0) {
    console.log("No js files found");
    process.exit(1);
}

const jsFile = fs.readFileSync(distPath + files[0], 'utf-8');

// The levels are arrays of arrays like [["Sensor", "Sensor", "SENSOR", "SENSOR"], ...]
// Let's find all occurrences of `\[\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*"[^"]+"\s*\]` exactly.
// But wait, the bundle is minified, so it might be `["Eng","Span","Kw","Kw"]`.
// Let's just find `\["[^"]+","[^"]+","[^"]+","[^"]+"\]`
const regex = /\["([^"\\]|\\.)*","([^"\\]|\\.)*","([^"\\]|\\.)*","([^"\\]|\\.)*"\]/g;
const matches = [];
let m;
while ((m = regex.exec(jsFile)) !== null) {
   matches.push(m[0]);
}

console.log("Found", matches.length, "4-element arrays in dist bundle.");

const regex3 = /\["([^"\\]|\\.)*","([^"\\]|\\.)*","([^"\\]|\\.)*"\]/g;
const matches3 = [];
while ((m = regex3.exec(jsFile)) !== null) {
   matches3.push(m[0]);
}
console.log("Found", matches3.length, "3-element arrays in dist bundle.");

