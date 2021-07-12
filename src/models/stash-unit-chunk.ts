type StashUnitChunk = {
  x: number;
  y: number;
  stashUnits: {
    difficulty: string;
    type: string;
    location: string;
    items: string[];
  }[];
};

export default StashUnitChunk;
