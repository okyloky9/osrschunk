import Chunk from '../models/chunk';

import chunkJson from './chunk-data.json';

class ChunkData {
  public chunks: Chunk[];

  constructor(chunks: Chunk[]) {
    this.chunks = chunks;
  }

  public getChunk(x: number, y: number): Chunk | undefined {
    return this.chunks.find((chunk) => chunk.x === x && chunk.y === y);
  }
}

const chunkData = new ChunkData(chunkJson);

export default chunkData;
