import React, { createContext, ReactNode, useState } from 'react';

import Chunk from '../models/chunk';
import chunkJson from './chunk-data.json';

function coords(x: number, y: number): string {
  return `${x},${y}`;
}

const chunkMap = new Map<string, Chunk>();

for (const chunk of chunkJson) {
  chunkMap.set(coords(chunk.x, chunk.y), chunk);
}

const ChunkDataContext = createContext<{
  exportChunkData: () => void;
  getChunk: (x: number, y: number) => Chunk | undefined;
  setChunk: (x: number, y: number, chunk: Chunk) => void;
}>(null as any);

const ChunkDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chunkData, setChunkData] = useState(chunkMap);

  function getChunk(x: number, y: number): Chunk | undefined {
    return chunkData.get(coords(x, y));
  }

  function setChunk(x: number, y: number, chunk: Chunk) {
    const _chunkData = new Map(chunkData);
    _chunkData.set(coords(x, y), chunk);
    setChunkData(_chunkData);
  }

  function exportChunkData() {
    const chunks = Array.from(chunkData.values());
    const json = JSON.stringify(chunks);

    const blob = new Blob([json], { type: 'application/json' });

    const anchor = document.createElement('a');
    anchor.download = 'chunk-data.json';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();

    anchor.remove();
  }

  return (
    <ChunkDataContext.Provider
      value={{
        exportChunkData,
        getChunk,
        setChunk,
      }}
    >
      {children}
    </ChunkDataContext.Provider>
  );
};

export { ChunkDataContext, ChunkDataProvider };
