import { useEffect, useState } from 'react';

import { memo } from '../utils';

const getIcon = memo((item: string) => {
  return fetch(
    `https://api.osrsbox.com/items?where=${encodeURI(
      JSON.stringify({ name: item, duplicate: false })
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data && data._items && data._items.length && data._items[0].icon) {
        return data._items[0].icon;
      } else {
        console.log(`Could not find icon for "${item}".`);
        return undefined;
      }
    });
});

const ItemIcon: React.FC<{ item: string }> = ({ item }) => {
  const wikiPage = `https://oldschool.runescape.wiki/w/${encodeURI(item)}`;

  const [icon, setIcon] = useState<string>();

  useEffect(() => {
    getIcon(item).then((i: string) => {
      setIcon(i);
    });
  }, [item]);

  return (
    <a href={wikiPage} target="_blank">
      {icon ? (
        <img src={`data:image/png;base64, ${icon}`} title={item} />
      ) : (
        item
      )}
    </a>
  );
};

export default ItemIcon;
