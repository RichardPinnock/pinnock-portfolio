"use client";

import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";

export type LatLng = [number, number];

interface GlobeProps {
  origin: LatLng;
  destinations: LatLng[];
}

// Brand-400 / brand-900 expressed as 0-1 RGB, the format cobe expects.
const BRAND: [number, number, number] = [0.56, 0.55, 0.88];
const SURFACE: [number, number, number] = [0.13, 0.12, 0.28];
const GLOW: [number, number, number] = [0.18, 0.16, 0.42];

const BUFFER_SIZE = 800;
const SWEEP_RADIANS = 0.35;

/** cobe measures phi from a different meridian than longitude, hence the offset. */
const lngToPhi = (lng: number) =>
  Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2);

/** Decorative WebGL globe: one origin point and arcs towards the client countries. */
export default function Globe({ origin, destinations }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        rootMargin: "120px",
      },
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !inView) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const points = [origin, ...destinations];
    const centerLng =
      points.reduce((sum, [, lng]) => sum + lng, 0) / points.length;
    const centerLat =
      points.reduce((sum, [lat]) => sum + lat, 0) / points.length;
    const basePhi = lngToPhi(centerLng);
    const theta = (centerLat * Math.PI) / 180 / 2;

    let globe: ReturnType<typeof createGlobe>;
    try {
      globe = createGlobe(canvas, {
        width: BUFFER_SIZE,
        height: BUFFER_SIZE,
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        phi: basePhi,
        theta,
        dark: 1,
        diffuse: 1.4,
        mapSamples: 16_000,
        mapBrightness: 5,
        baseColor: SURFACE,
        markerColor: BRAND,
        glowColor: GLOW,
        opacity: 0.95,
        markerElevation: 0.01,
        markers: [
          { location: origin, size: 0.09, id: "origin" },
          ...destinations.map((location, index) => ({
            location,
            size: 0.05,
            id: `dest-${index}`,
          })),
        ],
        arcs: destinations.map((to, index) => ({
          from: origin,
          to,
          id: `arc-${index}`,
        })),
        arcColor: BRAND,
        arcWidth: 0.6,
        arcHeight: 0.3,
      });
    } catch {
      // No WebGL (old browser, blocked GPU): the static placeholder stays visible.
      return;
    }

    let frame = 0;
    if (!reducedMotion) {
      const start = performance.now();
      const tick = (now: number) => {
        // Sweep around the Atlantic midpoint so the connections never leave the view.
        const phi = basePhi + Math.sin((now - start) / 2600) * SWEEP_RADIANS;
        globe.update({ phi });
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }

    canvas.style.opacity = "1";
    return () => {
      cancelAnimationFrame(frame);
      globe.destroy();
    };
  }, [inView, origin, destinations]);

  return (
    <canvas
      ref={canvasRef}
      width={BUFFER_SIZE}
      height={BUFFER_SIZE}
      aria-hidden
      className="absolute inset-0 size-full opacity-0 transition-opacity duration-700"
    />
  );
}
