type Clue = {
  type: string;
  clueHint: string;
  solution?: string;
  location: string;
  itemsRequired?: string[];
  alternateChunks?: { x: number; y: number; notes: string }[];
  copied?: boolean;
};

export default Clue;

export type ClueDifficulty =
  | 'Beginner'
  | 'Easy'
  | 'Medium'
  | 'Hard'
  | 'Elite'
  | 'Master';
