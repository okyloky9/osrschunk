import { useEffect, useRef, useState } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';

import { ChunkTile, ClueIcon, Modal } from '.';
import type { ModalHandle } from '.';
import { ToggleSwitch } from './forms';
import { ChunkData, ClueDifficulty, MapChunk } from '../models';
import { capitalizeFirstLetter, createClassString, getChunk } from '../utils';
import ChunkModal from './ChunkModal';

function initChunks(width: number, height: number): MapChunk[][] {
  const chunks: MapChunk[][] = [];

  for (let y = 0; y < height; y++) {
    chunks.push([]);

    for (let x = 0; x < width; x++) {
      chunks[y].push(new MapChunk(x, y));
    }
  }

  return chunks;
}

export default function Map() {
  // map dimensions (in chunks)
  const width = 43;
  const height = 25;

  // modal ref
  const modal = useRef<ModalHandle>(null);

  // chunk map
  const [chunks] = useState(initChunks(width, height));
  const [selectedChunk, setSelectedChunk] = useState<MapChunk>();

  // window dimensions
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // settings
  const [showSidebar, setShowSideBar] = useState(false);
  const [showCoords, setShowCoords] = useState(false);
  const [showClues, setShowClues] = useState(true);
  const [showClueCounts, setShowClueCounts] = useState(true);
  const [clueDifficultiesToShow, setClueDifficultiesToShow] = useState<{
    [difficulty: string]: boolean;
  }>({
    beginner: true,
    easy: true,
    medium: true,
    hard: true,
    elite: true,
    master: true,
  });
  const [highlightChunksWithoutClues, setHighlightChunksWithoutClues] =
    useState(false);

  // min scale calculations
  const minWidthScale = windowDimensions.width / (width * 192);
  const minHeightScale = windowDimensions.height / (height * 192);

  const minScale =
    minWidthScale > minHeightScale ? minWidthScale : minHeightScale;

  // view state
  const [view, setView] = useState({
    scale: minScale,
    translation: { x: 0, y: 0 },
  });

  // on load
  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
  }, []);

  // when chunk is selected or deselected
  useEffect(() => {
    if (!modal.current) return;

    if (selectedChunk) {
      modal.current.open();
    } else {
      modal.current.close();
    }
  }, [modal, selectedChunk]);

  // get selected chunk data
  const selectedChunkData = selectedChunk
    ? getChunk(selectedChunk.x, selectedChunk.y)
    : undefined;

  // get current view scale
  const { scale } = view;

  return (
    <>
      <MapInteractionCSS
        value={view}
        onChange={setView}
        translationBounds={{
          xMax: 0,
          yMax: 0,
          xMin: -(width * 192 * scale) + windowDimensions.width,
          yMin: -(height * 192 * scale) + windowDimensions.height,
        }}
        minScale={minScale}
      >
        <table
          id="map"
          cellSpacing={0}
          cellPadding={0}
          className={createClassString({
            'show-coords': showCoords,
            'show-clues': showClues,
            'show-clue-counts': showClues && showClueCounts,
            ...Object.entries(clueDifficultiesToShow).reduce(
              (o, [difficulty, enabled]) => ({
                ...o,
                [`show-${difficulty}-clues`]: showClues && enabled,
              }),
              {}
            ),
            'highlight-chunks-without-clues': highlightChunksWithoutClues,
            'zoomed-in': scale > 1,
          })}
        >
          <tbody>
            {chunks.map((row, y) => (
              <tr key={`row-${y}`}>
                {row.map((chunk, x) => (
                  <ChunkTile
                    chunk={chunk}
                    onClick={() => setSelectedChunk(chunk)}
                    key={`chunk-${x}-${y}`}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </MapInteractionCSS>

      <div className="controls pin-top-left">
        {showSidebar ? (
          <div id="sidebar">
            <div className="controls pin-top-right">
              <button
                onClick={() => setShowSideBar(false)}
                aria-label="Hide sidebar"
              >
                &lt;
              </button>
            </div>

            <form>
              <h1>Settings</h1>

              <div>
                <ToggleSwitch
                  checked={showCoords}
                  onChange={(e) => setShowCoords(e.target.checked)}
                >
                  Show chunk coords
                </ToggleSwitch>
              </div>

              {showClues && <hr />}

              <div>
                <ToggleSwitch
                  checked={showClues}
                  onChange={(e) => setShowClues(e.target.checked)}
                >
                  Show clues
                </ToggleSwitch>
              </div>

              {showClues && (
                <>
                  <div>
                    <ToggleSwitch
                      checked={showClueCounts}
                      onChange={(e) => setShowClueCounts(e.target.checked)}
                    >
                      Show clue counts
                    </ToggleSwitch>
                  </div>

                  {Object.entries(clueDifficultiesToShow).map(
                    ([difficulty, enabled]) => (
                      <div key={`toggle-clue-difficulty-${difficulty}`}>
                        <ToggleSwitch
                          checked={enabled}
                          onChange={(e) =>
                            setClueDifficultiesToShow({
                              ...clueDifficultiesToShow,
                              [difficulty]: e.target.checked,
                            })
                          }
                        >
                          Show {difficulty} clues{' '}
                          <ClueIcon
                            difficulty={
                              capitalizeFirstLetter(
                                difficulty
                              ) as ClueDifficulty
                            }
                          />
                        </ToggleSwitch>
                      </div>
                    )
                  )}

                  <hr />
                </>
              )}

              <div>
                <ToggleSwitch
                  checked={highlightChunksWithoutClues}
                  onChange={(e) =>
                    setHighlightChunksWithoutClues(e.target.checked)
                  }
                >
                  Highlight chunks without clues
                </ToggleSwitch>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowSideBar(true)}
            aria-label="Show sidebar"
          >
            &gt;
          </button>
        )}
      </div>

      <div className="controls pin-bottom-right margin">
        <button
          onClick={() =>
            setView({ scale: minScale, translation: { x: 0, y: 0 } })
          }
        >
          zoom out
        </button>
      </div>

      <Modal onClose={() => setSelectedChunk(undefined)} ref={modal}>
        <ChunkModal
          chunk={
            selectedChunkData ? selectedChunkData : (selectedChunk as ChunkData)
          }
        />
      </Modal>
    </>
  );
}
