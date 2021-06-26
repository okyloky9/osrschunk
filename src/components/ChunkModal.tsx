import ClueTable from './ClueTable';
import type { ChunkData } from '../models';

const ChunkModal: React.FC<{ chunk: ChunkData }> = ({ chunk }) => {
  return (
    <div id="chunk-modal">
      <h1>
        Chunk ({chunk.x}, {chunk.y})
      </h1>

      <div>
        <ClueTable clues={chunk.beginnerClues} difficulty="Beginner" />
      </div>
      <div>
        <ClueTable clues={chunk.easyClues} difficulty="Easy" />
      </div>
      <div>
        <ClueTable clues={chunk.mediumClues} difficulty="Medium" />
      </div>
      <div>
        <ClueTable clues={chunk.hardClues} difficulty="Hard" />
      </div>
      <div>
        <ClueTable clues={chunk.eliteClues} difficulty="Elite" />
      </div>
      <div>
        <ClueTable clues={chunk.masterClues} difficulty="Master" />
      </div>
    </div>
  );
};

export default ChunkModal;
