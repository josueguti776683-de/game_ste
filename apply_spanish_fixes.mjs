import fs from 'fs';
import path from 'path';

// Our massive dictionary of fixes
const corrections = {
    // Missing an explicit 'i'
    "enva": "envía",
    "seal": "señal",
    "diseo": "diseño",
    "dao": "daño",
    "daos": "daños",
    "ao": "año",
    "aos": "años",
    "tamao": "tamaño",
    "desempeo": "desempeño",
    "depsito": "depósito",
    "pistn": "pistón",
    "autorizacin": "autorización",
    "precisin": "precisión",
    "presin": "presión",
    "tensin": "tensión",
    "accin": "acción",
    "friccin": "fricción",
    "rotacin": "rotación",
    "seccin": "sección",
    "condicin": "condición",
    "posicin": "posición",
    "atencin": "atención",
    "operacin": "operación",
    "inspeccin": "inspección",
    "funcin": "función",
    "conexin": "conexión",
    "revisin": "revisión",
    "porcin": "porción",
    "proporcin": "proporción",
    "clusula": "cláusula",
    "restriccin": "restricción",
    "preocupacin": "preocupación",
    "excepcin": "excepción",
    "prrroga": "prórroga",
    "retroalimentacin": "retroalimentación",
    "aceleracin": "aceleración",
    "acelermetro": "acelerómetro",
    "aceptacin": "aceptación",
    "acreditacin": "acreditación",
    "administracin": "administración",
    "afirmacin": "afirmación",
    "aleacin": "aleación",
    "alineacin": "alineación",
    "altmetro": "altímetro",
    "aplicacin": "aplicación",
    "aprobacin": "aprobación",
    "asignacin": "asignación",
    "calibracin": "calibración",
    "comparacin": "comparación",
    "configuracin": "configuración",
    "crtica": "crítica",
    "crtico": "crítico",
    "decoloracin": "decoloración",
    "deformacin": "deformación",
    "desaceleracin": "desaceleración",
    "deteccin": "detección",
    "disposicin": "disposición",
    "dramtica": "dramática",
    "especificacin": "especificación",
    "estacin": "estación",
    "evacuacin": "evacuación",
    "evaluacin": "evaluación",
    "fundicin": "fundición",
    "guinada": "guiñada",
    "imprimacin": "imprimación",
    "indentacin": "indentación",
    "instruccin": "instrucción",
    "medicin": "medición",
    "multmetro": "multímetro",
    "navegacin": "navegación",
    "neumtico": "neumático",
    "obstruccin": "obstrucción",
    "orientacin": "orientación",
    "plstico": "plástico",
    "precaucin": "precaución",
    "proteccin": "protección",
    "regulacin": "regulación",
    "reparacin": "reparación",
    "seleccin": "selección",
    "solucin": "solución",
    "termomagntico": "termomagnético",
    "tripulacin": "tripulación",
    "verificacin": "verificación",
    "vibracin": "vibración",
    "elctrica": "eléctrica",
    "elctrico": "eléctrico",
    "electrnica": "electrónica",
    "hidrulica": "hidráulica",
    "hidrulico": "hidráulico",
    "mdica": "médica",
    "tcnico": "técnico",
    "trmicamente": "térmicamente",
    "trmico": "térmico",
    "avinica": "aviónica",
    "aerodinmica": "aerodinámica",
    "excntrica": "excéntrica",
    "cnico": "cónico",
    "trica": "tórica",
    "automticamente": "automáticamente",
    "requiri": "requirió",
    "enve": "envíe",
    "tecnologa": "tecnología",
    "asesora": "asesoría",
    "anlisis": "análisis",
    "cermicos": "cerámicos",
    "ctricas": "éctricas",
    "ntrica": "éntrica",
    "rea": "área",
    "lnea": "línea",
    "frí": "frío",
    "dí": "día",
    "baterí": "batería",
    "energí": "energía",
    "vací": "vacío",
    "díametro": "diámetro",
    "pdrdida": "pérdida",
    "prdida": "pérdida",
    "hlice": "hélice",
    "mecnico": "mecánico",
    "cigo": "código",
    "vlvula": "válvula",
    "mximo": "máximo",
    "mnimo": "mínimo",
    "rpido": "rápido",
    "cmara": "cámara",
    "ngulo": "ángulo",
    "bsico": "básico",
    "nico": "único",
    "nmero": "número",
    "esttico": "estático",
    "dinmico": "dinámico",
    "magnético": "magnético",
    "lquido": "líquido",
    "slido": "sólido",
    "oxgeno": "oxígeno",
    "nitrgeno": "nitrógeno",
    "hidrgeno": "hidrógeno",
    "atmsfera": "atmósfera",
    "barmetro": "barómetro",
    "tambin": "también",
    "despus": "después",
    "segn": "según"
};

