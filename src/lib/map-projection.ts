/**
 * Projection of public/world-map.svg, which scripts/generate-world-map.ts draws with `dotted-map` (default
 * map, `height: 100`). dotted-map uses an ellipsoidal Mercator (proj4 `+proj=merc +datum=WGS84`) cropped to
 * longitudes -168..168 and to the Y range below, so markers must use the same maths or they drift north.
 * (The Aceternity component assumed a plain equirectangular -180..180 / -90..90 projection.)
 *
 * The constants are dotted-map's own `X_MIN`, `X_RANGE`, `Y_MAX` and `Y_RANGE` for that map; a unit test
 * compares this module against the library, so a change in the base map fails the tests.
 */

const WGS84_A = 6_378_137;
const WGS84_E = 0.0818191908426215;

const X_MIN = -18_701_674.453269962;
const X_RANGE = 37_403_348.906539924;
const Y_MAX = 11_361_819.887676764;
const Y_RANGE = 18_884_783.128941886;

/** Ellipsoidal Mercator Y in meters. */
function mercatorY(latDegrees: number): number {
  const phi = (latDegrees * Math.PI) / 180;
  const sin = Math.sin(phi);
  return WGS84_A * (Math.atanh(sin) - WGS84_E * Math.atanh(WGS84_E * sin));
}

/**
 * Position of a coordinate on the map as fractions of its width and height (0 to 1, top-left origin).
 * Multiply by the size of the drawing area (e.g. 800 x 400) to place a marker.
 */
export function projectToMap(
  lat: number,
  lng: number,
): { x: number; y: number } {
  const projectedX = WGS84_A * ((lng * Math.PI) / 180);
  return {
    x: (projectedX - X_MIN) / X_RANGE,
    y: (Y_MAX - mercatorY(lat)) / Y_RANGE,
  };
}
