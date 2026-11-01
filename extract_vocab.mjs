import fs from 'fs';
import path from 'path';

const levelsDir = path.join(process.cwd(), 'src', 'data');
const files = fs.readdirSync(levelsDir).filter(f => f.startsWith('level') && f.endsWith('.ts'));

// 1. Gather all unique correct Spanish words from vocab
const vocabWords = new Set();
const sentenceList = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(levelsDir, f), 'utf-8');
  
  const vocabRegex = /\[\s*"[^"]+",\s*"[^"]+",\s*"([^"]+)"\s*\]/g;
  let match;
  while ((match = vocabRegex.exec(content)) !== null) {
      let words = match[1].split(/[\s,()]+/);
      words.forEach(w => {
          if (w.trim().length > 1) vocabWords.add(w.trim());
      });
  }
});

let sortedVocab = Array.from(vocabWords).sort();
fs.writeFileSync('correct_vocab.txt', sortedVocab.join('\n'), 'utf-8');
console.log("Extracted", sortedVocab.length, "correct vocab words.");
