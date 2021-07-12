import { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MapInteractionCSS } from 'react-map-interaction';
import { toast } from 'react-toastify';
import qs from 'qs';

import { ChunkModal, ChunkTile, ClueIcon, Modal } from '.';
import type { ModalHandle } from '.';
import { ToggleSwitch } from './forms';
import type { ClueDifficulty, View } from '../models';
import { MapChunk } from '../models';
import {
  capitalizeFirstLetter,
  compressUnlockedChunks,
  createClassString,
  decompressUnlockedChunks,
} from '../utils';
import { ChunkDataContext } from '../data';

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
  const SETTINGS_KEY = 'SETTINGS';
  const UNLOCKED_CHUNKS_KEY = 'UNLOCKED_CHUNKS';
  const ZOOM_AND_PAN_KEY = 'ZOOM_AND_PAN';
  const INFO_MODAL_KEY = 'INFO_MODAL';

  // map dimensions (in chunks)
  const width = 43;
  const height = 25;

  // chunk data
  const {
    exportChunkData,
    clearLocalStorageChunkData,
    saveChunkDataToLocalStorage,
  } = useContext(ChunkDataContext);

  // loading ref
  const loadingRef = useRef(true);

  // modals ref
  const chunkModal = useRef<ModalHandle>(null);
  const infoModal = useRef<ModalHandle>(null);

  // chunk map
  const [mapChunks, _setMapChunks] = useState(initMapChunks(width, height));
  const mapChunksRef = useRef(mapChunks);
  const setMapChunks = (m: MapChunk[][]) => {
    mapChunksRef.current = m;
    _setMapChunks(m);
  };

  const [selectedMapChunk, setSelectedMapChunk] = useState<MapChunk>();

  // window dimensions
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // interval(s)
  const [autoSaveInterval, setAutoSaveInterval] = useState<number>();

  // min scale calculations
  const minWidthScale = windowDimensions.width / (width * 192);
  const minHeightScale = windowDimensions.height / (height * 192);

  const minScale =
    minWidthScale > minHeightScale ? minWidthScale : minHeightScale;

  // view state
  const [view, _setView] = useState<View>({
    scale: minScale,
    translation: { x: 0, y: 0 },
  });
  const viewRef = useRef(view);
  const setView = (v: View) => {
    viewRef.current = v;
    _setView(v);
  };

  // get current view scale
  const { scale } = view;

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
  const [hideChunksWithoutClues, setHideChunksWithoutClues] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [chunkLockUnlockMode, _setChunkLockUnlockMode] = useState(false);
  const chunkLockUnlockModeRef = useRef(chunkLockUnlockMode);
  const setChunkLockUnlockMode = (m: boolean) => {
    chunkLockUnlockModeRef.current = m;
    _setChunkLockUnlockMode(m);
  };

  // check if all chunks are unlocked
  const allChunksUnlocked = (() => {
    for (const chunkRow of mapChunks) {
      for (const chunk of chunkRow) {
        if (!chunk.unlocked) {
          return false;
        }
      }
    }

    return true;
  })();

  // save settings on changes
  useEffect(() => {
    if (loadingRef.current) return;

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        showCoords,
        showClues,
        showClueCounts,
        clueDifficultiesToShow,
        highlightChunksWithoutClues,
        hideChunksWithoutClues,
        editMode,
      })
    );
  }, [
    showCoords,
    showClues,
    showClueCounts,
    clueDifficultiesToShow,
    highlightChunksWithoutClues,
    hideChunksWithoutClues,
    editMode,
  ]);

  // when edit mode is toggled
  useEffect(() => {
    if (editMode && !autoSaveInterval) {
      // setup interval for saving to local storage
      const fiveMinutesInMilliseconds = 5 * 60 * 1000;

      const intervalId = setInterval(() => {
        saveChunkDataToLocalStorage();
        toast('💾 Automatically saved chunk data locally!', {
          type: 'success',
        });
      }, fiveMinutesInMilliseconds) as any as number;

      setAutoSaveInterval(intervalId);
    } else if (!editMode && autoSaveInterval) {
      // clear auto save interval
      clearInterval(autoSaveInterval);
      setAutoSaveInterval(undefined);
    }
  }, [editMode, autoSaveInterval]);

  // when map chunk is selected or deselected
  useEffect(() => {
    if (!chunkModal.current) return;

    if (selectedMapChunk) {
      chunkModal.current.open();
    } else {
      chunkModal.current.close();
    }
  }, [chunkModal, selectedMapChunk]);

  // when a chunk's unlocked state is toggled
  useEffect(() => {
    if (loadingRef.current) return;

    if (allChunksUnlocked) {
      localStorage.removeItem(UNLOCKED_CHUNKS_KEY);
      return;
    }

    const unlocked = mapChunks
      .reduce((unlocks, chunkRow) => {
        unlocks.push(...chunkRow.filter((chunk) => chunk.unlocked));
        return unlocks;
      }, [])
      .map((chunk) => ({ x: chunk.x, y: chunk.y }));

    localStorage.setItem(UNLOCKED_CHUNKS_KEY, JSON.stringify(unlocked));
  }, [mapChunks]);

  // show info modal (if it's the first time opening the app)
  useEffect(() => {
    if (!infoModal.current) return;

    const showModal = localStorage.getItem(INFO_MODAL_KEY);
    if (!showModal) {
      infoModal.current?.open();
    }
  }, [infoModal]);

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

    // save zoom and pan when page is closed
    function handleUnload() {
      localStorage.setItem(ZOOM_AND_PAN_KEY, JSON.stringify(viewRef.current));
    }

    window.addEventListener('beforeunload', handleUnload);

    // load settings from local storage
    const settingsJson = localStorage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      const settings = JSON.parse(settingsJson);

      setShowCoords(settings.showCoords);
      setShowClues(settings.showClues);
      setShowClueCounts(settings.showClueCounts);
      setClueDifficultiesToShow(settings.clueDifficultiesToShow);
      setHighlightChunksWithoutClues(settings.highlightChunksWithoutClues);
      setHideChunksWithoutClues(settings.hideChunksWithoutClues);
      setEditMode(settings.editMode);
    }

    // load zoom and pan from local storage
    const zoomAndPanJson = localStorage.getItem(ZOOM_AND_PAN_KEY);
    if (zoomAndPanJson) {
      const zoomAndPan = JSON.parse(zoomAndPanJson);
      setView(zoomAndPan);
    }

    // load unlocked chunks from local storage (or URL)
    function loadUnlockedChunks(unlockedChunks: { x: number; y: number }[]) {
      for (const chunkRow of mapChunksRef.current) {
        for (const chunk of chunkRow) {
          chunk.unlocked = false;
        }
      }

      for (const chunk of unlockedChunks) {
        mapChunksRef.current[chunk.y][chunk.x] = { ...chunk, unlocked: true };
      }

      setMapChunks(mapChunksRef.current);
    }

    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    if (query && query.u) {
      const unlockedChunks = decompressUnlockedChunks(
        width,
        height,
        query.u as string
      );
      loadUnlockedChunks(unlockedChunks);
    } else {
      const unlockedChunksJson = localStorage.getItem(UNLOCKED_CHUNKS_KEY);

      if (unlockedChunksJson) {
        const unlockedChunks = JSON.parse(unlockedChunksJson);
        loadUnlockedChunks(unlockedChunks);
      }
    }

    loadingRef.current = false;
  }, []);

  function dismissInfoModal() {
    localStorage.setItem(INFO_MODAL_KEY, 'shown');
  }

  // functions for chunk locking/unlocking
  function toggleAllChunksLockState() {
    const _mapChunks: MapChunk[][] = [];

    for (const chunkRow of mapChunks) {
      const _chunkRow: MapChunk[] = [];

      for (const chunk of chunkRow) {
        _chunkRow.push({
          ...chunk,
          unlocked: !allChunksUnlocked,
        });
      }

      _mapChunks.push(_chunkRow);
    }

    setMapChunks(_mapChunks);
  }

  function toggleChunkLocking(mapChunk: MapChunk) {
    const _mapChunks: MapChunk[][] = [];

    for (const chunkRow of mapChunksRef.current) {
      const _chunkRow = [...chunkRow];

      const matchingChunkIndex = _chunkRow.findIndex(
        (c) => c.x === mapChunk.x && c.y === mapChunk.y
      );

      if (matchingChunkIndex >= 0) {
        const matchingChunk = _chunkRow[matchingChunkIndex];

        _chunkRow.splice(matchingChunkIndex, 1, {
          ...matchingChunk,
          unlocked: !matchingChunk.unlocked,
        });
      }

      _mapChunks.push(_chunkRow);
    }

    setMapChunks(_mapChunks);
  }

  function createShareableLink() {
    const unlockedChunksJson = localStorage.getItem(UNLOCKED_CHUNKS_KEY);
    if (unlockedChunksJson) {
      const unlockedChunks = JSON.parse(unlockedChunksJson);
      const compressed = compressUnlockedChunks(width, height, unlockedChunks);

      const { location } = window;
      const link = `${location.protocol}//${location.host}${location.pathname}?u=${compressed}`;

      const textarea = document.createElement('textarea');
      textarea.className = 'hidden';
      textarea.value = link;

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');

      document.body.removeChild(textarea);

      toast('📋 Copied shareable link to the clipboard!', { type: 'success' });
    } else {
      toast(
        <>
          ❌ Could not create sharable link.
          <br />
          You must create data to share first.
        </>,
        { type: 'error' }
      );
    }
  }

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
            'hide-chunks-without-clues': hideChunksWithoutClues,
            'has-locked-chunks': !allChunksUnlocked,
            'zoomed-in': scale > 1,
          })}
        >
          <tbody>
            {mapChunks.map((row, y) => (
              <tr key={`row-${y}`}>
                {row.map((mapChunk, x) => (
                  <ChunkTile
                    mapChunk={mapChunk}
                    onClick={() => {
                      if (chunkLockUnlockModeRef.current) {
                        toggleChunkLocking(mapChunk);
                      } else {
                        setSelectedMapChunk(mapChunk);
                      }
                    }}
                    key={`chunk-${x}-${y}-${mapChunk.unlocked}`}
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
            <div className="controls pin-top-left">
              <button
                id="sidebar-button"
                onClick={() => setShowSideBar(false)}
                aria-label="Hide sidebar"
              >
                <FontAwesomeIcon icon="arrow-left" />
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
                  onChange={(e) => {
                    setHighlightChunksWithoutClues(e.target.checked);

                    if (e.target.checked) {
                      setHideChunksWithoutClues(false);
                    }
                  }}
                >
                  Highlight chunks without clues
                </ToggleSwitch>
              </div>

              <div>
                <ToggleSwitch
                  checked={hideChunksWithoutClues}
                  onChange={(e) => {
                    setHideChunksWithoutClues(e.target.checked);

                    if (e.target.checked) {
                      setHighlightChunksWithoutClues(false);
                    }
                  }}
                >
                  Hide chunks without clues
                </ToggleSwitch>
              </div>

              <hr />

              <div>
                <ToggleSwitch
                  checked={chunkLockUnlockMode}
                  onChange={(e) => {
                    setChunkLockUnlockMode(e.target.checked);

                    if (e.target.checked) {
                      setEditMode(false);
                    }
                  }}
                >
                  Chunk locking/unlocking mode
                </ToggleSwitch>
              </div>

              {chunkLockUnlockMode && (
                <>
                  <div>
                    <button
                      className="info"
                      type="button"
                      onClick={toggleAllChunksLockState}
                    >
                      Lock/unlock all chunks
                    </button>
                  </div>

                  <div>
                    <button
                      className="success"
                      type="button"
                      onClick={createShareableLink}
                    >
                      Create shareable link
                    </button>
                  </div>
                </>
              )}

              <hr />

              <div>
                <ToggleSwitch
                  checked={editMode}
                  onChange={(e) => {
                    setEditMode(e.target.checked);

                    if (e.target.checked) {
                      setChunkLockUnlockMode(false);
                    }
                  }}
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
            id="sidebar-button"
            onClick={() => setShowSideBar(true)}
            aria-label="Show sidebar"
          >
            <FontAwesomeIcon icon="arrow-right" />
          </button>
        )}
      </div>

      <div className="controls pin-top-right margin">
        <button onClick={() => {}} aria-label="Show search">
          <FontAwesomeIcon icon="search" />
        </button>
      </div>

      <div className="controls pin-bottom-left margin">
        <button
          onClick={() => infoModal.current?.open()}
          aria-label="Show app info"
        >
          <FontAwesomeIcon icon="question" />
        </button>
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

      <Modal onClose={() => setSelectedMapChunk(undefined)} ref={chunkModal}>
        {selectedMapChunk && (
          <ChunkModal chunkCoords={selectedMapChunk} editMode={editMode} />
        )}
      </Modal>

      <Modal onClose={dismissInfoModal} ref={infoModal}>
        <div className="info-modal">
          <h1>OSRS Chunk Map</h1>
          <p>
            This is a tool for viewing what clues are available within each map
            chunk of Old School RuneScape.
          </p>
          <h2>Features</h2>
          <ul>
            <li>Click and move your mouse to pan.</li>
            <li>Use your mouse's scroll wheel to zoom in and out.</li>
            <li>Click on a chunk to show the clue data for that chunk.</li>
            <li>
              Turn on "Chunk locking/unlocking mode" then click a chunk to
              toggle whether it is locked or unlocked.
              <ul>
                <li>
                  Use the "Lock/unlock all chunks" button to toggle the state of
                  all chunks.
                </li>
                <li>Unlocked chunks will be saved locally.</li>
                <li>
                  Press "Create shareable link" to create a link that you can
                  share with others.
                </li>
                <li>
                  Opening a shared link will NOT overwrite your local data
                  UNLESS you start making changes.
                </li>
              </ul>
            </li>

            <li>
              Turn on "Data editing mode" via the sidebar to make corrections or
              additions. Edits are saved locally.
              <ul>
                <li>
                  If you would like to submit a correction or addition to the
                  data, use the "Export chunk-data.json" button and upload the
                  file attached to a{' '}
                  <a
                    href="https://github.com/okyloky9/osrschunk/issues/new"
                    target="_blank"
                  >
                    new issue
                  </a>
                  .
                </li>
              </ul>
            </li>
          </ul>
          <h2>Contributing</h2>

          <p>
            The source code for this project can be found{' '}
            <a href="https://github.com/okyloky9/osrschunk" target="_blank">
              here
            </a>
            .
          </p>
          <p>
            If you see a mistake or would like to request a feature, please{' '}
            <a
              href="https://github.com/okyloky9/osrschunk/issues/new"
              target="_blank"
            >
              let us know
            </a>
            .
          </p>
        </div>
      </Modal>
    </>
  );
}
