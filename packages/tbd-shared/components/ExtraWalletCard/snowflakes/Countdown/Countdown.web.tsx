import { FunctionComponent } from "react";
import classNames from "classnames";
import { CountdownProps, CountdownType } from "./Countdown.types";
import styles from "./Countdown.web.css";

export const Countdown: FunctionComponent<CountdownProps> = ({ text, type = CountdownType.DEFAULT }) => (
  <span className={classNames(styles.countdown, { [styles.alert]: type === CountdownType.ALERT })}>{text}</span>
);
