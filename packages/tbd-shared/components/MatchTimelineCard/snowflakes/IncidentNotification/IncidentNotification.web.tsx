import { FunctionComponent } from "react";

import { IncidentNotificationProps } from "./IncidentNotification.types";
import styles from "./IncidentNotification.web.css";

export const IncidentNotification: FunctionComponent<IncidentNotificationProps> = ({
  minute,
  incidentLabel,
  playerName,
  teamName,
}) => (
  <div className={styles.notification}>
    <span className="typography-h180">{`${minute}, ${incidentLabel}! `}</span>
    {playerName && <span className="typography-h120">{`${playerName}, `}</span>}
    {teamName && <span className="typography-h120">{teamName}</span>}
  </div>
);
