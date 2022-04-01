import { useEffect, useState } from 'react';
import qs from 'qs';

import { compressUnlockedChunks } from './utils';

const RedirectOrTransferData: React.FC<{}> = () => {
  const UNLOCKED_CHUNKS_KEY = 'UNLOCKED_CHUNKS';

  const width = 43;
  const height = 25;

  const newDomain = 'https://cluechunkmap.com/';
  const timeTillRedirect = 3 * 1000; // 3 seconds

  const [transferring, setTransferring] = useState(true);

  function redirectToNewDomain(u?: string, t?: string) {
    setTransferring(false);

    setTimeout(() => {
      window.location.href = `${newDomain}${u ? `?u=${u}` : ''}${
        t ? `?t=${t}` : ''
      }`;
    }, timeTillRedirect);
  }

  useEffect(() => {
    // check for query string
    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    if (query && query.u) {
      redirectToNewDomain(query.u as string);
      return;
    }

    // check for saved data
    const unlockedChunksJson = localStorage.getItem(UNLOCKED_CHUNKS_KEY);

    if (!unlockedChunksJson) {
      redirectToNewDomain();
      return;
    }

    // transfer saved data
    const unlockedChunks = JSON.parse(unlockedChunksJson);
    const compressed = compressUnlockedChunks(width, height, unlockedChunks);
    redirectToNewDomain(undefined, compressed);
  });

  return (
    <p>
      {transferring
        ? 'Please be patient while we automagically transfer your map data...'
        : 'Redirecting you to our new website...'}
    </p>
  );
};

export default RedirectOrTransferData;
