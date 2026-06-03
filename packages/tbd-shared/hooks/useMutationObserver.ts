import { useRef, useMemo, useEffect } from "react";

export function useMutationObserver<T extends HTMLElement>(onMutate: MutationCallback, options?: MutationObserverInit) {
  const elementRef = useRef<T | null>(null);

  const observer = useMemo(() => {
    return new MutationObserver(onMutate);
  }, [onMutate]);

  useEffect(() => {
    if (elementRef.current) {
      observer.observe(elementRef.current, {
        childList: true,
        ...options,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [observer, options]);

  return elementRef;
}
