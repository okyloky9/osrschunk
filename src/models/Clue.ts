type Clue = {
  type: string; // TODO: create union string type
  clueHint: string;
  solution?: string;
  location: string;
  itemsRequired?: string[];
};

export default Clue;
