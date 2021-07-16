import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { ClueTable, StashUnitTable } from '.';
import type { Chunk, Clue, StashUnit } from '../models';
import { memo } from '../utils';
import chunkJson from '../data/chunk-data.json';
import killCreatureClueJson from '../data/kill-creature-clue-data.json';
import stashUnitJson from '../data/stash-unit-data.json';

// difficulties
const clueDifficulties = [
  'beginner',
  'easy',
  'medium',
  'hard',
  'elite',
  'master',
];

// memoized search by clue hint
const searchClues = memo((query: string) => {
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

  return {
    stashUnits: [] as StashUnit[],
    cluesOfEachDifficulty,
  };
});

// memoized search by item name
const searchItems = memo((query: string) => {
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

  // sort stash units by difficulty
  const stashUnitOrdering: { [x: string]: number } = {
    Beginner: 0,
    Easy: 1,
    Medium: 2,
    Hard: 3,
    Elite: 4,
    Master: 5,
  };

  _stashUnits.sort((a, b) => {
    const aOrder = stashUnitOrdering[a.difficulty];
    const bOrder = stashUnitOrdering[b.difficulty];

    if (aOrder === bOrder) return 0;
    return aOrder > bOrder ? 1 : -1;
  });

  return {
    stashUnits: _stashUnits,
    cluesOfEachDifficulty,
  };
});

const SearchModal: React.FC<{ goToChunk: (x: number, y: number) => void }> = ({
  goToChunk,
}) => {
  const searchClueHintsId = 'search-clue-hints';
  const searchItemsId = 'search-items';

  const debounceTime = 300;

  const clueQueryInput = useRef<HTMLInputElement>(null);

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

  // setters for difficulties
  const clueSetters = [
    setBeginnerClues,
    setEasyClues,
    setMediumClues,
    setHardClues,
    setEliteClues,
    setMasterClues,
  ];

  useEffect(() => {
    // do the search
    const searchResults = debouncedItemQuery
      ? searchItems(debouncedItemQuery.toLowerCase().trim())
      : searchClues(debouncedClueQuery.toLowerCase().trim());

    // set stash unit results
    setStashUnits(searchResults.stashUnits);

    // set clue step results
    for (const [index, setter] of clueSetters.entries()) {
      setter(searchResults.cluesOfEachDifficulty[clueDifficulties[index]]);
    }
  }, [debouncedClueQuery, debouncedItemQuery]);

  // focus first input on modal open
  useEffect(() => {
    if (!clueQueryInput.current) return;

    clueQueryInput.current.focus();
  }, [clueQueryInput]);

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
              ref={clueQueryInput}
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
        <StashUnitTable units={stashUnits} goToChunk={goToChunk} />
      </div>

      <div>
        <ClueTable
          clues={beginnerClues}
          difficulty="Beginner"
          goToChunk={goToChunk}
          search
        />
      </div>

      <div>
        <ClueTable
          clues={easyClues}
          difficulty="Easy"
          goToChunk={goToChunk}
          search
        />
      </div>

      <div>
        <ClueTable
          clues={mediumClues}
          difficulty="Medium"
          goToChunk={goToChunk}
          search
        />
      </div>

      <div>
        <ClueTable
          clues={hardClues}
          difficulty="Hard"
          goToChunk={goToChunk}
          search
        />
      </div>

      <div>
        <ClueTable
          clues={eliteClues}
          difficulty="Elite"
          goToChunk={goToChunk}
          search
        />
      </div>

      <div>
        <ClueTable
          clues={masterClues}
          difficulty="Master"
          goToChunk={goToChunk}
          search
        />
      </div>
    </div>
  );
};

export default SearchModal;
