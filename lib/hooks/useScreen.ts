import { useEffect, useState } from "react";

type BreakPoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export function useScreen(): { [key in BreakPoint]?: boolean };
export function useScreen(breakpoint: BreakPoint): boolean;
export function useScreen(breakpoint?: BreakPoint): boolean | { [key in BreakPoint]?: boolean } {
  function getBreakPoints() {
    const breakPoints: { [key in BreakPoint]?: boolean } = {};
    if (typeof window !== "undefined") {
      let width = window.innerWidth;
      breakPoints["xxl"] = width >= 1536;
      breakPoints["xl"] = width >= 1280;
      breakPoints["lg"] = width >= 1024;
      breakPoints["md"] = width >= 768;
      breakPoints["sm"] = width >= 640;
      breakPoints["xs"] = width >= 480;
    }
    return breakPoints;
  }

  const [breakPoints, setBreakPoints] = useState<{ [key in BreakPoint]?: boolean }>({});
  useEffect(() => {
    function handleResize() {
      setBreakPoints(getBreakPoints());
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return breakpoint ? breakPoints[breakpoint] : breakPoints;
}
