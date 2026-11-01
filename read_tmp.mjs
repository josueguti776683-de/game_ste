import fs from 'fs';
const text = fs.readFileSync('/tmp/formatted_output.txt', 'utf-8');
console.log(text.substring(0, 1500));
