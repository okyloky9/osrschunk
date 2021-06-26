type Clue = {
  type: string;
  clueHint: string;
  solution?: string;
  location: string;
  itemsRequired?: string[];
  alternateChunks?: { x: number; y: number; notes: string }[];
};

export default Clue;

export type ClueDifficulty =
  | 'Beginner'
  | 'Easy'
  | 'Medium'
  | 'Hard'
  | 'Elite'
  | 'Master';
