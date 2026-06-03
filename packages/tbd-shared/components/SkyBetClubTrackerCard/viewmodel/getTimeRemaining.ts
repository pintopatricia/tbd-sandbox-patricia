import { timeLeftFormatter } from "../../../formatters/time-formatters";

export default (locale: string, now: Date, fulfillmentEndDate: string | null): string => {
  let timeRemaining = "";

  if (fulfillmentEndDate) {
    const nowTime = now.getTime();
    const endTime = Date.parse(fulfillmentEndDate);

    if (endTime) {
      timeRemaining = timeLeftFormatter(locale, endTime - nowTime, true);
    }
  }

  return timeRemaining;
};
