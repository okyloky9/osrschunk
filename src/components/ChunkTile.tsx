import { useEffect, useRef } from 'react';

import ClueIcon from './ClueIcon';
import {
  capitalizeFirstLetter,
  chunkHasClues,
  clueCountsForChunk,
  createClassString,
} from '../utils';
import { ClueDifficulty, MapChunk } from '../models';
import chunkData from '../data';

const ChunkTile: React.FC<{
  mapChunk: MapChunk;
  onClick?: () => void;
}> = ({ mapChunk, onClick }) => {
  const chunk = chunkData.getChunk(mapChunk.x, mapChunk.y);

  const tdRef = useRef<HTMLTableCellElement>(null);

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

  // mobile initial touch point
  const initialTouchRef = useRef({ x: 0, y: 0 });
  const setInitialTouch = (t: { x: number; y: number }) => {
    initialTouchRef.current = t;
  };

  function resetMouseState() {
    setMoveDistance(0);
    setInitialTouch({ x: 0, y: 0 });
    setMouseDown(false);
  }

  function mouseDownHandler(e: MouseEvent | TouchEvent) {
    const mobilePress = e.type === 'touchstart';

    // if the left mouse button was pressed
    if (mobilePress || (e as MouseEvent).button === 0) {
      if (mobilePress) {
        const touch = (e as TouchEvent).touches[0];
        setInitialTouch({ x: touch.pageX, y: touch.pageY });
      }
      setMouseDown(true);
    }
  }

  function mouseUpHandler(e: MouseEvent | TouchEvent) {
    // if the left mouse button was released
    if (
      mouseDownRef.current &&
      (e.type === 'touchend' || (e as MouseEvent).button === 0)
    ) {
      // only trigger `onClick` when the user isn't moving the map
      if (onClick && moveDistanceRef.current <= 10) {
        onClick();
      }

      resetMouseState();
    }
  }

  function mouseMoveHandler(e: MouseEvent | TouchEvent) {
    // do nothing if the left mouse button isn't held down
    if (!mouseDownRef.current) return;

    function distance(a: number, b: number) {
      return Math.sqrt(a * a + b * b);
    }

    if (e.type === 'mousemove') {
      const mouseEvent = e as MouseEvent;

      const a = mouseEvent.movementX;
      const b = mouseEvent.movementY;

      setMoveDistance(moveDistanceRef.current + distance(a, b));
    } else if (e.type === 'touchmove') {
      const touch = (e as TouchEvent).touches[0];

      const a = touch.pageX - initialTouchRef.current.x;
      const b = touch.pageY - initialTouchRef.current.y;

      setMoveDistance(distance(a, b));
    }
  }

  useEffect(() => {
    const tdEl = tdRef.current;
    if (!tdEl) return;

    // desktop
    tdEl.addEventListener('mousedown', mouseDownHandler);
    tdEl.addEventListener('mouseup', mouseUpHandler);

    tdEl.addEventListener('mousemove', mouseMoveHandler);

    tdEl.addEventListener('mouseenter', resetMouseState);
    tdEl.addEventListener('mouseleave', resetMouseState);

    // mobile
    tdEl.addEventListener('touchstart', mouseDownHandler);
    tdEl.addEventListener('touchend', mouseUpHandler);

    tdEl.addEventListener('touchmove', mouseMoveHandler);

    tdEl.addEventListener('touchcancel', resetMouseState);
  }, [tdRef]);

  // get clue counts
  const clueCounts = clueCountsForChunk(chunk);

  return (
    <td
      className={createClassString({
        'no-clues': !chunkHasClues(chunk),
      })}
      ref={tdRef}
    >
      <div className="chunk-tile">
        <div>
          <div className="chunk-coords">
            ({mapChunk.x}, {mapChunk.y})
          </div>

          <div className="chunk-clues-and-counts">
            {Object.entries(clueCounts)
              .filter(([_, value]) => value)
              .map(([difficulty, count]) => (
                <div className={difficulty} key={`clue-count-${difficulty}`}>
                  <ClueIcon
                    difficulty={
                      capitalizeFirstLetter(difficulty) as ClueDifficulty
                    }
                  />
                  <span className="clue-count">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </td>
  );
};

export default ChunkTile;
