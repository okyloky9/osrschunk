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
                {/* Type */}
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

                {/* Clue */}
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

                {/* Solution */}
                <td>
                  {editing ? (
                    <input
                      value={solution || ''}
                      onChange={(e) =>
                        updateClue(index, {
                          ...clue,
                          solution: e.target.value,
                        })
                      }
                    />
                  ) : (
                    solution
                  )}
                </td>

                {/* Location */}
                <td>
                  {editing ? (
                    <input
                      value={location || ''}
                      onChange={(e) =>
                        updateClue(index, {
                          ...clue,
                          location: e.target.value,
                        })
                      }
                    />
                  ) : (
                    location
                  )}
                </td>

                {/* Items */}
                <td>
                  {editing ? (
                    <input
                      value={itemsRequired ? itemsRequired.join(',') : ''}
                      onChange={(e) =>
                        updateClue(index, {
                          ...clue,
                          itemsRequired: e.target.value.split(','),
                        })
                      }
                    />
                  ) : (
                    itemsRequired?.join(', ')
                  )}
                </td>

                {/* Alternate Chunks */}
                <td>
                  {editing ? (
                    <>
                      {alternateChunks?.map((alt, index) => (
                        <div className="edit-alternate-chunk">
                          <div>
                            <input
                              min={0}
                              max={99}
                              type="number"
                              value={alt.x}
                            />
                            ,{' '}
                            <input
                              min={0}
                              max={99}
                              type="number"
                              value={alt.y}
                            />
                            <br />
                            <input value={alt.notes} />
                          </div>

                          <div className="right">
                            <button type="button">X</button>
                          </div>
                        </div>
                      ))}

                      {alternateChunks?.length && <br />}

                      <button type="button">+</button>
                    </>
                  ) : (
                    alternateChunks?.map((alt, index) => (
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
                    ))
                  )}
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
