import { useEffect, useRef } from "react";

export default function usePrevious<T>(state: T): T {
  const ref = useRef<T>(state);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  // eslint-disable-next-line react-hooks/refs -- using ref as a cache
  return ref.current;
}
