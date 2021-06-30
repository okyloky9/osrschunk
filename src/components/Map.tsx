import { useContext, useEffect, useRef, useState } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import { toast } from 'react-toastify';

import { ChunkModal, ChunkTile, ClueIcon, Modal } from '.';
import type { ModalHandle } from '.';
import { ToggleSwitch } from './forms';
import { ClueDifficulty, MapChunk } from '../models';
import { capitalizeFirstLetter, createClassString } from '../utils';
import { ChunkDataContext } from '../data';

const SETTINGS_KEY = 'SETTINGS';

function initMapChunks(width: number, height: number): MapChunk[][] {
  const mapChunks: MapChunk[][] = [];

  for (let y = 0; y < height; y++) {
    mapChunks.push([]);

    for (let x = 0; x < width; x++) {
      mapChunks[y].push(new MapChunk(x, y));
    }
  }

  return mapChunks;
}

export default function Map() {
  // map dimensions (in chunks)
  const width = 43;
  const height = 25;

  // chunk data
  const {
    exportChunkData,
    clearLocalStorageChunkData,
    saveChunkDataToLocalStorage,
  } = useContext(ChunkDataContext);

  // modal ref
  const modal = useRef<ModalHandle>(null);

  // chunk map
  const [mapChunks] = useState(initMapChunks(width, height));
  const [selectedMapChunk, setSelectedMapChunk] = useState<MapChunk>();

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
  const [editMode, setEditMode] = useState(false);

  // on load
  useEffect(() => {
    // whenever the window is resized, up the windows dimensions state
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    // load settings from local storage
    const settingsJson = localStorage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      const settings = JSON.parse(settingsJson);

      setShowCoords(settings.showCoords);
      setShowClues(settings.showClues);
      setShowClueCounts(settings.showClueCounts);
      setClueDifficultiesToShow(settings.clueDifficultiesToShow);
      setHighlightChunksWithoutClues(settings.highlightChunksWithoutClues);
      setEditMode(settings.editMode);
    }
  }, []);

  // save settings on changes
  useEffect(() => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        showCoords,
        showClues,
        showClueCounts,
        clueDifficultiesToShow,
        highlightChunksWithoutClues,
        editMode,
      })
    );
  }, [
    showCoords,
    showClues,
    showClueCounts,
    clueDifficultiesToShow,
    highlightChunksWithoutClues,
    editMode,
  ]);

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

  // when map chunk is selected or deselected
  useEffect(() => {
    if (!modal.current) return;

    if (selectedMapChunk) {
      modal.current.open();
    } else {
      modal.current.close();
    }
  }, [modal, selectedMapChunk]);

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
            {mapChunks.map((row, y) => (
              <tr key={`row-${y}`}>
                {row.map((mapChunk, x) => (
                  <ChunkTile
                    mapChunk={mapChunk}
                    onClick={() => setSelectedMapChunk(mapChunk)}
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

              <hr />

              <div>
                <ToggleSwitch
                  checked={editMode}
                  onChange={(e) => setEditMode(e.target.checked)}
                >
                  Data editing mode
                </ToggleSwitch>
              </div>

              {editMode && (
                <>
                  <br />

                  <div>
                    <button
                      className="success"
                      type="button"
                      onClick={() => {
                        saveChunkDataToLocalStorage();
                        toast('💾 Chunk data saved locally!', {
                          type: 'success',
                        });
                      }}
                    >
                      Save chunk data locally
                    </button>
                  </div>

                  <br />

                  <div>
                    <button
                      className="info"
                      type="button"
                      onClick={() => {
                        exportChunkData();
                        toast('✅ Chunk data exported!', {
                          type: 'success',
                        });
                      }}
                    >
                      Export chunk-data.json
                    </button>
                  </div>

                  <br />

                  <div>
                    <button
                      className="danger"
                      type="button"
                      onClick={() => {
                        clearLocalStorageChunkData();
                        toast(
                          <>
                            🗑 Local data has been cleared!
                            <br />
                            Now viewing the hosted data.
                          </>,
                          { type: 'info' }
                        );
                      }}
                    >
                      Reset local chunk data
                      <br />
                      (cannot be undone)
                    </button>
                  </div>
                </>
              )}
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

      <Modal onClose={() => setSelectedMapChunk(undefined)} ref={modal}>
        {selectedMapChunk && (
          <ChunkModal chunkCoords={selectedMapChunk} editMode={editMode} />
        )}
      </Modal>
    </>
  );
}
