import fs from 'fs';
import path from 'path';

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1,
                                Math.min(matrix[i][j - 1] + 1,
                                         matrix[i - 1][j] + 1));
      }
    }
  }
  return matrix[b.length][a.length];
}

const levelsDir = path.join(process.cwd(), 'src', 'data');
const files = fs.readdirSync(levelsDir).filter(f => f.startsWith('level') && f.endsWith('.ts'));

// Before processing sentences, let's load ALL dictionary words across all files so we can match any.
let allVocab = [];
for (let f of files) {
    let content = fs.readFileSync(path.join(levelsDir, f), 'utf-8');
    // Extract vocab arrays: [["WORD", "Def", "Trans"]]
    const vocabRegex = /\[\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*"\s*\]/g;
    let match;
    while((match = vocabRegex.exec(content)) !== null) {
        // avoid sentences: sentences have 4 or 6 elements, we can tell if we just regex for 3 element arrays:
        // Wait, the blockRegex approach from before is safer.
    }
}

// Safer approach: use node to require() the built files. But they are TS. We can use tsx or dynamic import if we compiled.
// But we actually have `dist/assets/index-xxx.js` that we just used. No wait, we rebuilt src/data/level*.ts.

// Let's just do a rough extraction:
for (let f of files) {
  const content = fs.readFileSync(path.join(levelsDir, f), 'utf-8');
  const blockRegex = /\[\["([^"\\]|\\.)*"\s*,[\s\S]*?(?=\]\])\]\]/g;
  let matches = [];
  let execRes;
  while((execRes = blockRegex.exec(content)) !== null) {
      matches.push(execRes[0]);
  }
  if (matches.length >= 3) {
      // matches[0] is array1 (vocab), matches[1] is array2 (sentences), matches[2] is array3 (extra vocab)
      let v1 = eval(`(${matches[0]})`);
      let v3 = eval(`(${matches[2]})`);
      allVocab.push(...v1, ...v3);
  }
}

const getGlobalTranslations = (keyword) => {
  if (!keyword) return [];
  const target = keyword.trim().toUpperCase();
  
  let match = allVocab.find(v => v[0].trim().toUpperCase() === target);
  if (!match) {
      match = allVocab.find(v => v[0].trim().toUpperCase() === target.replace(/S$/, ''));
  }
  if (!match) {
      match = allVocab.find(v => v[0].trim().toUpperCase() === target + 'S');
  }
  if (match) {
      const es = match[2].trim();
      const results = [es];
      if (es.endsWith('a') || es.endsWith('e') || es.endsWith('i') || es.endsWith('o') || es.endsWith('u')) {
         results.push(es + 's');
      } else if (es.endsWith('ón') || es.endsWith('ín')) {
         results.push(es.slice(0, -2) + 'on' + (es.endsWith('ón') ? 'es' : 'es')); 
      } else {
         results.push(es + 'es');
      }
      return results;
  }
  // additional hardcoded fallbacks
  if (target === 'SEAL') return ['Sello', 'Sellos', 'Junta'];
  if (target === 'SIGNAL') return ['Señal', 'Señales'];
  if (target === 'STALL') return ['Pérdida'];
  if (target === 'REPAIR') return ['Reparar', 'Reparación'];
  if (target === 'TENSION') return ['Tensión'];
  if (target === 'INSPECTION') return ['Inspección'];
  if (target === 'OPERATION') return ['Operación'];
  if (target === 'POSITION') return ['Posición'];
  return [];
};

function extractKeywords(spanishText, kw1, kw2) {
    const englishKeywords = [kw1, kw2].filter(Boolean);
    const words = spanishText.match(/[\p{L}\p{M}]+/gu) || [];
    const exactKeywords = [];

    for (const enKw of englishKeywords) {
      const translations = getGlobalTranslations(enKw);
      if (translations.length === 0) continue;

      const cleanTranslations = translations.map(t => removeAccents(t.toLowerCase()));
      
      let bestMatch = '';
      let bestScore = 0;

      for (const word of words) {
        if (word.length <= 2) continue;
        const cleanWord = removeAccents(word.toLowerCase());
        if (['las', 'los', 'una', 'del', 'con', 'por', 'que'].includes(cleanWord)) continue;

        for (const trans of cleanTranslations) {
          if (cleanWord === trans) {
              bestMatch = word;
              bestScore = 100;
              break;
          }

          if (cleanWord.includes(trans) || trans.includes(cleanWord)) {
             if (Math.min(cleanWord.length, trans.length) >= 4) {
               if (80 > bestScore) { bestScore = 80; bestMatch = word; }
             }
          }

          const dist = levenshtein(cleanWord, trans);
          if (trans.length > 5 && dist <= 2) {
             if (70 > bestScore) { bestScore = 70; bestMatch = word; }
          } else if (trans.length <= 5 && dist <= 1) {
             if (60 > bestScore) { bestScore = 60; bestMatch = word; }
          }

          if (trans.length >= 5 && cleanWord.length >= 5) {
            const commonPrefix = trans.substring(0, trans.length - 2); 
            if (cleanWord.startsWith(commonPrefix)) {
               if (50 > bestScore) { bestScore = 50; bestMatch = word; }
            }
            if (trans.endsWith('zar')) {
               const base = trans.substring(0, trans.length - 3) + 'c';
               if (cleanWord.startsWith(base)) {
                 if (50 > bestScore) { bestScore = 50; bestMatch = word; }
               }
            }
            if (trans.endsWith('car')) {
               const base = trans.substring(0, trans.length - 3) + 'qu';
               if (cleanWord.startsWith(base)) {
                 if (50 > bestScore) { bestScore = 50; bestMatch = word; }
               }
            }
            if (trans.endsWith('ar')) {
               const base = trans.substring(0, trans.length - 2);
               if (cleanWord.startsWith(base)) {
                 if (45 > bestScore) { bestScore = 45; bestMatch = word; }
               }
            }
          }
        }
        if (bestScore === 100) break;
      }

      if (bestMatch && !exactKeywords.includes(bestMatch)) {
        exactKeywords.push(bestMatch);
      }
    }
    return exactKeywords;
}

for (let f of files) {
  const filePath = path.join(levelsDir, f);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const blockRegex = /\[\["([^"\\]|\\.)*"\s*,[\s\S]*?(?=\]\])\]\]/g;
  let blockIndex = 0;
  
  content = content.replace(blockRegex, (block) => {
      const parsed = eval(`(${block})`);
      blockIndex++;
      
      if (blockIndex === 2) { // Sentences block
          const fixedArray = parsed.map(item => {
              if (item.length === 4) {
                  // extract explicit keywords
                  const kws = extractKeywords(item[1], item[2], item[3]);
                  if (kws.length > 0) {
                      return [item[0], item[1], item[2], item[3], kws[0] || "", kws[1] || ""];
                  }
              }
              return item;
          });
          return JSON.stringify(fixedArray);
      }
      
      return JSON.stringify(parsed);
  });

  fs.writeFileSync(filePath, content, 'utf-8');
}
console.log("Baked keywords directly into level data.");
