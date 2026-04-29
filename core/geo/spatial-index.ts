export type Point = { lat: number; lon: number };

export class SpatialIndex {
  private grid = new Map<string, Point[]>();

  private hash(p: Point) {
    return `${Math.floor(p.lat * 100)}:${Math.floor(p.lon * 100)}`;
  }

  insert(p: Point) {
    const key = this.hash(p);
    if (!this.grid.has(key)) this.grid.set(key, []);
    this.grid.get(key)?.push(p);
  }

  query(p: Point) {
    return this.grid.get(this.hash(p)) || [];
  }
}
