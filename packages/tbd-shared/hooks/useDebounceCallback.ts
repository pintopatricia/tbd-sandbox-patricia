import { useCallback, useRef } from "react";

type DebounceCallback = (...args: any) => void;

export function useDebounceCallback<T extends DebounceCallback>(callback: T, delay?: number): T {
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tracker = useCallback(
    (...args: any) => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => callback(...args), delay || 500);
    },
    [callback, delay],
  );

  return tracker as T;
}
