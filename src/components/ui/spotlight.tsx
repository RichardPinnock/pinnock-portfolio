// Aceternity UI "spotlight". Changes from the source:
// - Decorative: the SVG is aria-hidden and the unused React import is gone.
// - The ellipse is softened with a radial gradient instead of an SVG Gaussian blur (stdDeviation 151) over a
//   3787x2842 canvas. The look is the same, but the filter cost ~1 s of main-thread rendering on mobile.
// `animate-spotlight` is defined in globals.css.
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

export const Spotlight = ({ className, fill }: SpotlightProps) => {
  return (
    <svg
      className={cn(
        "animate-spotlight pointer-events-none absolute z-[1]  h-[169%] w-[138%] lg:w-[84%] opacity-0",
        className,
      )}
      role="presentation"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <ellipse
        cx="1924.71"
        cy="273.501"
        rx="1924.71"
        ry="273.501"
        transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
        fill="url(#spotlight-gradient)"
      />
      <defs>
        <radialGradient id="spotlight-gradient">
          <stop offset="0" stopColor={fill || "white"} stopOpacity="0.3" />
          <stop offset="0.55" stopColor={fill || "white"} stopOpacity="0.12" />
          <stop offset="1" stopColor={fill || "white"} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};
