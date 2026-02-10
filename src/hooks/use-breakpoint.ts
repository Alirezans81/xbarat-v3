import * as React from "react";

type BreakpointKey = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

const BREAKPOINTS: Array<{ key: BreakpointKey; min: number }> = [
  { key: "2xl", min: 1536 },
  { key: "xl", min: 1280 },
  { key: "lg", min: 1024 },
  { key: "md", min: 768 },
  { key: "sm", min: 640 },
  { key: "base", min: 0 },
];

function getBreakpoint(width: number): BreakpointKey {
  for (const bp of BREAKPOINTS) {
    if (width >= bp.min) return bp.key;
  }
  return "base";
}

export function useBreakpointValue<T>(
  values: Partial<Record<BreakpointKey, T>>,
  fallback?: T,
) {
  const [breakpoint, setBreakpoint] = React.useState<BreakpointKey>("base");

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const ordered: BreakpointKey[] = ["base", "sm", "md", "lg", "xl", "2xl"];

  const bpIndex = ordered.indexOf(breakpoint);

  for (let i = bpIndex; i >= 0; i--) {
    const key = ordered[i];
    if (values[key] !== undefined) {
      return values[key] as T;
    }
  }

  return fallback as T;
}
