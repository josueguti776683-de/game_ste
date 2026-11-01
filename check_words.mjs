import fs from 'fs';

const words = fs.readFileSync('spanish_words.txt', 'utf-8').split('\n');

const suspects = [];

for (let w of words) {
   if (w.endsWith('cion') || w.endsWith('sion') || w.endsWith('tica') || w.endsWith('tico') || w.endsWith('metro') || w.endsWith('grafo')) {
       suspects.push(w);
   }
   if (['esta', 'avion', 'helice', 'vacio', 'codigo', 'automatico', 'maximo', 'minimo', 'rapido', 'valvula', 'neumatico', 'hidraulico', 'electrico', 'mecanico', 'guinada', 'perdida', 'camara', 'angulo', 'basico', 'unico', 'numero', 'estatico', 'dinamico', 'magnetico', 'plastico', 'liquido', 'solido', 'oxigeno', 'nitrogeno', 'hidrogeno', 'atmosfera', 'energia', 'bateria', 'termometro', 'barometro', 'cabina', 'area', 'linea', 'frio', 'calido', 'dia', 'guia', 'autorizacin'].includes(w)) {
       suspects.push(w);
   }
}

console.log(suspects.join(', '));
