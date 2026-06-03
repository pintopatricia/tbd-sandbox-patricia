import { useState, useCallback } from "react";

const useForceRender = () => {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return forceUpdate;
};

export { useForceRender };
