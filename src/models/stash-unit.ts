type StashUnit = {
  difficulty: string;
  type: string;
  location: string;
  items: string[];
  chunk?: { x: number; y: number };
  alternateChunks?: { x: number; y: number }[];
};

export default StashUnit;
