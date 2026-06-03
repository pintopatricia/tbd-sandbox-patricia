import { FunctionComponent, useMemo } from "react";
import { View } from "react-native";
import { IncidentIconSize } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { IncidentIcon } from "@ppb/the-wall-native/components/IncidentIcon/IncidentIcon";
import { Incident } from "../Incident/Incident.native";
import { IncidentEventsProps } from "./IncidentEvents.types";
import {
  INCIDENT_EVENTS,
  INCIDENT_EVENTS_HOME,
  INCIDENT_EVENTS_AWAY,
  INCIDENT_EVENTS_ICON,
} from "./IncidentEvents.native.selectors";

import styles from "./IncidentEvents.native.styles";

export const IncidentEvents: FunctionComponent<IncidentEventsProps> = ({
  homeIncidents,
  awayIncidents,
  categoryIcon,
}) => {
  const homeColumnStyles = useMemo(
    () => [styles.incidentColumn, categoryIcon ? styles.scoreboardVariantHomeColumn : styles.defaultVariantHomeColumn],
    [categoryIcon],
  );

  const awayColumnStyles = useMemo(
    () => [styles.incidentColumn, categoryIcon ? styles.scoreboardVariantAwayColumn : styles.defaultVariantAwayColumn],
    [categoryIcon],
  );

  return (
    <View style={styles.container} {...getTestProps(INCIDENT_EVENTS, false)}>
      <View style={homeColumnStyles} {...getTestProps(INCIDENT_EVENTS_HOME, false)}>
        {homeIncidents.map((incident, index) => (
          <Incident key={`home-${index}`} {...incident} />
        ))}
      </View>

      {categoryIcon && (
        <IncidentIcon
          {...getTestProps(INCIDENT_EVENTS_ICON, false)}
          isHighlighted
          type={categoryIcon}
          size={IncidentIconSize.BIG}
        />
      )}

      <View style={awayColumnStyles} {...getTestProps(INCIDENT_EVENTS_AWAY, false)}>
        {awayIncidents.map((incident, index) => (
          <Incident key={`away-${index}`} {...incident} />
        ))}
      </View>
    </View>
  );
};
