import type { ChunkData } from './models';
import chunkJson from './data/chunk_data.json';

const chunkData = chunkJson as ChunkData[];

export function getChunk(x: number, y: number): ChunkData | undefined {
  return chunkData.find((chunk) => chunk.x === x && chunk.y === y);
}

export function clueCountsForChunk(chunk: ChunkData | undefined) {
  return {
    beginner: chunk?.beginnerClues?.length || 0,
    easy: chunk?.easyClues?.length || 0,
    medium: chunk?.mediumClues?.length || 0,
    hard: chunk?.hardClues?.length || 0,
    elite: chunk?.eliteClues?.length || 0,
    master: chunk?.masterClues?.length || 0,
  };
}

export function chunkHasClues(chunk: ChunkData | undefined): boolean {
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
