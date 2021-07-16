import { useEffect, useRef, useState } from 'react';

import { memo } from '../utils';

import loadingGif from '../images/loading.gif';

const ItemIcon: React.FC<{ item: string }> = ({ item }) => {
  const wikiPageName = Object.keys(wikiPageSpecialCases).includes(item)
    ? wikiPageSpecialCases[item]
    : item;
  const wikiPage = `https://oldschool.runescape.wiki/w/${encodeURI(
    wikiPageName.replaceAll(' ', '_')
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
    return <img className="loading-icon" src={loadingGif} aria-hidden />;
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

const headbandColors = [
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

for (const color of headbandColors) {
  headbandItems.push(`${color} headband`);
}

const boaterItems: string[] = [];

const boaterColors = [
  'Red',
  'Orange',
  'Green',
  'Blue',
  'Black',
  'Pink',
  'Purple',
  'White',
];

for (const color of boaterColors) {
  boaterItems.push(`${color} boater`);
}

const teamCapeItems: string[] = [];

for (let i = 1; i <= 50; i++) {
  teamCapeItems.push(`Team-${i} cape`);
}

teamCapeItems.push('Team cape i', 'Team cape x', 'Team cape zero');

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
  'Turquoise',
  'Hydra',
  'Twisted',
];

const slayerHelmItems = ['Slayer helmet'];

for (const variant of slayerHelmVariants) {
  slayerHelmItems.push(`${variant} slayer helmet`);
}

const fireCapeVariants = ['Fire', 'Infernal', 'Fire max', 'Infernal max'];

const fireCapeItems: string[] = [];

for (const variant of fireCapeVariants) {
  fireCapeItems.push(`${variant} cape (Normal)`);
}

const abyssalWhipItems = [
  'Abyssal whip',
  'Volcanic abyssal whip',
  'Frozen abyssal whip',
];

const zamorakGodswordItems = ['Zamorak godsword', 'Zamorak godsword (or)'];

const dragonAxeItems = [
  'Dragon axe',
  'Dragon axe (or)',
  'Infernal axe (Charged)',
  'Crystal axe (Active)',
];

const dragonPickAxeItems = [
  'Dragon pickaxe',
  'Dragon pickaxe (or)',
  'Dragon pickaxe (upgraded)',
  'Infernal pickaxe (Charged)',
  'Crystal pickaxe (Active)',
];

const ibansStaffItems = ["Iban's staff (Regular)", "Iban's staff (u)"];

const barrowsHeadPieceItems = [
  "Ahrim's hood (Undamaged)",
  "Dharok's helm (Undamaged)",
  "Guthan's helm (Undamaged)",
  "Karil's coif (Undamaged)",
  "Torag's helm (Undamaged)",
  "Verac's helm (Undamaged)",
];

const barrowsBodyPieceItems = [
  "Ahrim's robetop (Undamaged)",
  "Dharok's platebody (Undamaged)",
  "Guthan's platebody (Undamaged)",
  "Karil's leathertop (Undamaged)",
  "Torag's platebody (Undamaged)",
  "Verac's brassard (Undamaged)",
];

const barrowsLegPieceItems = [
  "Ahrim's robeskirt (Undamaged)",
  "Dharok's platelegs (Undamaged)",
  "Guthan's chainskirt (Undamaged)",
  "Karil's leatherskirt (Undamaged)",
  "Torag's platelegs (Undamaged)",
  "Verac's plateskirt (Undamaged)",
];

const barrowsWeaponItems = [
  "Ahrim's staff (Undamaged)",
  "Dharok's greataxe (Undamaged)",
  "Guthan's warspear (Undamaged)",
  "Karil's crossbow (Undamaged)",
  "Torag's hammers (Undamaged)",
  "Verac's flail (Undamaged)",
];

const logItems = [
  'Logs (Normal)',
  'Oak logs',
  'Willow logs',
  'Teak logs',
  'Arctic pine logs',
  'Maple logs',
  'Mahogany logs',
  'Yew logs',
  'Magic logs',
  'Redwood logs',
  'Achey tree logs',
];

const axeItems = [
  'Bronze axe',
  'Iron axe',
  'Steel axe',
  'Black axe',
  'Mithril axe',
  'Adamant axe',
  'Rune axe',
  'Blessed axe',
  'Gilded axe',
  'Dragon axe',
  'Dragon axe (or)',
  'Infernal axe (Charged)',
  'Crystal axe (Active)',
  '3rd age axe',
];

const amuletOfGloryItems = [
  'Amulet of glory (Uncharged)',
  'Amulet of glory (6)',
  'Amulet of eternal glory',
];

const itemSets: {
  [name: string]: string[];
} = {
  Axe: axeItems,
  'Abyssal whip': abyssalWhipItems,
  'Amulet of glory': amuletOfGloryItems,
  'Barrows body piece': barrowsBodyPieceItems,
  'Barrows head piece': barrowsHeadPieceItems,
  'Barrows leg piece': barrowsLegPieceItems,
  'Barrows weapon': barrowsWeaponItems,
  Boater: boaterItems,
  'Bob shirt': bobShirtItems,
  Cloak: cloakItems,
  Crozier: crozierItems,
  'Dragon axe': dragonAxeItems,
  'Dragon pickaxe': dragonPickAxeItems,
  'Fire cape': fireCapeItems,
  'God book': godBookItems,
  Headband: headbandItems,
  "Iban's staff": ibansStaffItems,
  'Light sources': lightSourceItems,
  'Log (disambiguation)': logItems,
  Mitre: mitreItems,
  'Pirate bandana': pirateBandanaItems,
  'Rune heraldic armour#Full helm': runeHeraldicFullHelmItems,
  'Rune heraldic armour#Kiteshield': runeHeraldicShieldItems,
  'Slayer helmet': slayerHelmItems,
  Stole: stoleItems,
  'Team cape': teamCapeItems,
  'Zamorak godsword': zamorakGodswordItems,
};

const wikiPageSpecialCases: { [name: string]: string } = {
  'Barrows head piece': 'Barrows equipment',
  'Barrows body piece': 'Barrows equipment',
  'Barrows leg piece': 'Barrows equipment',
  'Barrows weapon': 'Barrows equipment',
};
