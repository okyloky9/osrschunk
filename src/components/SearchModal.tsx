import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import type { Chunk, Clue } from '../models';
import chunkJson from '../data/chunk-data.json';
import stashUnitJson from '../data/stash-unit-data.json';

import { ClueTable } from '.';

const SearchModal: React.FC = () => {
  const searchClueHintsId = 'search-clue-hints';
  const searchItemsId = 'search-items';

  const debounceTime = 300;

  const [clueQuery, setClueQuery] = useState('');
  const [itemQuery, setItemQuery] = useState('');

  const [debouncedClueQuery] = useDebounce(clueQuery, debounceTime);
  const [debouncedItemQuery] = useDebounce(itemQuery, debounceTime);

  const [beginnerClues, setBeginnerClues] = useState<Clue[]>([]);
  const [easyClues, setEasyClues] = useState<Clue[]>([]);
  const [mediumClues, setMediumClues] = useState<Clue[]>([]);
  const [hardClues, setHardClues] = useState<Clue[]>([]);
  const [eliteClues, setEliteClues] = useState<Clue[]>([]);
  const [masterClues, setMasterClues] = useState<Clue[]>([]);

  const [killCreatureEliteClues, setKillCreatureEliteClues] = useState<Clue[]>(
    []
  );
  const [killCreatureMasterClues, setKillCreatureMasterClues] = useState<
    Clue[]
  >([]);

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
    function filterClues(chunk: Chunk, difficulty: string): Clue[] {
      const key = `${difficulty}Clues`;
      const cluesOfDifficulty = (chunk as any as { [x: string]: Clue[] })[key];

      const matchingClues = cluesOfDifficulty
        ? cluesOfDifficulty.filter(
            ({ clueHint }) => clueHint && clueHint.toLowerCase().includes(query)
          )
        : [];

      return matchingClues;
    }

    const cluesOfEachDifficulty: { [x: string]: Clue[] } = {};
    for (const difficulty of clueDifficulties) {
      cluesOfEachDifficulty[difficulty] = [];
    }

    if (query) {
      for (const chunk of chunkJson) {
        for (const difficulty of clueDifficulties) {
          cluesOfEachDifficulty[difficulty].push(
            ...filterClues(chunk, difficulty)
          );
        }
      }
    }

    for (const [index, setter] of clueSetters.entries()) {
      setter(cluesOfEachDifficulty[clueDifficulties[index]]);
    }
  }, []);

  useEffect(() => {
    searchClues(debouncedClueQuery.toLowerCase().trim());
  }, [debouncedClueQuery]);

  return (
    <div id="search-modal">
      <h1>Search Clue Steps &amp; STASH Units</h1>

      <form>
        <p className="search-by">Search By</p>

        <div className="inputs">
          <div>
            <label htmlFor={searchClueHintsId}>Clue Hint</label>:{' '}
            <input
              id={searchClueHintsId}
              type="text"
              value={clueQuery}
              onChange={(e) => setClueQuery(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor={searchItemsId}>Item Name</label>:{' '}
            <input
              id={searchItemsId}
              type="text"
              value={itemQuery}
              onChange={(e) => setItemQuery(e.target.value)}
            />
          </div>
        </div>
      </form>

      <div>
        <ClueTable clues={beginnerClues} difficulty="Beginner" />
      </div>

      <div>
        <ClueTable clues={easyClues} difficulty="Easy" />
      </div>

      <div>
        <ClueTable clues={mediumClues} difficulty="Medium" />
      </div>

      <div>
        <ClueTable clues={hardClues} difficulty="Hard" />
      </div>

      <div>
        <ClueTable
          clues={[...eliteClues, ...killCreatureEliteClues]}
          difficulty="Elite"
        />
      </div>

      <div>
        <ClueTable
          clues={[...masterClues, ...killCreatureMasterClues]}
          difficulty="Master"
        />
      </div>
    </div>
  );
};

export default SearchModal;
