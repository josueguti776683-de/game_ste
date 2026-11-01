import fs from 'fs';
import path from 'path';

const levelsDir = path.join(process.cwd(), 'src', 'data');
const files = fs.readdirSync(levelsDir).filter(f => f.startsWith('level') && f.endsWith('.ts'));

let allSpanishWords = new Set();
let sentences = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(levelsDir, f), 'utf-8');
  const sentenceRegex = /\[\s*"[^"]+",\s*"([^"]+)"/g;
  let match;
  while ((match = sentenceRegex.exec(content)) !== null) {
      sentences.push(match[1]);
      let words = match[1].match(/[a-zA-Z]+/g) || [];
      words.forEach(w => allSpanishWords.add(w.toLowerCase()));
  }
});

let wordsArr = Array.from(allSpanishWords).sort();
fs.writeFileSync('spanish_words.txt', wordsArr.join('\n'));
console.log("Found", wordsArr.length, "unique words.");
