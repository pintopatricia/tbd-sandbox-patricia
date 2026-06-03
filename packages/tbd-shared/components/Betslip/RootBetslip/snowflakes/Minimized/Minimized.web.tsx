import { FunctionComponent } from "react";

import { Counter } from "@ppb/the-wall-web";
import { MinimizedProps } from "./Minimized.types";

import styles from "./Minimized.web.css";

export const Minimized: FunctionComponent<MinimizedProps> = ({ children, counter, color }) => (
  <h2 className={styles.titleContainer}>
    <Counter color={color} value={counter} />
    <span className={styles.title}>{children}</span>
  </h2>
);
