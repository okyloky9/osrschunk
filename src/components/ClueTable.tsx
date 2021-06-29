import React from 'react';
import ReactTooltip from 'react-tooltip';

import { Clue, ClueDifficulty } from '../models';
import ClueIcon from './ClueIcon';

const ClueTable: React.FC<{
  clues: Clue[] | undefined;
  difficulty: ClueDifficulty;
  updateClues?: (clues: Clue[]) => void;
}> = ({ clues, difficulty, updateClues }) => {
  const editing = !!updateClues;

  const ClueHint = ({ hint }: { hint: string }) => {
    return hint && hint.startsWith('http') ? <img src={hint} /> : <>{hint}</>;
  };

  function updateClue(index: number, clue: Clue) {
    if (!clues || !updateClues) return;
    clues.splice(index, 1, clue);
    updateClues([...clues]);
  }

  return clues && clues.length ? (
    <>
      <h2>
        <ClueIcon difficulty={difficulty} />
        <span>{difficulty} Clues</span>
      </h2>

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Clue</th>
            <th>Solution</th>
            <th>Location</th>
            <th>Items</th>
            <th>Alternate Chunks</th>
          </tr>
        </thead>

        <tbody>
          {clues.map((clue, index) => {
            const {
              alternateChunks,
              clueHint,
              itemsRequired,
              location,
              solution,
              type,
            } = clue;

            return (
              <tr key={index}>
                <td>
                  {editing ? (
                    <select
                      value={type}
                      onChange={(e) =>
                        updateClue(index, { ...clue, type: e.target.value })
                      }
                    >
                      {[
                        'Anagram',
                        'Challenge Scroll',
                        'Charlie the Tramp',
                        'Cipher',
                        'Coordinates',
                        'Cryptic',
                        'Emote',
                        'Map',
                        'Music',
                        'Puzzle Box',
                      ].map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    type
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      value={clueHint}
                      onChange={(e) =>
                        updateClue(index, {
                          ...clue,
                          clueHint: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <ClueHint hint={clueHint} />
                  )}
                </td>
                <td>{solution}</td>
                <td>{location}</td>
                <td>{itemsRequired?.join(', ')}</td>
                <td>
                  {alternateChunks?.map((alt, index) => (
                    <React.Fragment key={`alt-chunk-${alt.x}-${alt.y}`}>
                      <span
                        className="alternate-chunk"
                        data-class="alternate-chunk-tooltip"
                        data-tip={alt.notes}
                        data-place="top"
                        data-background-color="#13135f"
                      >
                        ({alt.x}, {alt.y})
                      </span>
                      <ReactTooltip />

                      {alternateChunks.length > 1 &&
                        index < alternateChunks.length - 1 && <>, </>}
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  ) : (
    <></>
  );
};

export default ClueTable;
