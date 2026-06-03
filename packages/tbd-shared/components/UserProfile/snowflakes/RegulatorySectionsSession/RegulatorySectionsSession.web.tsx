import { FunctionComponent } from "react";
import { RegulatorySectionsSessionProps } from "./RegulatorySections.types";
import styles from "./RegulatorySectionsSession.web.css";

export const RegulatorySectionsSession: FunctionComponent<RegulatorySectionsSessionProps> = ({ item }) => (
  <div className={styles.container}>
    {!!item.text && <div className={styles.textLabel}>{item.text}</div>}
    <div className={styles.timeLabel}>
      {item.time
        .toLocaleString("en-GB", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", " - ")}
    </div>
  </div>
);
