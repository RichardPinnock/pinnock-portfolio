// Adapted from Aceternity UI "world-map" (https://ui.aceternity.com). Changes from the source:
// - No `next-themes`: the site is dark-only, so the light/dark switch is gone and the background is transparent.
// - The base map is the static /world-map.svg (scripts/generate-world-map.ts) instead of a ~960 KB
//   data: URI built with `dotted-map` on every render.
// - Respects `prefers-reduced-motion`: arcs are drawn at once and the dot pulses stop.
"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

const projectPoint = (lat: number, lng: number) => {
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (400 / 180);
  return { x, y };
};

const dotKey = (dot: NonNullable<MapProps["dots"]>[number]) =>
  `${dot.start.lat},${dot.start.lng}-${dot.end.lat},${dot.end.lng}`;

const createCurvedPath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
) => {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 50;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
};

function PulsingDot({
  x,
  y,
  color,
  animated,
}: {
  x: number;
  y: number;
  color: string;
  animated: boolean;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r="2" fill={color} />
      {animated ? (
        <circle cx={x} cy={y} r="2" fill={color} opacity="0.5">
          <animate
            attributeName="r"
            from="2"
            to="8"
            dur="1.5s"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.5"
            to="0"
            dur="1.5s"
            begin="0s"
            repeatCount="indefinite"
          />
        </circle>
      ) : null}
    </g>
  );
}

export default function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
}: MapProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="w-full aspect-[2/1] rounded-lg relative font-sans">
      <Image
        src="/world-map.svg"
        unoptimized
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
        alt=""
        height={533}
        width={1056}
        draggable={false}
      />
      <svg
        viewBox="0 0 800 400"
        role="presentation"
        aria-hidden
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-${dotKey(dot)}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{ pathLength: reduceMotion ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: reduceMotion ? 0 : 1,
                  delay: reduceMotion ? 0 : 0.5 * i,
                  ease: "easeOut",
                }}
              />
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot) => {
          const start = projectPoint(dot.start.lat, dot.start.lng);
          const end = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`points-${dotKey(dot)}`}>
              <PulsingDot
                x={start.x}
                y={start.y}
                color={lineColor}
                animated={!reduceMotion}
              />
              <PulsingDot
                x={end.x}
                y={end.y}
                color={lineColor}
                animated={!reduceMotion}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
