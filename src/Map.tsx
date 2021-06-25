import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

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

  return (
    <TransformWrapper minScale={0.1} limitToBounds={false}>
      {({ ...props }) => {
        const { setTransform, state } = props;
        const { scale } = state;

        return (
          <>
            <TransformComponent>
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
            </TransformComponent>

            <div id="controls">
              <button onClick={() => setTransform(0, 0, 0.15, 500, 'easeOut')}>
                zoom out
              </button>
            </div>
          </>
        );
      }}
    </TransformWrapper>
  );
}
