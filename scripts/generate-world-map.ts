// Generates public/world-map.svg, the dotted base map used by the hero (src/components/ui/world-map.tsx).
// Run with `pnpm world-map` and commit the result; it only changes if the dotted-map settings change.
//
// Why a file: dotted-map's own getSVG() emits one <circle> per dot (~590 KB). The Aceternity component
// inlines that as a data: URI on every render, which would land in the HTML. A single <path> of
// zero-length round-capped strokes draws the same dots in a fraction of the size and is cacheable.
import { mkdirSync, writeFileSync } from "node:fs";
import DottedMap from "dotted-map";

const HEIGHT = 100;
const RADIUS = 0.22;

const map = new DottedMap({ height: HEIGHT, grid: "diagonal" });
const points = map.getPoints().toSorted((a, b) => a.y - b.y || a.x - b.x);
const width = map.image.width;

const round = (value: number) => Number(value.toFixed(2));

// Relative moves keep the path short: each dot is "m<dx> <dy>h0".
let previous = { x: 0, y: 0 };
const commands = points.map((point) => {
  const command = `m${round(point.x - previous.x)} ${round(point.y - previous.y)}h0`;
  previous = point;
  return command;
});

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${HEIGHT}">` +
  `<path fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="${RADIUS * 2}" stroke-linecap="round" d="${commands.join("")}"/>` +
  `</svg>\n`;

mkdirSync(new URL("../public/", import.meta.url), { recursive: true });
writeFileSync(new URL("../public/world-map.svg", import.meta.url), svg);
console.log(
  `public/world-map.svg: ${points.length} dots, ${svg.length} bytes (viewBox ${width}x${HEIGHT}).`,
);
