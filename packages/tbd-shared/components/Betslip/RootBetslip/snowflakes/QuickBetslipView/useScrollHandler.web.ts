import { useEffect, useRef } from "react";

export const useScrollHandler = (onScrollUp: () => void, onScrollDown: () => void) => {
  const lastScrollY = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window?.scrollY ?? 0;

      if (lastScrollY.current !== null) {
        const scrollDelta = currentScrollY - lastScrollY.current;

        if (scrollDelta > 0) {
          onScrollDown();
        } else if (scrollDelta < 0) {
          onScrollUp();
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window?.removeEventListener("scroll", handleScroll);
    };
  }, [onScrollUp, onScrollDown]);
};
