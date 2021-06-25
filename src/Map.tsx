import { useEffect, useState } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';

import Chunk from './Chunk';

function initChunks(width: number, height: number) {
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

  const [chunks, setChunks] = useState(initChunks(width, height));
  const [view, setView] = useState({ scale: .5, translation: { x: 0, y: 0 } });
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
  }, []);

  const { scale } = view;

  const minScale = dimensions.width / (width * 192);

  return (
    <>
      <MapInteractionCSS
        value={view}
        onChange={setView}
        translationBounds={{
          xMax: 0,
          yMax: 0,
          xMin: -(width * 192 * scale) + dimensions.width,
          yMin: -(height * 192 * scale) + dimensions.height,
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
                  <td key={`chunk-${x}-${y}`}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </MapInteractionCSS>

      <div id="controls">
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
