import { FunctionComponent } from "react";
import styles from "./Pill.web.css";

type PillProperties = {
  label: string | undefined;
  showDot?: boolean;
};

export const Pill: FunctionComponent<PillProperties> = ({ label, showDot = false }) => (
  <div className={`${styles.pillWrapper} ${showDot ? styles.withDot : ""}`}>
    <div className={styles.pillContainer}>
      <span className={styles.label}>{label}</span>
    </div>
  </div>
);
