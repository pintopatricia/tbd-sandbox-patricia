import { useState, useEffect } from "react";

const useViewportHeight = () => {
  const [vh, setVH] = useState<number | undefined>(undefined);

  useEffect(() => {
    const setSize = () => {
      if (window.innerHeight && !CSS.supports("max-height: 100svh")) {
        setVH(window.innerHeight);
      }
    };

    setSize();

    window.addEventListener("resize", setSize);

    return () => window.removeEventListener("resize", setSize);
  }, []);

  return { vh };
};

export default useViewportHeight;
