import { FunctionComponent, useMemo } from "react";
import { TimerProps } from "./Timer.types";
import styles from "./Timer.web.css";
import { TimeUnit } from "../TimeUnit/TimeUnit.web";

export const Timer: FunctionComponent<TimerProps> = ({ label, days, hours, minutes }) => {
  const renderDays = useMemo(() => {
    if (!days) {
      return null;
    }

    return (
      <>
        <TimeUnit value={days.value} label={days.label} />
        {(hours || minutes) && <span className={styles.timerSign}></span>}
      </>
    );
  }, [days, hours, minutes]);

  const renderHours = useMemo(() => {
    if (!hours) {
      return null;
    }

    return (
      <>
        <TimeUnit value={hours.value} label={hours.label} />
        {minutes && <span className={styles.timerSign}>:</span>}
      </>
    );
  }, [hours, minutes]);

  const renderMinutes = useMemo(
    () => (minutes ? <TimeUnit value={minutes.value} label={minutes.label} /> : null),
    [minutes],
  );

  return (
    <div className={styles.timerContainer}>
      {label && <span className={styles.timerTopLabel}>{label}</span>}
      <div className={styles.countDownTimer}>
        {renderDays}
        {renderHours}
        {renderMinutes}
      </div>
    </div>
  );
};
