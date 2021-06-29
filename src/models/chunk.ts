import type { Clue } from '.';

type Chunk = {
  x: number;
  y: number;
  beginnerClues?: Clue[];
  easyClues?: Clue[];
  mediumClues?: Clue[];
  hardClues?: Clue[];
  eliteClues?: Clue[];
  masterClues?: Clue[];
};

export default Chunk;
