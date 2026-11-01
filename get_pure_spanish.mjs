import fs from 'fs';
import path from 'path';

const levelsDir = path.join(process.cwd(), 'src', 'data');
const files = fs.readdirSync(levelsDir).filter(f => f.startsWith('level') && f.endsWith('.ts'));

const spanishSentences = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(levelsDir, f), 'utf-8');
  
  // Sentences: ["Eng", "Span", "Kw1", "kw2"]
  const sentenceRegex = /\[\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*"/g;
  let match;
  while ((match = sentenceRegex.exec(content)) !== null) {
      spanishSentences.push(match[2]);
  }
  
  // Vocab: ["WORD", "Eng Def", "Span Trans"]
  const vocabRegex = /\[\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*"\s*\]/g;
  while ((match = vocabRegex.exec(content)) !== null) {
      // Avoid matching sentences that happen to look like 3-element arrays, but vocab is usually 3-element.
      // Sentences have 4 or 6. We can distinguish because we parsed them safely.
      spanishSentences.push(match[3]);
  }
});

let allSpanishWords = new Set();
spanishSentences.forEach(s => {
    let w = s.match(/[\p{L}\p{M}]+/gu) || [];
    w.forEach(word => allSpanishWords.add(word.toLowerCase()));
});

fs.writeFileSync('pure_spanish_words.txt', Array.from(allSpanishWords).sort().join('\n'));
console.log("Written pure_spanish_words.txt");
