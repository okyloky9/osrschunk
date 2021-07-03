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
      for (const clue of clues) {
        if (!clue.location) delete clue.location;

        if (!clue.itemsRequired || !clue.itemsRequired.length) {
          delete clue.itemsRequired;
        }
      }
    }
  }
}

fs.writeFileSync(chunkDataFile, JSON.stringify(chunkData));
