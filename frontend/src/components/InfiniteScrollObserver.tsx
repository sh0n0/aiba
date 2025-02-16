import { useEffect, useRef } from "react";

interface InfiniteScrollObserverProps {
  onIntersect: () => void;
  threshold?: number;
  children?: React.ReactNode;
}

export function InfiniteScrollObserver({ onIntersect, threshold = 0.1, children }: InfiniteScrollObserverProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold },
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
      observer.disconnect();
    };
  }, [onIntersect, threshold]);

  return <div ref={observerRef}>{children}</div>;
}
