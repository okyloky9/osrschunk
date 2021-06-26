export function listHasChunk(list: number[][], coords: number[]): boolean {
  const [x1, y1] = coords;

  return !!list.find(([x2, y2]) => x1 === x2 && y1 === y2);
}

export function createClassString(object: {
  [className: string]: boolean;
}): string | undefined {
  const classes = [];

  for (const [key, value] of Object.entries(object)) {
    if (value) classes.push(key);
  }

  return classes.length ? classes.join(' ') : undefined;
}
