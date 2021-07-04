import type { Chunk, Clue } from './models';

import killCreatureClueData from './data/kill-creature-clue-data.json';

export function clueCountsForChunk(chunk: Chunk | undefined) {
  const killCreatureEliteClues = chunk
    ? getKillCreatureCluesForChunk(chunk).filter(
        (clue) => clue.difficulty === 'Elite'
      )
    : [];

  return {
    beginner: chunk?.beginnerClues?.length || 0,
    easy: chunk?.easyClues?.length || 0,
    medium: chunk?.mediumClues?.length || 0,
    hard: chunk?.hardClues?.length || 0,
    elite: (chunk?.eliteClues?.length || 0) + killCreatureEliteClues.length,
    master: chunk?.masterClues?.length || 0,
  };
}

export function chunkHasClues(chunk: Chunk | undefined): boolean {
  const clueCount = clueCountsForChunk(chunk);

  for (const count of Object.values(clueCount)) {
    if (count) return true;
  }

  return false;
}

export function getKillCreatureCluesForChunk(chunk: Chunk): Clue[] {
  return killCreatureClueData
    .filter((clue) => {
      for (const creature of clue.creatures) {
        for (const creatureChunk of creature.chunks) {
          if (creatureChunk.x === chunk.x && creatureChunk.y === chunk.y)
            return true;
        }
      }

      return false;
    })
    .map((clue) => {
      const alternateChunks: any[] = [];

      for (const creature of clue.creatures) {
        for (const creatureChunk of creature.chunks.filter(
          (c) => c.x !== chunk.x || c.y !== chunk.y
        )) {
          alternateChunks.push({
            x: creatureChunk.x,
            y: creatureChunk.y,
            notes: `${creature.name} can be found ${creatureChunk.location}.`,
          });
        }
      }

      return {
        ...clue,
        alternateChunks,
      };
    });
}

export function createClassString(object: {
  [className: string]: boolean;
}): string | undefined {
  const classes = [];

  for (const [key, value] of Object.entries(object)) {
    if (value) classes.push(key);
  }

  return classes.length ? classes.join(' ') : undefined;
}

export function capitalizeFirstLetter(str: string): string {
  return `${str.charAt(0).toUpperCase()}${str.substr(1)}`;
}

export function memo(callback: Function) {
  const cache = new Map();

  return (...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);

    const value = callback(...args);
    cache.set(key, value);

    return value;
  };
}
