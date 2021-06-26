import ClueTable from './ClueTable';
import type { ChunkData } from '../models';

const ChunkModal: React.FC<{ chunk: ChunkData }> = ({ chunk }) => {
  return (
    <div id="chunk-modal">
      <h1>
        Chunk ({chunk.x}, {chunk.y})
      </h1>

      <ClueTable clues={chunk.beginnerClues} type="Beginner" />
      <ClueTable clues={chunk.easyClues} type="Easy" />
      <ClueTable clues={chunk.mediumClues} type="Medium" />
      <ClueTable clues={chunk.hardClues} type="Hard" />
      <ClueTable clues={chunk.eliteClues} type="Elite" />
      <ClueTable clues={chunk.masterClues} type="Master" />
    </div>
  );
};

export default ChunkModal;
