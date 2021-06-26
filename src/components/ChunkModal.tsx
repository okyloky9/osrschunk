import ClueTable from './ClueTable';
import type { ChunkData } from '../models';

const ChunkModal: React.FC<{ chunk: ChunkData }> = ({ chunk }) => {
  return (
    <div id="chunk-modal">
      <h1>
        Chunk ({chunk.x}, {chunk.y})
      </h1>

      <ClueTable clues={chunk.beginnerClues} difficulty="Beginner" />
      <ClueTable clues={chunk.easyClues} difficulty="Easy" />
      <ClueTable clues={chunk.mediumClues} difficulty="Medium" />
      <ClueTable clues={chunk.hardClues} difficulty="Hard" />
      <ClueTable clues={chunk.eliteClues} difficulty="Elite" />
      <ClueTable clues={chunk.masterClues} difficulty="Master" />
    </div>
  );
};

export default ChunkModal;
