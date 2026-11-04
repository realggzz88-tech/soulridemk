import { useEffect, useRef, useState, type ReactNode } from "react";
import { shouldMountDeferred } from "@/lib/defer-decision";

interface DeferMountProps {
  children: ReactNode;
  fallback: (activate: () => void) => ReactNode;
  /** Render children on the first pass. Used so unit tests can see below-fold content. */
  eager?: boolean;
}

export function DeferMount({ children, fallback, eager = false }: DeferMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [requested, setRequested] = useState(false);
  const [seen, setSeen] = useState(false);
  const [startedInView, setStartedInView] = useState(false);
  const [intersecting, setIntersecting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const active = shouldMountDeferred({
    eager,
    requested,
    seen,
    startedInView,
    intersecting,
    scrolled,
  });

  useEffect(() => {
    if (eager || requested) return;
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setRequested(true);
      return;
    }

    let decided = false;
    let initiallyVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (!decided) {
          decided = true;
          initiallyVisible = visible;
          setStartedInView(visible);
        }
        setSeen(true);
        setIntersecting(visible);
      },
      { threshold: [0, 0.15] },
    );
    observer.observe(element);

    const onScroll = () => {
      if (window.scrollY > 8) setScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [eager, requested]);

  return (
    <div ref={ref}>
      {active ? children : fallback(() => setRequested(true))}
    </div>
  );
}
