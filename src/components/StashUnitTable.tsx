import { ItemIcon } from '.';
import type { StashUnit } from '../models';

const StashUnitTable: React.FC<{ units?: StashUnit[] }> = ({ units }) => {
  if (!units || !units.length) {
    return <></>;
  }

  return (
    <div className="stash-unit-table">
      <h2>STASH Units</h2>

      <table>
        <thead>
          <th>Type</th>
          <th>Apperance</th>
          <th>Location</th>
          <th>Items</th>
          <th>Chunk</th>
        </thead>

        <tbody>
          {units.map(({ difficulty, type, location, items, chunk }) => (
            <tr key={location}>
              <td>{difficulty}</td>
              <td>{type}</td>
              <td>{location}</td>
              <td>
                {items.map((item, index) => (
                  <ItemIcon item={item} key={index} />
                ))}
              </td>
              <td className="chunk-coords">
                ({chunk?.x}, {chunk?.y})
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StashUnitTable;
