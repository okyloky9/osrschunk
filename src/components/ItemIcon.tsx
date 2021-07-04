import { useEffect, useRef, useState } from 'react';

import { memo } from '../utils';

const ItemIcon: React.FC<{ item: string }> = ({ item }) => {
  const wikiPage = `https://oldschool.runescape.wiki/w/${encodeURI(
    item.replaceAll(' ', '_')
  )}`;

  const [icons, setIcons] = useState<string[]>([]);
  const [iconInterval, setIconInterval] = useState<number>();

  const iconToShowRef = useRef(0);
  const [iconToShow, _setIconToShow] = useState(iconToShowRef.current);
  const setIconToShow = (i: number) => {
    iconToShowRef.current = i;
    _setIconToShow(i);
  };

  function nextIcon() {
    setIconToShow((iconToShowRef.current + 1) % icons.length);
  }

  // get the icon(s)
  useEffect(() => {
    if (Object.keys(itemSets).includes(item)) {
      const items = itemSets[item as any];

      (async () => {
        const _icons = [];

        for (const _item of items) {
          const _icon = await getIcon(undefined, _item);
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

  // set or clear the interval
  useEffect(() => {
    if (icons.length > 1 && !iconInterval) {
      const _iconInterval = setInterval(() => {
        nextIcon();
      }, 1000) as any as number;

      setIconInterval(_iconInterval);
    } else if (icons.length <= 1 && iconInterval) {
      clearInterval(iconInterval);
      setIconInterval(undefined);
      setIconToShow(0);
    }
  }, [icons, iconInterval]);

  // cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (iconInterval) clearInterval(iconInterval);
    };
  }, [iconInterval]);

  // if no icons, show the item name
  if (icons.length === 0) {
    return <>{item}</>;
  }

  // show the icon(s)
  return (
    <a href={wikiPage} target="_blank">
      <img src={`data:image/png;base64, ${icons[iconToShow]}`} title={item} />
    </a>
  );
};

export default ItemIcon;

// memoized method for fetching an icon
const getIcon = memo((name: string, wiki_name: string) => {
  return fetch(
    `https://api.osrsbox.com/items?where=${encodeURI(
      JSON.stringify({ name, wiki_name, duplicate: false })
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data && data._items && data._items.length && data._items[0].icon) {
        return data._items[0].icon;
      } else {
        console.log(`Could not find icon for "${name ? name : wiki_name}".`);
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
const headbandItems: string[] = [];

for (const color of colors) {
  headbandItems.push(`${color} headband`);
}

const teamCapeItems: string[] = [];

for (let i = 1; i <= 50; i++) {
  teamCapeItems.push(`Team-${i} cape`);
}

const lightSourceItems = [
  'Torch (Lit)',
  'Candle (Lit)',
  'Black candle (Lit)',
  'Candle lantern (Lit (white candle))',
  'Candle lantern (Lit (black candle))',
  'Oil lamp (Lit)',
  'Oil lantern (Lit)',
  'Bullseye lantern (Lit)',
  'Sapphire lantern (Lit)',
  'Emerald lantern (Lit)',
  'Mining helmet (Lit)',
  'Kandarin headgear 1',
  'Kandarin headgear 2',
  'Kandarin headgear 3',
  'Kandarin headgear 4',
  'Firemaking cape (Untrimmed)',
  'Firemaking cape (Trimmed)',
  'Max cape',
  'Bruma torch',
];

const godBookItems = [
  'Book of balance',
  'Book of darkness',
  'Book of law',
  'Book of war',
  'Holy book',
  'Unholy book',
];

const pirateBandanaItems = [
  'Pirate bandana (blue)',
  'Pirate bandana (white)',
  'Pirate bandana (brown)',
  'Pirate bandana (red)',
];

const bobShirtItems = [
  "Bob's black shirt",
  "Bob's blue shirt",
  "Bob's green shirt",
  "Bob's purple shirt",
  "Bob's red shirt",
];

const runeHeraldicFullHelmItems: string[] = [];
const runeHeraldicShieldItems: string[] = [];

for (let i = 1; i <= 5; i++) {
  runeHeraldicFullHelmItems.push(`Rune helm (h${i})`);
  runeHeraldicShieldItems.push(`Rune shield (h${i})`);
}

const slayerHelmVariants = [
  'Black',
  'Green',
  'Red',
  'Purple',
  'Turqoise',
  'Hydra',
  'Twisted',
];

const slayerHelmItems = ['Slayer helmet'];

for (const variant of slayerHelmVariants) {
  slayerHelmItems.push(`${variant} slayer helmet`);
}

const itemSets = {
  'Bob shirt': bobShirtItems,
  Cloak: cloakItems,
  Crozier: crozierItems,
  'God book': godBookItems,
  Headband: headbandItems,
  'Light sources': lightSourceItems,
  Mitre: mitreItems,
  'Pirate bandana': pirateBandanaItems,
  'Rune heraldic armour#Full helm': runeHeraldicFullHelmItems,
  'Rune heraldic armour#Kiteshield': runeHeraldicShieldItems,
  'Slayer helmet': slayerHelmItems,
  Stole: stoleItems,
  'Team cape': teamCapeItems,
} as {
  [name: string]: string[];
};
