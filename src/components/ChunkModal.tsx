import { useContext } from 'react';

import ClueTable from './ClueTable';
import { ChunkDataContext } from '../data';

const ChunkModal: React.FC<{
  chunkCoords: { x: number; y: number };
  editMode: boolean;
}> = ({ chunkCoords, editMode }) => {
  const { getChunk, setChunk } = useContext(ChunkDataContext);

  const chunk = getChunk(chunkCoords.x, chunkCoords.y);

  return (
    <div id="chunk-modal">
      <h1>
        Chunk ({chunkCoords.x}, {chunkCoords.y})
      </h1>

      <div>
        <ClueTable
          clues={chunk?.beginnerClues}
          difficulty="Beginner"
          editMode={editMode}
        />
      </div>

      <div>
        <ClueTable
          clues={chunk?.easyClues}
          difficulty="Easy"
          editMode={editMode}
        />
      </div>

      <div>
        <ClueTable
          clues={chunk?.mediumClues}
          difficulty="Medium"
          editMode={editMode}
        />
      </div>

      <div>
        <ClueTable
          clues={chunk?.hardClues}
          difficulty="Hard"
          editMode={editMode}
        />
      </div>

      <div>
        <ClueTable
          clues={chunk?.eliteClues}
          difficulty="Elite"
          editMode={editMode}
        />
      </div>

      <div>
        <ClueTable
          clues={chunk?.masterClues}
          difficulty="Master"
          editMode={editMode}
        />
      </div>
    </div>
  );
};

export default ChunkModal;
