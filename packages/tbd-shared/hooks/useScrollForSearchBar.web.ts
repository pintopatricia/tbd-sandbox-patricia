import { useEffect, useRef, useState } from "react";

export function useScrollForSearchBar(active: boolean) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTopRef = useRef(0);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [prevActive, setPrevActive] = useState(active);
  if (prevActive !== active) {
    setPrevActive(active);
    if (!active) setIsVisible(true);
  }

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const safeScrollTop = Math.max(currentScrollTop, 0);

      if (throttleTimeoutRef.current) return;

      throttleTimeoutRef.current = setTimeout(() => {
        throttleTimeoutRef.current = null;

        if (safeScrollTop > lastScrollTopRef.current) {
          setIsVisible(false); // scrolling down
        } else if (safeScrollTop < lastScrollTopRef.current) {
          setIsVisible(true); // scrolling up
        }
        lastScrollTopRef.current = safeScrollTop;
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [active]);

  return isVisible;
}
