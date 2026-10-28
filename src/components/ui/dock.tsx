// Magic UI "dock" (context-based version used by the magicuidesign/portfolio template).
// Adapted to the site's square shape language: rounded-md / rounded-lg instead of full pills.
"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { cn } from "@/lib/utils";

interface DockContextValue {
  mouseX: MotionValue<number>;
  magnification: number;
  distance: number;
  size: number;
}

const DockContext = createContext<DockContextValue | null>(null);

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 56;
const DEFAULT_DISTANCE = 100;
const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };

interface DockProps {
  className?: string;
  children: ReactNode;
  size?: number;
  magnification?: number;
  distance?: number;
  label?: string;
}

export function Dock({
  className,
  children,
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  label,
}: DockProps) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const reduceMotion = useReducedMotion();

  return (
    <DockContext.Provider
      value={{
        mouseX,
        // Reduced motion keeps the dock static: no magnification.
        magnification: reduceMotion ? size : magnification,
        distance,
        size,
      }}
    >
      <motion.nav
        aria-label={label}
        onMouseMove={(event) => mouseX.set(event.pageX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className={cn(
          "mx-auto flex h-full w-max items-end justify-center overflow-visible rounded-lg border",
          className,
        )}
      >
        {children}
      </motion.nav>
    </DockContext.Provider>
  );
}

export function DockIcon({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(DockContext);
  if (!context) throw new Error("DockIcon must be used within a Dock");
  const { mouseX, magnification, distance, size } = context;

  const distanceFromPointer = useTransform(mouseX, (value: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return value - bounds.x - bounds.width / 2;
  });
  const containerSize = useSpring(
    useTransform(
      distanceFromPointer,
      [-distance, 0, distance],
      [size, magnification, size],
    ),
    SPRING,
  );
  const iconSize = useSpring(
    useTransform(
      distanceFromPointer,
      [-distance, 0, distance],
      [size / 2, magnification / 2, size / 2],
    ),
    SPRING,
  );

  return (
    <motion.div
      ref={ref}
      style={{ width: containerSize, height: containerSize }}
      className={cn(
        "relative flex aspect-square shrink-0 items-center justify-center rounded-md",
        className,
      )}
    >
      <motion.div
        style={{ width: iconSize, height: iconSize }}
        className="flex items-center justify-center"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
