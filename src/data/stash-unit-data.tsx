import React, { createContext, ReactNode, useState } from 'react';

import type { StashUnitChunk } from '../models';
import stashUnitJson from './stash-unit-data.json';

const StashUnitDataContext = createContext<{
  getStashUnitChunk: (x: number, y: number) => StashUnitChunk | undefined;
}>(null as any);

const StashUnitDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stashUnitData] = useState(stashUnitChunkArrayToMap(stashUnitJson));

  function coords(x: number, y: number): string {
    return `${x},${y}`;
  }

  function stashUnitChunkArrayToMap(chunks: StashUnitChunk[]) {
    const stashUnitChunkMap = new Map<string, StashUnitChunk>();

    for (const chunk of chunks) {
      stashUnitChunkMap.set(coords(chunk.x, chunk.y), chunk);
    }

    return stashUnitChunkMap;
  }

  function getStashUnitChunk(x: number, y: number): StashUnitChunk | undefined {
    return stashUnitData.get(coords(x, y));
  }

  return (
    <StashUnitDataContext.Provider value={{ getStashUnitChunk }}>
      {children}
    </StashUnitDataContext.Provider>
  );
};

export { StashUnitDataContext, StashUnitDataProvider };
