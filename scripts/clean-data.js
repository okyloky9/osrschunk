const fs = require('fs');
const path = require('path');

const chunkDataFile = path.join(__dirname, '../src/data/chunk-data.json');

const chunkDataJson = fs.readFileSync(chunkDataFile, 'utf-8');

const chunkData = JSON.parse(chunkDataJson);

const difficulties = ['beginner', 'easy', 'medium', 'hard', 'elite', 'master'];

for (const chunk of chunkData) {
  for (const difficulty of difficulties) {
    const key = `${difficulty}Clues`;

    const clues = chunk[key];

    if (clues) {
      for (const [clueIndex, clue] of clues.entries()) {
        // trim `clueHint` field
        if (clue.clueHint) clue.clueHint = clue.clueHint.trim();

        if (!clue.clueHint) {
          // all but Hot/Cold clues should have `clueHint`
          if (clue.type !== 'Hot/Cold') {
            console.log(
              `'${difficulty}' clue ${clueIndex} missing 'clueHint' in chunk (${chunk.x}, ${chunk.y}).`
            );
          }
          // remove the `clueHint` field for "Hot/Cold" clues
          else {
            delete clue.clueHint;
          }
        }

        // trim `solution` field (or remove it if it's empty)
        if (clue.solution) clue.solution = clue.solution.trim();
        if (!clue.solution) delete clue.solution;

        // trim `location` field (or remove it if it's empty)
        if (clue.location) clue.location = clue.location.trim();
        if (!clue.location) delete clue.location;

        // if `itemsRequired` field is empty, remove it
        if (!clue.itemsRequired || !clue.itemsRequired.length) {
          delete clue.itemsRequired;
        }

        // if `alternateChunks` field is empty, remove it
        if (!clue.alternateChunks || !clue.alternateChunks.length) {
          delete clue.alternateChunks;
        }
      }
    }
  }
}

fs.writeFileSync(chunkDataFile, JSON.stringify(chunkData));
