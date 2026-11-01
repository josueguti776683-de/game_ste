import fs from 'fs';
import path from 'path';

const levelsDir = path.join(process.cwd(), 'src', 'data');
const files = fs.readdirSync(levelsDir).filter(f => f.startsWith('level') && f.endsWith('.ts'));

// What could we have broken?
// If an English word matched our correction list exactly, it was broken.
// e.g. "seal" -> "señal"
//      "action" -> "acción"
//      "tension" -> "tensión"
//      "friction" -> "fricción"
//      "rotation" -> "rotación"
//      "section" -> "sección"
//      "area" -> "área"

const reverseFixes = {
    "señal": "seal", // wait, this might be tricky, maybe "seal" was English, maybe it was Spanish
    "acción": "action",
    "fricción": "friction",
    "tensión": "tension",
    "rotación": "rotation",
    "sección": "section",
    "área": "area",
    "dirección": "direction",
    "operación": "operation",
    "inspección": "inspection",
    "condición": "condition",
    "posición": "position",
    "atención": "attention"
};

// Actually, I should just recreate the files from `git checkout`!
// Do we have git? Let's check!
