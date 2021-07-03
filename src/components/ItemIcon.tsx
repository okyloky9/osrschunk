import { useEffect, useState } from 'react';

import { memo } from '../utils';

const ItemIcon: React.FC<{ item: string }> = ({ item }) => {
  const wikiPage = `https://oldschool.runescape.wiki/w/${encodeURI(item)}`;

  const [icons, setIcons] = useState<string[]>();

  useEffect(() => {
    if (Object.keys(itemSets).includes(item)) {
      const items = itemSets[item as any];

      (async () => {
        const _icons = [];

        for (const _item of items) {
          const _icon = await getIcon(_item);
          _icons.push(_icon);
        }

        setIcons(_icons);
      })();
    } else {
      getIcon(item).then((i: string) => {
        setIcons([i]);
      });
    }
  }, [item]);

  return (
    <a href={wikiPage} target="_blank">
      {icons ? (
        <img src={`data:image/png;base64, ${icons[0]}`} title={item} />
      ) : (
        item
      )}
    </a>
  );
};

export default ItemIcon;

// memoized method for fetching an icon
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

// item sets
const gods = ['Saradomin', 'Guthix', 'Zamorak', 'Armadyl', 'Bandos', 'Ancient'];

const cloakItems = [];
const crozierItems = [];
const mitreItems = [];
const stoleItems = [];

for (const god of gods) {
  cloakItems.push(`${god} cloak`);
  crozierItems.push(`${god} crozier`);
  mitreItems.push(`${god} mitre`);
  stoleItems.push(`${god} stole`);
}

const colors = [
  'Red',
  'Black',
  'Brown',
  'White',
  'Blue',
  'Gold',
  'Pink',
  'Green',
];
const headbandItems = [];

for (const color of colors) {
  headbandItems.push(`${color} headband`);
}

const teamCapeItems = [];

for (let i = 1; i <= 50; i++) {
  teamCapeItems.push(`Team-${i} cape`);
}

const itemSets = {
  Cloak: cloakItems,
  Crozier: crozierItems,
  Headband: headbandItems,
  Mitre: mitreItems,
  Stole: stoleItems,
  'Team cape': teamCapeItems,
} as {
  [name: string]: string[];
};
