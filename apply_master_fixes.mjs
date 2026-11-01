import fs from 'fs';
import path from 'path';
import fixes from './master_fixes.mjs';

const levelsDir = path.join(process.cwd(), 'src', 'data');
const files = fs.readdirSync(levelsDir).filter(f => f.startsWith('level') && f.endsWith('.ts'));

files.forEach(f => {
  const filePath = path.join(levelsDir, f);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace in Sentences: ["Eng", "Span", "Kw1", "Kw2"]
  const sentenceRegex = /\[\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*"/g;
  content = content.replace(sentenceRegex, (match, en, sp, k1, k2) => {
     let fixedSp = sp;
     fixedSp = fixedSp.replace(/[\p{L}\p{M}]+/gu, (word) => {
         let lower = word.toLowerCase();
         // manual skip 
         if (lower === 'esta' || lower === 'estas' || lower === 'este' || lower === 'estos') return word;
         if (lower === 'est') return word.replace('est', 'está');
         if (fixes[lower]) {
             let rep = fixes[lower];
             if (word.charAt(0) === word.charAt(0).toUpperCase()) {
                 rep = rep.charAt(0).toUpperCase() + rep.slice(1);
             }
             return rep;
         }
         return word;
     });
     
     fixedSp = fixedSp.replace(/(?<!\p{L})(esta|estan)(?!\p{L})\s+([a-z]+(do|da|dos|das|ndo|da))\b/igu, (m, est, adj) => {
         if (est === 'esta') return 'está ' + adj;
         if (est === 'Esta') return 'Está ' + adj;
         if (est === 'estan') return 'están ' + adj;
         if (est === 'Estan') return 'Están ' + adj;
         return m;
     });
     
     return `["${en}", "${fixedSp}", "${k1}", "${k2}"`; // Note: the closing bracket is out of the regex match
  });

  // Replace in Vocab: ["WORD", "Eng Def", "Span Trans"]
  const vocabRegex = /\[\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*"\s*\]/g;
  content = content.replace(vocabRegex, (match, word, en, sp) => {
     // If it's literally a 3 item, this regex captures it, no matter if it's sentences or vocab, but sentences 
     // would have already been partially matched above.
     let fixedSp = sp;
     fixedSp = fixedSp.replace(/[\p{L}\p{M}]+/gu, (w) => {
         let lower = w.toLowerCase();
         if (lower === 'esta' || lower === 'estas' || lower === 'este' || lower === 'estos') return w;
         if (lower === 'est') return w.replace('est', 'está');
         if (fixes[lower]) {
             let rep = fixes[lower];
             if (w.charAt(0) === w.charAt(0).toUpperCase()) {
                 rep = rep.charAt(0).toUpperCase() + rep.slice(1);
             }
             return rep;
         }
         return w;
     });
     
     fixedSp = fixedSp.replace(/(?<!\p{L})(esta|estan)(?!\p{L})\s+([a-z]+(do|da|dos|das|ndo|da))\b/igu, (m, est, adj) => {
         if (est === 'esta') return 'está ' + adj;
         if (est === 'Esta') return 'Está ' + adj;
         if (est === 'estan') return 'están ' + adj;
         if (est === 'Estan') return 'Están ' + adj;
         return m;
     });
     
     return `["${word}", "${en}", "${fixedSp}"]`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log("Done carefully applying fixes to Spanish strings only!");
