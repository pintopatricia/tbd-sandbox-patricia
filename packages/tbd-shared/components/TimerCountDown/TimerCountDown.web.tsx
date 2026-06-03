import { useEffect, useState } from "react";
import * as React from "react";

import { Timer } from "./snowflakes/Timer/Timer.web";

import { ComponentProps, i18nLabels } from "./props";
import { isValidNumber, timeFormatter } from "./helper";

const TimerCountDown: React.FC<ComponentProps> = ({ targetDate, title, updateInterval = 60000 }) => {
  const [timerProps, setTimerProps] = useState<{
    days?: number;
    hours?: number;
    minutes?: number;
  }>({});

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const timeDifference = targetDate.getTime() - now.getTime();

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        const newState: typeof timerProps = {};

        if (days > 0) {
          newState.days = days;
        } else {
          newState.hours = hours;
          newState.minutes = minutes;
        }

        setTimerProps(newState);
      } else {
        setTimerProps({});
      }
    };

    updateTimer();

    const timer = setInterval(updateTimer, updateInterval);

    return () => clearInterval(timer);
  }, [targetDate, updateInterval]);

  /* 
    Note: For the current use case, the component will display only the days remaining. 
    If the period is less than a day, it will show hours and minutes instead.
  */
  return (
    <Timer
      label={title}
      days={
        isValidNumber(timerProps.days) ? { label: i18nLabels.days, value: timeFormatter(timerProps.days) } : undefined
      }
      hours={
        !timerProps.days && isValidNumber(timerProps.hours)
          ? { label: i18nLabels.hours, value: timeFormatter(timerProps.hours) }
          : undefined
      }
      minutes={
        !timerProps.days && isValidNumber(timerProps.minutes)
          ? { label: i18nLabels.minutes, value: timeFormatter(timerProps.minutes) }
          : undefined
      }
    />
  );
};

export default TimerCountDown;
