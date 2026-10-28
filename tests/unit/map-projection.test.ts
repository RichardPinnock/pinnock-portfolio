import DottedMap from "dotted-map";
import { describe, expect, it } from "vitest";
import { projectToMap } from "../../src/lib/map-projection.ts";

// Same settings as scripts/generate-world-map.ts.
const map = new DottedMap({ height: 100, grid: "diagonal" });
const { width, height } = map.image;

const places: [string, number, number][] = [
  ["Havana", 23.1136, -82.3666],
  ["Madrid", 40.4637, -3.7492],
  ["Lisbon", 38.7223, -9.1393],
  ["Mexico City", 19.4326, -99.1332],
  ["Beijing", 39.9042, 116.4074],
  ["Santiago", -33.4489, -70.6693],
  ["New York", 40.7128, -74.006],
];

describe("projectToMap", () => {
  it.each(
    places,
  )("%s lands on the dot dotted-map would pin", (_name, lat, lng) => {
    const pin = map.getPin({ lat, lng });
    expect(pin).toBeDefined();
    const mine = projectToMap(lat, lng);
    // dotted-map snaps pins to its dot grid (about one unit), so allow that much.
    expect(Math.abs(mine.x * width - (pin?.x ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs(mine.y * height - (pin?.y ?? 0))).toBeLessThanOrEqual(1);
  });

  it("places Havana south of Madrid and west of it", () => {
    const havana = projectToMap(23.1136, -82.3666);
    const madrid = projectToMap(40.4637, -3.7492);
    expect(havana.y).toBeGreaterThan(madrid.y);
    expect(havana.x).toBeLessThan(madrid.x);
  });

  it("is not the naive equirectangular projection", () => {
    // Havana at 23.1 N would be y = 0.372 on a -90..90 map; Mercator on this crop puts it lower.
    expect(projectToMap(23.1136, -82.3666).y).toBeGreaterThan(0.42);
  });
});
