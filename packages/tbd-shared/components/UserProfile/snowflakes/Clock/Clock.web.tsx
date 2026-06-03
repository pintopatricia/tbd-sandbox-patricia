import { FunctionComponent, useCallback, useState } from "react";

import { useInterval } from "@ppb/the-wall-web/hooks/useInterval";

import { ClockProps } from "./Clock.types";
import styles from "./Clock.web.css";

const getCurrentDate = (timeZone: ClockProps["timeZone"]): string =>
  new Date().toLocaleString("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });

export const Clock: FunctionComponent<ClockProps> = ({ timeZone }) => {
  const [date, setDate] = useState(getCurrentDate(timeZone));

  const refreshClock = useCallback(() => setDate(getCurrentDate(timeZone)), [timeZone]);

  useInterval(refreshClock, 60000);

  return (
    <div className={`typography-h158 ${styles.clock}`}>
      <span>{date}</span>
    </div>
  );
};
