// import NewRelic from "newrelic-react-native-agent";

// A dampening factor.  When determining average calls per second or
// current delay, we weigh the current value against the previous value 2:1
// to smooth spikes.
// See https://en.wikipedia.org/wiki/Exponential_smoothing
const SMOOTHING_FACTOR = 1 / 3;

// calculate the delay by subtracting the execution end time with the starting time
export const calculateDelay = (executionEndDate: number, executionStartDate: number, interval: number): number =>
  Math.max(0, executionEndDate - executionStartDate - interval);

// smooth delay to remove spikes
export const calculateSmoothingDelay = (delay: number, currentDelay: number): number =>
  SMOOTHING_FACTOR * delay + (1 - SMOOTHING_FACTOR) * currentDelay;

// sends event loop traces to firebase
// export async function sendEventLoopTrace(EventLoopDelay: number): Promise<void> {
//   NewRelic.recordMetric("EventLoopDelay", "Performance", EventLoopDelay);
// }
