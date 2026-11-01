import fs from 'fs';
import path from 'path';

const distPath = './dist/assets/';
const files = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));
const jsFile = fs.readFileSync(distPath + files[0], 'utf-8');

// The bundle uses something like `me(1,"LEVEL 1 - BASIC",[[...]],[[...]],[[...]])`
// We need to match each level exactly.
// Since JSON.parse needs valid JSON, we can use an AST parser or just manual extraction.
// Actually, it's `me(1,"LEVEL...` until the next `}),` or `],[` or similar.
// Better: the arrays contain string literals.
// `me(\d+,"[^"]+",\[\[.*?\]\],\[\[.*?\]\],\[\[.*?\]\])`
// Because it's minified, there are no unescaped brackets except to form the arrays.

// Let's use a bracket matching approach:
let matches = [];
let regex = /me\((\d+),"([^"]+)",/g;
let m;
while ((m = regex.exec(jsFile)) !== null) {
   let start = regex.lastIndex; // points to the '[' of the first array
   let currentIdx = start;
   
   let arrays = [];
   for (let i=0; i<3; i++) {
      let bracketCount = 0;
      let arrayText = "";
      let started = false;
      let inString = false;
      let escape = false;

      while(currentIdx < jsFile.length) {
         let char = jsFile[currentIdx];
         arrayText += char;
         
         if (!inString) {
             if (char === '"') inString = true;
             else if (char === '[') { started = true; bracketCount++; }
             else if (char === ']') { 
                 bracketCount--; 
                 if (started && bracketCount === 0) {
                     currentIdx++;
                     break; 
                 }
             }
         } else {
             if (escape) { escape = false; }
             else if (char === '\\') { escape = true; }
             else if (char === '"') { inString = false; }
         }
         currentIdx++;
      }
      
      arrays.push(arrayText);
      
      // Skip the comma between arrays
      if (i < 2) {
          while(jsFile[currentIdx] !== '[' && currentIdx < jsFile.length) {
              currentIdx++;
          }
      }
   }
   
   matches.push({
       id: parseInt(m[1]),
       title: m[2],
       arr1: arrays[0],
       arr2: arrays[1],
       arr3: arrays[2]
   });
}

console.log("Extracted levels:", matches.length);

const levelsDir = path.join(process.cwd(), 'src', 'data');

matches.forEach(level => {
    let content = `import { buildLevel } from './builder';\n\nexport const level${level.id} = buildLevel(\n  ${level.id},\n  "${level.title}",\n  ${level.arr1},\n  ${level.arr2},\n  ${level.arr3}\n);\n`;
    fs.writeFileSync(path.join(levelsDir, `level${level.id}.ts`), content, 'utf-8');
});

console.log("Successfully rebuilt pristine src/data/level*.ts from dist build artifact!");
