import { FunctionComponent } from "react";
import { MinuteIncidents } from "../MinuteIncidents/MinuteIncidents.web";
import { MinuteByMinuteCommonProps } from "./MinuteByMinute.types";
import styles from "./MinuteByMinute.web.module.css";

export const MinuteByMinute: FunctionComponent<MinuteByMinuteCommonProps> = ({ incidents }) => (
  <div className={styles.minuteByMinuteContainer}>
    {incidents.map((incident, index) => (
      <MinuteIncidents
        key={index}
        minute={incident.minute}
        extraTimeMinute={incident.extraTimeMinute}
        events={incident.events}
      />
    ))}
  </div>
);
