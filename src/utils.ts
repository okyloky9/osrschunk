import type { Chunk, Clue } from './models';

export function clueCountsForChunk(chunk: Chunk | undefined) {
  function addMediumChallengeScrolls(clues: Clue[] | undefined) {
    const _clues = clues ? [...clues] : [];

    if (!chunk || !chunk.mediumClues) return _clues;

    _clues.push(
      ...chunk.mediumClues.filter(({ type }) => type === 'Challenge Scroll')
    );

    return _clues;
  }

  return {
    beginner: chunk?.beginnerClues?.length || 0,
    easy: chunk?.easyClues?.length || 0,
    medium: chunk?.mediumClues?.length || 0,
    hard: addMediumChallengeScrolls(chunk?.hardClues).length || 0,
    elite: addMediumChallengeScrolls(chunk?.eliteClues).length || 0,
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
