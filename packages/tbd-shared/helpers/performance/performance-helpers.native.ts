import { AppState } from "react-native";
import { calculateDelay, calculateSmoothingDelay } from "./performance-utils.native";

// time to delay beetween every event loop execution
const EVENT_LOOP_DELAY_INTERVAL = 1000;

let executionStartDate: number;
let currentDelay = 0;
let checkInterval: NodeJS.Timeout;

// starts the event loop metrics with exponential smoothing strategies to remove spikes
export const startEventLoop = (): void => {
  executionStartDate = Date.now();

  clearInterval(checkInterval);
  checkInterval = setInterval(() => {
    const appState = AppState.currentState;

    // check if app is not in background otherwise we will have a big spike
    if (appState === "active") {
      const executionEndDate = Date.now();

      // restart dates when app enters foreground
      if (executionStartDate === -1) {
        executionStartDate = executionEndDate;
      }

      /* we use Math.max to handle the case where timers are running efficiently
       * and our callback executes earlier than `interval` due to how timers are
       * implemented. This means we're healthy.
       *
       * With the formula: executionEndDate - executionStartDate - this.interval
       * we calculate the delay that the event loop have between the start and
       * end of a loop execution
       */
      const delay = calculateDelay(executionEndDate, executionStartDate, EVENT_LOOP_DELAY_INTERVAL);

      /*
       * Calculate the current delay with a smoothing delay to remove spikes,
       * check SMOOTHING_FACTOR initialization at the top of this file.
       */
      currentDelay = calculateSmoothingDelay(delay, currentDelay);
      executionStartDate = executionEndDate;

      // sendEventLoopTrace(currentDelay);
    } else {
      currentDelay = 0;
      executionStartDate = -1;
    }
  }, EVENT_LOOP_DELAY_INTERVAL);
};
