import { useEffect, useState } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';

import { ToggleSwitch } from './forms';
import { listHasChunk } from './utils';
import { Chunk } from './models';
import chunkData from './data/chunk_data.json';

function initChunks(width: number, height: number): Chunk[][] {
  const chunks: Chunk[][] = [];

  for (let y = 0; y < height; y++) {
    chunks.push([]);

    for (let x = 0; x < width; x++) {
      chunks[y].push(new Chunk());
    }
  }

  return chunks;
}

export default function Map() {
  const width = 43;
  const height = 25;

  // chunk map
  const [chunks, setChunks] = useState(initChunks(width, height));

  // view and window dimensions
  const [view, setView] = useState({ scale: 1.2, translation: { x: 0, y: 0 } });
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // settings
  const [showSidebar, setShowSideBar] = useState(false);
  const [showCoords, setShowCoords] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
  }, []);

  const { scale } = view;

  const minWidthScale = windowDimensions.width / (width * 192);
  const minHeightScale = windowDimensions.height / (height * 192);

  const minScale =
    minWidthScale > minHeightScale ? minWidthScale : minHeightScale;

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
          className={scale > 1 ? 'zoomed-in' : ''}
        >
          <tbody>
            {chunks.map((row, y) => (
              <tr key={`row-${y}`}>
                {row.map((chunk, x) => (
                  <td
                    className={
                      listHasChunk(chunkData.impossible, [x, y])
                        ? 'impossible'
                        : undefined
                    }
                    key={`chunk-${x}-${y}`}
                  >
                    {showCoords && (
                      <>
                        ({x}, {y})
                      </>
                    )}
                  </td>
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
              <ToggleSwitch
                checked={showCoords}
                onChange={(e) => setShowCoords(e.target.checked)}
              >
                Show Chunk Coords
              </ToggleSwitch>
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
    </>
  );
}
