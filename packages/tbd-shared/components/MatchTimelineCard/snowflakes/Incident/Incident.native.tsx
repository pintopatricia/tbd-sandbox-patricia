import { FunctionComponent, useMemo } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { IncidentIcon } from "@ppb/the-wall-native/components/IncidentIcon/IncidentIcon";
import { Text } from "@ppb/the-wall-native";
import { IncidentDisplayOrder, IncidentProps } from "./Incident.types";
import { INCIDENT, INCIDENT_ICON, INCIDENT_MINUTE, INCIDENT_PLAYER } from "./Incident.native.selectors";
import styles from "./Incident.native.styles";

export const Incident: FunctionComponent<IncidentProps> = ({ icon, minute, minutes, player, displayOrder }) => {
  const isReversed = [IncidentDisplayOrder.REVERSED, IncidentDisplayOrder.REVERSED_LINES].includes(displayOrder);
  const hasLines = [IncidentDisplayOrder.NORMAL_LINES, IncidentDisplayOrder.REVERSED_LINES].includes(displayOrder);

  const containerStyle = useMemo(() => [styles.container, isReversed && styles.reverse], [isReversed]);
  const playerStyle = useMemo(() => [styles.player, isReversed && styles.playerReverse], [isReversed]);
  const wrapContainerStyles = useMemo(
    () => [styles.wrapContainer, isReversed && styles.reverse, hasLines && styles.wrapContainerLines],
    [isReversed, hasLines],
  );
  const minuteStyles = useMemo(() => [styles.minute, isReversed && styles.minuteReverse], [isReversed]);

  if (!minutes?.length && minute === undefined) {
    return null;
  }

  const minutesArray = minutes ?? [`${minute}`];
  const minutesString = minutesArray.reduce((acc, min, index) => {
    if (index !== 0) {
      return `${acc}, ${min}'`;
    }

    return `${min}'`;
  }, "");

  return (
    <View style={containerStyle} {...getTestProps(INCIDENT, false)}>
      {!!icon && (
        <View style={styles.iconWrapper} {...getTestProps(INCIDENT_ICON, false)}>
          <IncidentIcon isHighlighted type={icon} />
        </View>
      )}

      <View style={wrapContainerStyles}>
        <Text style={minuteStyles} {...getTestProps(INCIDENT_MINUTE)}>
          {minutesString}
        </Text>

        {!!player && (
          <Text numberOfLines={hasLines ? 1 : undefined} style={playerStyle} {...getTestProps(INCIDENT_PLAYER)}>
            {player}
          </Text>
        )}
      </View>
    </View>
  );
};
