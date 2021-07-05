import LZString from 'lz-string';

import type { Chunk, Clue } from './models';

import killCreatureClueData from './data/kill-creature-clue-data.json';

export function clueCountsForChunk(chunk: Chunk | undefined) {
  const killCreatureEliteClues = chunk
    ? getKillCreatureCluesForChunk(chunk, 'elite')
    : [];

  const killCreatureMasterClues = chunk
    ? getKillCreatureCluesForChunk(chunk, 'master')
    : [];

  return {
    beginner: chunk?.beginnerClues?.length || 0,
    easy: chunk?.easyClues?.length || 0,
    medium: chunk?.mediumClues?.length || 0,
    hard: chunk?.hardClues?.length || 0,
    elite: (chunk?.eliteClues?.length || 0) + killCreatureEliteClues.length,
    master: (chunk?.masterClues?.length || 0) + killCreatureMasterClues.length,
  };
}

export function chunkHasClues(chunk: Chunk | undefined): boolean {
  const clueCount = clueCountsForChunk(chunk);

  for (const count of Object.values(clueCount)) {
    if (count) return true;
  }

  return false;
}

export function getKillCreatureCluesForChunk(
  chunk: Chunk,
  difficulty: string
): Clue[] {
  const clueData = (killCreatureClueData as any as { [clues: string]: Clue[] })[
    `${difficulty}Clues`
  ];

  if (!clueData) return [];

  return clueData
    .filter((clue) => {
      if (!clue.creatures) return false;

      for (const creature of clue.creatures) {
        for (const creatureChunk of creature.chunks) {
          if (creatureChunk.x === chunk.x && creatureChunk.y === chunk.y)
            return true;
        }
      }

      return false;
    })
    .map((clue) => {
      if (!clue.creatures) clue.creatures = [];

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

export function compressUnlockedChunks(
  width: number,
  height: number,
  unlocked: { x: number; y: number }[]
) {
  // method 0
  let bitString = '';

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      bitString += unlocked.find((chunk) => chunk.x === x && chunk.y === y)
        ? 1
        : 0;
    }
  }

  const method0: string = LZString.compressToEncodedURIComponent(
    `0${bitString}`
  );

  const remainder = bitString.length % 8;
  const zeroesToAdd = remainder ? 8 - remainder : 0;

  for (let i = 0; i < zeroesToAdd; i++) {
    bitString += '0';
  }

  // method 1
  let str = '';

  for (let i = 0; i < bitString.length / 8; i++) {
    const num = parseInt(bitString.substr(i * 8, 8), 2);
    str += String.fromCharCode(num);
  }

  const method1: string = LZString.compressToEncodedURIComponent(`1${str}`);

  // compare and return shorter outut
  return method1.length < method0.length ? method1 : method0;
}

export function decompressUnlockedChunks(
  width: number,
  height: number,
  compressed: string
): { x: number; y: number }[] {
  let str: string = LZString.decompressFromEncodedURIComponent(compressed);

  const method: number = parseInt(str.charAt(0), 10);

  str = str.substr(1);

  // get bit string
  let bitString = '';

  if (method === 1) {
    for (let i = 0; i < str.length; i++) {
      let byte = str.charCodeAt(i).toString(2);

      const zeroesToAdd = 8 - byte.length;
      byte = `${'0'.repeat(zeroesToAdd)}${byte}`;

      bitString += byte;
    }

    const bitsToExpect = width * height;
    bitString = bitString.substr(0, bitsToExpect);
  } else {
    bitString = str;
  }

  // get unlocked chunks from bit string
  const unlocked: { x: number; y: number }[] = [];

  for (let i = 0; i < bitString.length; i++) {
    if (bitString.charAt(i) === '1') {
      unlocked.push({ x: i % width, y: Math.floor(i / width) });
    }
  }

  return unlocked;
}
