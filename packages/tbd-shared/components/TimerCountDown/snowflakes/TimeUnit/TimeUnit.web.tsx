import { FunctionComponent } from "react";
import { TimeGroupItem } from "../Timer/Timer.types";
import styles from "./TimeUnit.web.css";

export const TimeUnit: FunctionComponent<TimeGroupItem> = ({ label, value }) => (
  <div className={styles.timeUnit}>
    <div className={styles.timeDigits}>
      {value.map((val, key) => (
        <div className={styles.timerBorder} key={key}>
          <span className={styles.timerLabel}>{val}</span>
        </div>
      ))}
    </div>
    <span className={styles.text}>{label}</span>
  </div>
);
