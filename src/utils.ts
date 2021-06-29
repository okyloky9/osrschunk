import type { Chunk } from './models';

export function clueCountsForChunk(chunk: Chunk | undefined) {
  return {
    beginner: chunk?.beginnerClues?.length || 0,
    easy: chunk?.easyClues?.length || 0,
    medium: chunk?.mediumClues?.length || 0,
    hard: chunk?.hardClues?.length || 0,
    elite: chunk?.eliteClues?.length || 0,
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
