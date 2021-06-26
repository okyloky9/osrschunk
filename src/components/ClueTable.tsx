import { Clue, ClueDifficulty } from '../models';
import ClueIcon from './ClueIcon';

const ClueTable: React.FC<{
  clues: Clue[] | undefined;
  difficulty: ClueDifficulty;
}> = ({ clues, difficulty }) => {
  const ClueHint = ({ hint }: { hint: string }) => {
    return hint.startsWith('http') ? <img src={hint} /> : <>{hint}</>;
  };

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
          </tr>
        </thead>

        <tbody>
          {clues.map(
            ({ clueHint, itemsRequired, location, solution, type }) => (
              <tr key={clueHint}>
                <td>{type}</td>
                <td>
                  <ClueHint hint={clueHint} />
                </td>
                <td>{solution}</td>
                <td>{location}</td>
                <td>{itemsRequired?.join(', ')}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  ) : (
    <></>
  );
};

export default ClueTable;
