import { useContext } from 'react';

import ClueTable from './ClueTable';
import { ChunkDataContext } from '../data';
import { Chunk, Clue, ClueDifficulty } from '../models';

const ChunkModal: React.FC<{
  chunkCoords: { x: number; y: number };
  editMode: boolean;
}> = ({ chunkCoords, editMode }) => {
  const { getChunk, setChunk } = useContext(ChunkDataContext);

  const { x, y } = chunkCoords;
  const chunk = getChunk(x, y) || {
    x,
    y,
  };

  function updateClues(type: ClueDifficulty, clues: Clue[]) {
    setChunk(x, y, {
      ...chunk,
      [`${type.toLowerCase()}Clues`]: clues,
    } as Chunk);
  }

  return (
    <div id="chunk-modal">
      <h1>
        Chunk ({x}, {y})
      </h1>

      <div>
        <ClueTable
          clues={chunk?.beginnerClues}
          difficulty="Beginner"
          updateClues={
            editMode
              ? (clues: Clue[]) => updateClues('Beginner', clues)
              : undefined
          }
        />
      </div>

      <div>
        <ClueTable
          clues={chunk?.easyClues}
          difficulty="Easy"
          updateClues={
            editMode ? (clues: Clue[]) => updateClues('Easy', clues) : undefined
          }
        />
      </div>

      <div>
        <ClueTable
          clues={chunk?.mediumClues}
          difficulty="Medium"
          updateClues={
            editMode
              ? (clues: Clue[]) => updateClues('Medium', clues)
              : undefined
          }
        />
      </div>

      <div>
        <ClueTable
          clues={chunk?.hardClues}
          difficulty="Hard"
          updateClues={
            editMode ? (clues: Clue[]) => updateClues('Hard', clues) : undefined
          }
        />
      </div>

      <div>
        <ClueTable
          clues={chunk?.eliteClues}
          difficulty="Elite"
          updateClues={
            editMode
              ? (clues: Clue[]) => updateClues('Elite', clues)
              : undefined
          }
        />
      </div>

      <div>
        <ClueTable
          clues={chunk?.masterClues}
          difficulty="Master"
          updateClues={
            editMode
              ? (clues: Clue[]) => updateClues('Master', clues)
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default ChunkModal;
