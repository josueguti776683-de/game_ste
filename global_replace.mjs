import fs from 'fs';
import path from 'path';

const corrections = {
    // missing vowels
    "accin": "acción",
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
    "atencin": "atención",
    "autorizacin": "autorización",
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
    "friccin": "fricción",
    "fundicin": "fundición",
    "guinada": "guiñada",
    "imprimacin": "imprimación",
    "indentacin": "indentación",
    "inspeccin": "inspección",
    "instruccin": "instrucción",
    "medicin": "medición",
    "multmetro": "multímetro",
    "navegacin": "navegación",
    "neumtico": "neumático",
    "obstruccin": "obstrucción",
    "operacin": "operación",
    "orientacin": "orientación",
    "plstico": "plástico",
    "precaucin": "precaución",
    "proteccin": "protección",
    "regulacin": "regulación",
    "reparacin": "reparación",
    "rotacin": "rotación",
    "seccin": "sección",
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

    // unaccented words
    "vacio": "vacío",
    "helice": "hélice",
    "avion": "avión",
    "perdida": "pérdida",
    "direccion": "dirección",
    "codigo": "código",
    "sustentacion": "sustentación",
    "presion": "presión",
    "valvula": "válvula",
    "automatico": "automático",
    "maximo": "máximo",
    "minimo": "mínimo",
    "rapido": "rápido",
    "hidraulico": "hidráulico",
    "electrico": "eléctrico",
    "mecanico": "mecánico",
    "camara": "cámara",
    "angulo": "ángulo",
    "basico": "básico",
    "unico": "único",
    "numero": "número",
    "estatico": "estático",
    "dinamico": "dinámico",
    "magnetico": "magnético",
    "liquido": "líquido",
    "solido": "sólido",
    "oxigeno": "oxígeno",
    "nitrogeno": "nitrógeno",
    "hidrogeno": "hidrógeno",
    "atmosfera": "atmósfera",
    "energia": "energía",
    "bateria": "batería",
    "termometro": "termómetro",
    "barometro": "barómetro",
    "area": "área",
    "linea": "línea",
    "frio": "frío",
    "calido": "cálido",
    "dia": "día",
    "guia": "guía",
    "tambien": "también",
    "asi": "así",
    "despues": "después",
    "segun": "según",
    "funcion": "función",
    "tension": "tensión",
    "conexion": "conexión",
    "altimetro": "altímetro",
    "maticamente": "máticamente",
    "timon": "timón",
    "recuperese": "recupérese",
    "automaticamente": "automáticamente",
    "porcion": "porción",
    "proporcion": "proporción",
    "revision": "revisión",
    "estan": "están"
};

const levelsDir = path.join(process.cwd(), 'src', 'data');
const files = fs.readdirSync(levelsDir).filter(f => f.startsWith('level') && f.endsWith('.ts'));

files.forEach(f => {
  const filePath = path.join(levelsDir, f);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // We will run the replacement globally over the entire file to fix vocab as well
  let newContent = content;

  // Split into words, replace properly maintaining case and boundaries
  // Because it's code, we only replace inside strings.
  
  const stringRegex = /"([^"\\]|\\.)*"/g;
  
  newContent = newContent.replace(stringRegex, (str) => {
     let fixedStr = str;
     
     // Match words within the string
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
     
     // specific fixes for verbiage
     fixedStr = fixedStr.replace(/(?<!\p{L})(esta)(?!\p{L})\s+([a-z]+(do|da|dos|das|ndo))\b/igu, (m, est, adj) => {
         if (est === 'esta') return 'está ' + adj;
         if (est === 'Esta') return 'Está ' + adj;
         return m;
     });
     
     return fixedStr;
  });

  fs.writeFileSync(filePath, newContent, 'utf-8');
});
console.log("Done global spelling replacement.");
