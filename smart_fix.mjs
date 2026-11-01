import fs from 'fs';
import path from 'path';

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// 1. Load correct vocab
const correctVocab = fs.readFileSync('correct_vocab.txt', 'utf-8').split('\n').filter(Boolean);

// We need a map from "broken form" to "correct form"
// If we simulate the "broken form" by stripping accents AND dropping the accented letter entirely!
// Wait! Both stripping and dropping might have happened.
const brokenMap = {};

// Also add a few manual generic ones
const extraCorrect = "está,están,más,qué,sí,así,también,después,según,sólo,función,tensión,conexión,precisión,requirió,envíe,tecnología,asesoría,análisis,daño,vacío,díametro,magnético,crítica,crítico,rápido,único,número,pérdida,hélice,térmico,eléctrico,hidráulico,mecánico,avión,dirección,código,automático,mínimo,máximo,cálido,frío,guía,día,atmósfera,batería,energía,línea,área,termómetro,barómetro,sólido,líquido,oxígeno,nitrógeno,hidrógeno,estático,dinámico,básico,ángulo,cámara,válvula,presión,sustentación".split(',');
for(let w of extraCorrect) correctVocab.push(w);

// Create mapping based on stripped letter OR stripped accent
for(let correct of correctVocab) {
    let lower = correct.toLowerCase();
    
    // Type 1: Just unaccented (e.g. "avion" for "avión")
    let unaccented = removeAccents(lower);
    if(unaccented !== lower) {
        brokenMap[unaccented] = correct;
    }
    
    // Type 2: Corrupted deletion (e.g. "avin" for "avión", "tecnologa" for "tecnología", "anlisis" for "análisis")
    let deleted = lower.replace(/[áéíóúñ]/g, '');
    if(deleted.length > 2 && deleted !== lower) {
        // Only safely map if length > 2 to avoid weird conflicts
        brokenMap[deleted] = correct;
    }
}

// Add edge cases I saw manually
const fixedMap = {
    ...brokenMap,
    "autorizacin": "autorización",
    "precisin": "precisión",
    "requiri": "requirió",
    "enve": "envíe",
    "tecnologa": "tecnología",
    "asesora": "asesoría",
    "anlisis": "análisis",
    "est": "está", // wait, "est" could be dangerous. Let's only replace specific whole words
    "dao": "daño",
     "guinada": "guiñada"
};

const levelsDir = path.join(process.cwd(), 'src', 'data');
const files = fs.readdirSync(levelsDir).filter(f => f.startsWith('level') && f.endsWith('.ts'));

files.forEach(f => {
  const filePath = path.join(levelsDir, f);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const stringRegex = /"([^"\\]|\\.)*"/g;
  
  content = content.replace(stringRegex, (str) => {
     let fixedStr = str;
     
     fixedStr = fixedStr.replace(/[\p{L}\p{M}]+/gu, (word) => {
         let lower = word.toLowerCase();
         // Don't replace "esta" globally using map, because "esta" is valid "this".
         if (lower === 'esta' || lower === 'estas' || lower === 'este' || lower === 'estos') return word;
         if (lower === 'est') return word.replace('est', 'está'); // est is definitely broken "está"
         
         if (fixedMap[lower]) {
             let rep = fixedMap[lower];
             if (word.charAt(0) === word.charAt(0).toUpperCase()) {
                 rep = rep.charAt(0).toUpperCase() + rep.slice(1);
             }
             return rep;
         }
         return word;
     });
     
     fixedStr = fixedStr.replace(/(?<!\p{L})(esta)(?!\p{L})\s+([a-z]+(do|da|dos|das|ndo))\b/igu, (m, est, adj) => {
         if (est === 'esta') return 'está ' + adj;
         if (est === 'Esta') return 'Está ' + adj;
         return m;
     });
     
     return fixedStr;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
});
console.log("Done smart applying of all accents!");
