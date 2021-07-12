import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { ClueTable, StashUnitTable } from '.';
import type { Chunk, Clue, StashUnit } from '../models';
import chunkJson from '../data/chunk-data.json';
import killCreatureClueJson from '../data/kill-creature-clue-data.json';
import stashUnitJson from '../data/stash-unit-data.json';

const SearchModal: React.FC = () => {
  const searchClueHintsId = 'search-clue-hints';
  const searchItemsId = 'search-items';

  const debounceTime = 300;

  const [clueQuery, setClueQuery] = useState('');
  const [itemQuery, setItemQuery] = useState('');

  const [debouncedClueQuery] = useDebounce(clueQuery, debounceTime);
  const [debouncedItemQuery] = useDebounce(itemQuery, debounceTime);

  const [stashUnits, setStashUnits] = useState<StashUnit[]>([]);

  const [beginnerClues, setBeginnerClues] = useState<Clue[]>([]);
  const [easyClues, setEasyClues] = useState<Clue[]>([]);
  const [mediumClues, setMediumClues] = useState<Clue[]>([]);
  const [hardClues, setHardClues] = useState<Clue[]>([]);
  const [eliteClues, setEliteClues] = useState<Clue[]>([]);
  const [masterClues, setMasterClues] = useState<Clue[]>([]);

  const clueDifficulties = [
    'beginner',
    'easy',
    'medium',
    'hard',
    'elite',
    'master',
  ];

  const clueSetters = [
    setBeginnerClues,
    setEasyClues,
    setMediumClues,
    setHardClues,
    setEliteClues,
    setMasterClues,
  ];

  const searchClues = useCallback((query: string) => {
    const cluesOfEachDifficulty: { [x: string]: Clue[] } = {};
    for (const difficulty of clueDifficulties) {
      cluesOfEachDifficulty[difficulty] = [];
    }

    function filterClues(chunk: Chunk, difficulty: string): Clue[] {
      const key = `${difficulty}Clues`;
      const cluesOfDifficulty = (chunk as any as { [x: string]: Clue[] })[key];

      const matchingClues = cluesOfDifficulty
        ? cluesOfDifficulty
            .filter(
              ({ clueHint }) =>
                clueHint &&
                clueHint.toLowerCase().includes(query) &&
                !cluesOfEachDifficulty[difficulty].find(
                  (clue) => clue.clueHint === clueHint
                )
            )
            .map((clue) => ({
              ...clue,
              alternateChunks: [
                { x: chunk.x, y: chunk.y },
                ...(clue.alternateChunks ? clue.alternateChunks : []),
              ],
            }))
        : [];

      return matchingClues;
    }

    function transformCreatureClue(creatureClue: Clue): Clue {
      return {
        ...creatureClue,
        alternateChunks: creatureClue.creatures?.reduce(
          (chunks, creature) => [
            ...chunks,
            ...creature.chunks
              .map((chunk) => ({ x: chunk.x, y: chunk.y }))
              .filter(
                (chunk) =>
                  !chunks.find(
                    (alreadyAddedChunk) =>
                      alreadyAddedChunk.x === chunk.x &&
                      alreadyAddedChunk.y === chunk.y
                  )
              ),
          ],
          [] as any[]
        ),
      };
    }

    if (query && query.length >= 3) {
      for (const chunk of chunkJson) {
        for (const difficulty of clueDifficulties) {
          cluesOfEachDifficulty[difficulty].push(
            ...filterClues(chunk, difficulty)
          );
        }
      }

      for (const creatureClue of killCreatureClueJson.eliteClues) {
        if (creatureClue.clueHint.toLowerCase().includes(query)) {
          cluesOfEachDifficulty['elite'].push(
            transformCreatureClue(creatureClue)
          );
        }
      }

      for (const creatureClue of killCreatureClueJson.masterClues) {
        if (creatureClue.clueHint.toLowerCase().includes(query)) {
          cluesOfEachDifficulty['master'].push(
            transformCreatureClue(creatureClue)
          );
        }
      }
    }

    for (const [index, setter] of clueSetters.entries()) {
      setter(cluesOfEachDifficulty[clueDifficulties[index]]);
    }
  }, []);

  const searchItems = useCallback((query: string) => {
    const _stashUnits: StashUnit[] = [];

    const cluesOfEachDifficulty: { [x: string]: Clue[] } = {};
    for (const difficulty of clueDifficulties) {
      cluesOfEachDifficulty[difficulty] = [];
    }

    function filterClues(chunk: Chunk, difficulty: string): Clue[] {
      const key = `${difficulty}Clues`;
      const cluesOfDifficulty = (chunk as any as { [x: string]: Clue[] })[key];

      const matchingClues = cluesOfDifficulty
        ? cluesOfDifficulty
            .filter(
              ({ clueHint, itemsRequired }) =>
                itemsRequired &&
                itemsRequired.find((item) =>
                  item.toLowerCase().includes(query)
                ) &&
                !(
                  clueHint &&
                  cluesOfEachDifficulty[difficulty].find(
                    (clue) => clue.clueHint === clueHint
                  )
                )
            )
            .map((clue) => ({
              ...clue,
              alternateChunks: [
                { x: chunk.x, y: chunk.y },
                ...(clue.alternateChunks ? clue.alternateChunks : []),
              ],
            }))
        : [];

      return matchingClues;
    }

    if (query && query.length >= 3) {
      for (const chunk of stashUnitJson) {
        for (const unit of chunk.stashUnits) {
          if (unit.items.find((item) => item.toLowerCase().includes(query))) {
            _stashUnits.push({ ...unit, chunk: { x: chunk.x, y: chunk.y } });
          }
        }
      }

      for (const chunk of chunkJson) {
        for (const difficulty of clueDifficulties) {
          cluesOfEachDifficulty[difficulty].push(
            ...filterClues(chunk, difficulty)
          );
        }
      }
    }

    setStashUnits(_stashUnits);

    for (const [index, setter] of clueSetters.entries()) {
      setter(cluesOfEachDifficulty[clueDifficulties[index]]);
    }
  }, []);

  useEffect(() => {
    if (debouncedItemQuery) {
      searchItems(debouncedItemQuery.toLowerCase().trim());
    } else {
      searchClues(debouncedClueQuery.toLowerCase().trim());
    }
  }, [debouncedClueQuery, debouncedItemQuery]);

  return (
    <div id="search-modal">
      <h1>Search Clue Steps &amp; STASH Units</h1>

      <form>
        <p className="search-by">Search By</p>

        <div className="inputs">
          <div>
            <label htmlFor={searchClueHintsId}>Clue</label>:{' '}
            <input
              id={searchClueHintsId}
              type="text"
              value={clueQuery}
              onChange={(e) => {
                setItemQuery('');
                setClueQuery(e.target.value);
              }}
            />
          </div>

          <div>
            <label htmlFor={searchItemsId}>Item Name</label>:{' '}
            <input
              id={searchItemsId}
              type="text"
              value={itemQuery}
              onChange={(e) => {
                setClueQuery('');
                setItemQuery(e.target.value);
              }}
            />
          </div>
        </div>
      </form>

      <div>
        <StashUnitTable units={stashUnits} />
      </div>

      <div>
        <ClueTable clues={beginnerClues} difficulty="Beginner" search />
      </div>

      <div>
        <ClueTable clues={easyClues} difficulty="Easy" search />
      </div>

      <div>
        <ClueTable clues={mediumClues} difficulty="Medium" search />
      </div>

      <div>
        <ClueTable clues={hardClues} difficulty="Hard" search />
      </div>

      <div>
        <ClueTable clues={eliteClues} difficulty="Elite" search />
      </div>

      <div>
        <ClueTable clues={masterClues} difficulty="Master" search />
      </div>
    </div>
  );
};

export default SearchModal;
