import { useState, useEffect } from "react";

// Increment step value
const INCREMENT = 0.01;
const STOP_AFTER = 6;
function useTicker(value: number, delta: number, autostop: boolean) {
  const deltaDefault = delta || 300;

  const [ticker, setTicker] = useState(value);

  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setTicker(value);
  }

  useEffect(() => {
    if (ticker > 0) {
      const interval = setInterval(
        () => {
          setTicker(ticker + INCREMENT);
        },
        deltaDefault + Math.random() * deltaDefault,
      );
      // Stop the increment when the ticker is greater than the initial value
      if (autostop && ticker > value + STOP_AFTER) {
        clearInterval(interval);
      }
      return () => {
        clearInterval(interval);
      };
    }
    return () => {};
  }, [autostop, deltaDefault, ticker, value]);
  return { ticker };
}
export default useTicker;