const levelsDir = path.join(process.cwd(), 'src', 'data');
const files = fs.readdirSync(levelsDir).filter(f => f.startsWith('level') && f.endsWith('.ts'));

files.forEach(f => {
  const filePath = path.join(levelsDir, f);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // To avoid breaking layout, since the arrays are strictly on lines like `  [["..."],["..."]]`
  // We will selectively target the SPANISH words.
  // Format is [["Eng","Span","kw","kw"],...] or [["Eng","Span","kw"],...] or [["w","Eng","Span"]]
  // Wait, in buildLevel, what are the arguments? array1=vocab1, array2=sentences, array3=vocab3.
  // We can just regex `/"([^"\\]|\\.)*"/g` carefully. We know that we ONLY want to apply spelling fixes
  // to Spanish text. We don't want to replace "seal" (english seal) with "señal" in the English string!
  
  // So instead of a global string replace, let's parse the JSON-like arrays because `level23.ts` 
  // currently has: `  [["The generator...","El generador...","GENERATOR","POWER"],...]`
  
  // We can regex the entire `[["..."],["..."]]` blocks!
  const blockRegex = /\[\["([^"\\]|\\.)*"\s*,[\s\S]*?(?=\]\])\]\]/g;
  
  content = content.replace(blockRegex, (block) => {
      // parse the block into a Javascript array safely using eval (since we know it's safe code we generated)
      const parsed = eval(`(${block})`);
      
      const fixedArray = parsed.map(item => {
          // item is [str1, str2, ...]
          // which index is Spanish?
          // If it's a 4-element array: ["Eng", "Span", "Kw1", "Kw2"] => index 1 is Spanish
          // If it's a 3-element array:
          // it could be vocabPlay1: ["Word", "Eng def", "Span trans"] => index 2 is Spanish
          // or... Wait.
          // Let's just fix ANY string that has spaces in it, OR any string that contains known typos!
          // BUT wait! English "seal" is 1 word, Spanish "seal" (señal) is 1 word.
          
          return item.map((str, idx) => {
              // Is this the Spanish index?
              // `buildLevel` signature: `vocabPlay1, sentences, vocabPlay3`
              // vocabPlay1: ["ACTUATE", "To operate...", "Actuar"] (idx=2 is Span)
              // sentences: ["The temp...", "El sensor...", "SENSOR", "SIGNAL"] (idx=1 is Span)
              // vocabPlay3: ["ABORT", "To stop...", "Abortar"] (idx=2 is Span)
              let isSpanish = false;
              if (item.length >= 4 && idx === 1) isSpanish = true;
              if (item.length === 3 && idx === 2) isSpanish = true;
              
              if (isSpanish) {
                  let fixedStr = str;
                  fixedStr = fixedStr.replace(/[\p{L}\p{M}]+/gu, (word) => {
                      let lower = word.toLowerCase();
                      if (corrections[lower]) {
                          let rep = corrections[lower];
                          if (word.charAt(0) === word.charAt(0).toUpperCase()) {
                              rep = rep.charAt(0).toUpperCase() + rep.slice(1);
                          }
                          return rep;
                      }
                      return word;
                  });
                  // extra heuristic for "esta" acting as "está" when followed by participles
                  fixedStr = fixedStr.replace(/(?<!\p{L})(esta|estan)(?!\p{L})\s+([a-z]+(do|da|dos|das|ndo|da|tico|tica|ticos|ticas))\b/igu, (m, est, adj) => {
                      if (est === 'esta') return 'está ' + adj;
                      if (est === 'Esta') return 'Está ' + adj;
                      if (est === 'estan') return 'están ' + adj;
                      if (est === 'Estan') return 'Están ' + adj;
                      return m;
                  });
                  return fixedStr;
              }
              return str;
          });
      });
      
      // format back exactly like `[["The generator...","El generador...","GENERATOR","POWER"],...]`
      const stringified = JSON.stringify(fixedArray);
      // JSON.stringify will add outer brackets, so it matches the block
      return stringified;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log("Spanish text correctly fixed!");
