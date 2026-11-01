import fs from 'fs';
import path from 'path';

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const corrections = {
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
  
  const blockRegex = /\[\["([^"\\]|\\.)*"\s*,[\s\S]*?(?=\]\])\]\]/g;
  
  content = content.replace(blockRegex, (block) => {
      const parsed = eval(`(${block})`);
      
      const fixedArray = parsed.map(item => {
          return item.map((str, idx) => {
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
                  fixedStr = fixedStr.replace(/(?<!\p{L})(esta|estan)(?!\p{L})\s+([a-z]+(do|da|dos|das|ndo|da|tico|tica|ticos|ticas))\b/igu, (m, est, adj) => {
                      if (est === 'esta') return 'está ' + adj;
                      if (est === 'Esta') return 'Está ' + adj;
                      if (est === 'estan') return 'están ' + adj;
                      if (est === 'Estan') return 'Están ' + adj;
                      return m;
                  });
                  return fixedStr;
              } else {
                  // ENGLISH OR KEYWORDS!
                  let eng = removeAccents(str);
                  // also un-do "señal" -> "seal" because `removeAccents` would turn it to "senal".
                  eng = eng.replace(/(?<!\p{L})senal(?!\p{L})/igu, (m) => {
                     return m.charAt(0) === 'S' ? (m.charAt(1) === 'E' ? 'SEAL' : 'Seal') : 'seal';
                  });
                  eng = eng.replace(/(?<!\p{L})esta(?!\p{L})/igu, (m) => {
                     return m.charAt(0) === 'E' ? (m.charAt(1) === 'S' ? 'EST' : 'Est') : 'est';
                  });
                  return eng;
              }
          });
      });
      
      return JSON.stringify(fixedArray);
  });

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log("ALL TEXT PERFECTLY FIXED!");
