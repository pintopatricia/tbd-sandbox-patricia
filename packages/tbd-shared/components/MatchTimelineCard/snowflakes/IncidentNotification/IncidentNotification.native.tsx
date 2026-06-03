import { FunctionComponent } from "react";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { Text } from "@ppb/the-wall-native";
import { IncidentNotificationProps } from "./IncidentNotification.types";
import { INCIDENT_NOTIFICATION } from "./IncidentNotification.native.selectors";
import styles from "./IncidentNotification.native.styles";

export const IncidentNotification: FunctionComponent<IncidentNotificationProps> = ({
  minute,
  incidentLabel,
  playerName,
  teamName,
}) => (
  <Text style={styles.notification} numberOfLines={1} {...getTestProps(INCIDENT_NOTIFICATION, false)}>
    <Text style={styles.time}>{`${minute}, ${incidentLabel}! `}</Text>
    {playerName && <Text style={styles.names}>{`${playerName}, `}</Text>}
    {teamName && <Text style={styles.names}>{teamName}</Text>}
  </Text>
);
