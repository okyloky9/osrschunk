import Chunk from '../models/chunk';

import chunkJson from './chunk-data.json';

class ChunkData {
  private chunkMap = new Map<string, Chunk>();

  constructor(chunks: Chunk[]) {
    for (const chunk of chunks) {
      this.chunkMap.set(`${chunk.x},${chunk.y}`, chunk);
    }
  }

  public getChunk(x: number, y: number): Chunk | undefined {
    return this.chunkMap.get(`${x},${y}`);
  }
}

const chunkData = new ChunkData(chunkJson);

export default chunkData;
