import LZString from 'lz-string';

export function compressUnlockedChunks(
  width: number,
  height: number,
  unlocked: { x: number; y: number }[]
) {
  // method 0
  let bitString = '';

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      bitString += unlocked.find((chunk) => chunk.x === x && chunk.y === y)
        ? 1
        : 0;
    }
  }

  const method0: string = LZString.compressToEncodedURIComponent(
    `0${bitString}`
  );

  const remainder = bitString.length % 8;
  const zeroesToAdd = remainder ? 8 - remainder : 0;

  for (let i = 0; i < zeroesToAdd; i++) {
    bitString += '0';
  }

  // method 1
  let str = '';

  for (let i = 0; i < bitString.length / 8; i++) {
    const num = parseInt(bitString.substr(i * 8, 8), 2);
    str += String.fromCharCode(num);
  }

  const method1: string = LZString.compressToEncodedURIComponent(`1${str}`);

  // compare and return shorter outut
  return method1.length < method0.length ? method1 : method0;
}
