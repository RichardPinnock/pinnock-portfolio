"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { LatLng } from "./globe";

// WebGL, cobe and the animation loop stay out of the initial bundle and out of the LCP path.
const Globe = dynamic(() => import("./globe"), { ssr: false });

interface GlobeLazyProps {
  origin: LatLng;
  destinations: LatLng[];
  caption: string;
}

export function GlobeLazy({ origin, destinations, caption }: GlobeLazyProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait until the browser is idle so the headline and CTAs paint first.
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(() => setReady(true), {
        timeout: 3000,
      });
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(handle);
  }, []);

  return (
    <div
      role="img"
      aria-label={caption}
      className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none"
    >
      {/* Static stand-in with the globe's footprint: avoids layout shift while the chunk loads. */}
      <div
        aria-hidden
        className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--color-brand-800),var(--color-brand-950)_70%,transparent)] opacity-60 blur-[1px]"
      />
      {ready ? <Globe origin={origin} destinations={destinations} /> : null}
    </div>
  );
}
