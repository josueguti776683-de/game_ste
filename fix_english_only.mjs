import fs from 'fs';
import path from 'path';

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const levelsDir = path.join(process.cwd(), 'src', 'data');
const files = fs.readdirSync(levelsDir).filter(f => f.startsWith('level') && f.endsWith('.ts'));

files.forEach(f => {
  const filePath = path.join(levelsDir, f);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Sentences: ["English", "Spanish", "Kw1", "Kw2"]
  // Could be 4 or 6 elements, depending on state
  const sentenceRegex = /\[\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*"/g;
  content = content.replace(sentenceRegex, (match, en, sp, k1, k2) => {
     let fixedEn = en;
     let fixedK1 = k1;
     let fixedK2 = k2;
     
     // Remove accents from English text and keywords
     fixedEn = removeAccents(fixedEn);
     fixedK1 = removeAccents(fixedK1);
     fixedK2 = removeAccents(fixedK2);
     
     // specific fixes for deleted chars matching english words
     // "señal" -> "seal" but "ñ" isn't in NFD \u0300-\u036f (it maps to n + \u0303 in NFD, so it becomes "senal")
     // Wait, NFD on "señal" becomes "sen\u0303al". Then replace removes \u0303. It becomes "senal" !!
     // So I'll just rely on "senal" -> "seal"!
     fixedEn = fixedEn.replace(/(?<!\p{L})senal(?!\p{L})/igu, (m) => {
         return m.charAt(0) === 'S' ? (m.charAt(1) === 'E' ? 'SEAL' : 'Seal') : 'seal';
     });
     fixedK1 = fixedK1.replace(/(?<!\p{L})senal(?!\p{L})/igu, (m) => {
         return m.charAt(0) === 'S' ? (m.charAt(1) === 'E' ? 'SEAL' : 'Seal') : 'seal';
     });
     fixedK2 = fixedK2.replace(/(?<!\p{L})senal(?!\p{L})/igu, (m) => {
         return m.charAt(0) === 'S' ? (m.charAt(1) === 'E' ? 'SEAL' : 'Seal') : 'seal';
     });
     
     // Also fix "est" -> "esta" -> "est"? If it became "esta", I can just leave it or change back to "est". 
     // Wait, what if the English sentence had "test"? `removeAccents` leaves "test". That's fine.
     fixedEn = fixedEn.replace(/(?<!\p{L})esta(?!\p{L})/igu, (m) => {
         return m.charAt(0) === 'E' ? (m.charAt(1) === 'S' ? 'EST' : 'Est') : 'est';
     });
     fixedK1 = fixedK1.replace(/(?<!\p{L})esta(?!\p{L})/igu, (m) => {
         return m.charAt(0) === 'E' ? (m.charAt(1) === 'S' ? 'EST' : 'Est') : 'est';
     });
     fixedK2 = fixedK2.replace(/(?<!\p{L})esta(?!\p{L})/igu, (m) => {
         return m.charAt(0) === 'E' ? (m.charAt(1) === 'S' ? 'EST' : 'Est') : 'est';
     });

     return `["${fixedEn}", "${sp}", "${fixedK1}", "${fixedK2}"`; 
  });
  
  // Vocab: ["WORD", "Eng Def", "Span Trans"]
  const vocabRegex = /\[\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*",\s*"([^"\\]|\\.)*"\s*\]/g;
  content = content.replace(vocabRegex, (match, word, en, sp) => {
     let fixedWord = removeAccents(word);
     let fixedEn = removeAccents(en);
     
     fixedWord = fixedWord.replace(/(?<!\p{L})senal(?!\p{L})/igu, (m) => {
         return m.charAt(0) === 'S' ? (m.charAt(1) === 'E' ? 'SEAL' : 'Seal') : 'seal';
     });
     fixedEn = fixedEn.replace(/(?<!\p{L})senal(?!\p{L})/igu, (m) => {
         return m.charAt(0) === 'S' ? (m.charAt(1) === 'E' ? 'SEAL' : 'Seal') : 'seal';
     });

     return `["${fixedWord}", "${fixedEn}", "${sp}"]`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log("English index fixed!");
