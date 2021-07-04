export default class MapChunk {
  public x: number;
  public y: number;

  public unlocked = true;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
