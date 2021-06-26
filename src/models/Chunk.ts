export default class Chunk {
  public x: number;
  public y: number;

  public unlocked = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
