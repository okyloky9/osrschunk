import { Clue } from '../models';

const ClueTable: React.FC<{ clues: Clue[] | undefined; type: string }> = ({
  clues,
  type,
}) => {
  return clues && clues.length ? (
    <>
      <h2>{type} Clues</h2>

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
                <td>{clueHint}</td>
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
