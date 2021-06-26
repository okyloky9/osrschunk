import { useEffect, useRef } from 'react';

import chunkData from '../data/chunk_data.json';
import { createClassString, listHasChunk } from '../utils';
import { Chunk } from '../models';

const ChunkTile: React.FC<{
  chunk: Chunk;
  onClick?: () => void;
  showCoords?: boolean;
}> = ({ chunk, onClick, showCoords = false }) => {
  const tdRef = useRef<HTMLTableDataCellElement>(null);

  // state for when the mouse left button is held down
  const mouseDownRef = useRef(false);
  const setMouseDown = (d: boolean) => {
    mouseDownRef.current = d;
  };

  // state for how much the mouse has moved while the left button is held down
  const moveDistanceRef = useRef(0);
  const setMoveDistance = (d: number) => {
    moveDistanceRef.current = d;
  };

  function resetMouseState() {
    setMoveDistance(0);
    setMouseDown(false);
  }

  function mouseDownHandler(e: MouseEvent) {
    // if the left mouse button was pressed
    if (e.button === 0) setMouseDown(true);
  }

  function mouseUpHandler(e: MouseEvent) {
    // if the left mouse button was released
    if (mouseDownRef.current && e.button === 0) {
      // only trigger `onClick` when the user isn't moving the map
      if (onClick && moveDistanceRef.current <= 10) {
        onClick();
      }

      resetMouseState();
    }
  }

  function mouseMoveHandler(e: MouseEvent) {
    // do nothing if the left mouse button isn't held down
    if (!mouseDownRef.current) return;

    const a = e.movementX;
    const b = e.movementY;

    setMoveDistance(moveDistanceRef.current + Math.sqrt(a * a + b * b));
  }

  useEffect(() => {
    const tdEl = tdRef.current;
    if (!tdEl) return;

    tdEl.addEventListener('mousedown', mouseDownHandler);
    tdEl.addEventListener('mouseup', mouseUpHandler);

    tdEl.addEventListener('mousemove', mouseMoveHandler);

    tdEl.addEventListener('mouseenter', resetMouseState);
    tdEl.addEventListener('mouseleave', resetMouseState);
  }, [tdRef]);

  return (
    <td
      className={createClassString({
        impossible: listHasChunk(chunkData.impossible, [chunk.x, chunk.y]),
      })}
      ref={tdRef}
    >
      <span className="chunk-coords">
        ({chunk.x}, {chunk.y})
      </span>
    </td>
  );
};

export default ChunkTile;
